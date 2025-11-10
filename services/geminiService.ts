import { GoogleGenAI, Type } from "@google/genai";
import { Load, Truck, PackingSolution } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        totalTrucks: { type: Type.INTEGER, description: "The total number of trucks required." },
        trucks: {
            type: Type.ARRAY,
            description: "An array of trucks, each containing the loads it will carry.",
            items: {
                type: Type.OBJECT,
                properties: {
                    truckNumber: { type: Type.INTEGER, description: "A unique identifier for each truck, starting from 1." },
                    loads: {
                        type: Type.ARRAY,
                        description: "An array of loads assigned to this truck.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING, description: "The unique ID of the load." },
                                name: { type: Type.STRING, description: "The name of the package." },
                                weight: { type: Type.NUMBER, description: "The weight of the load in kg." },
                                volume: { type: Type.NUMBER, description: "The volume of the load in cubic meters." },
                            },
                            required: ["id", "name", "weight", "volume"],
                        },
                    },
                    totalWeight: { type: Type.NUMBER, description: "The sum of the weights of all loads in this truck." },
                    totalVolume: { type: Type.NUMBER, description: "The sum of the volumes of all loads in this truck." },
                    weightUtilization: { type: Type.NUMBER, description: "The percentage of the truck's weight capacity that is used (0-100)." },
                    volumeUtilization: { type: Type.NUMBER, description: "The percentage of the truck's volume capacity that is used (0-100)." },
                },
                required: ["truckNumber", "loads", "totalWeight", "totalVolume", "weightUtilization", "volumeUtilization"],
            },
        },
    },
    required: ["totalTrucks", "trucks"],
};

export async function calculatePackingSolution(loads: Load[], truck: Truck): Promise<PackingSolution> {
  const model = 'gemini-2.5-flash';

  const prompt = `
    You are an expert logistics coordinator solving a 3D bin packing problem for truck loading.
    Your goal is to pack all the given loads into the minimum number of identical trucks, while respecting the weight and volume constraints of each truck.

    Truck Constraints:
    - Type: ${truck.name}
    - Maximum Weight Capacity: ${truck.maxWeight} kg
    - Maximum Volume Capacity: ${truck.maxVolume} cubic meters

    Loads to be packed:
    Each object in the following array represents a type of package. The 'quantity' field indicates how many identical units of that package need to be shipped. The 'weight' and 'volume' are for a single unit.
    ${JSON.stringify(loads, null, 2)}

    Task:
    1. Determine the most efficient packing arrangement to minimize the number of trucks used. This involves unpacking the quantities of each load type into individual items for packing.
    2. Ensure that for each truck, the sum of the weights of its loads does not exceed ${truck.maxWeight} kg.
    3. Ensure that for each truck, the sum of the volumes of its loads does not exceed ${truck.maxVolume} cubic meters.
    4. Provide the final solution as a JSON object that strictly adheres to the provided schema. In the output, list each individual package assigned to a truck. Do not group them back by quantity. Calculate the total weight, total volume, and utilization percentages for each truck accurately.
  `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.1,
        }
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Received an empty response from the API.");
    }
    
    // Validate that the response is valid JSON
    let parsedResponse: PackingSolution;
    try {
        parsedResponse = JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonText);
        throw new Error("The API returned an invalid JSON format. Please try again.");
    }

    return parsedResponse;

  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get a packing solution from the AI. Please check your inputs or try again later.");
  }
}
