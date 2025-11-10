
import React, { useState, useCallback } from 'react';
import { Load, Truck, PackingSolution } from './types';
import { AVAILABLE_TRUCKS } from './constants';
import LoadInputForm from './components/LoadInputForm';
import LoadList from './components/LoadList';
import TruckSelector from './components/TruckSelector';
import ResultsDisplay from './components/ResultsDisplay';
import { calculatePackingSolution } from './services/geminiService';

export default function App() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [selectedTruck, setSelectedTruck] = useState<Truck>(AVAILABLE_TRUCKS[0]);
  const [packingSolution, setPackingSolution] = useState<PackingSolution | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addLoad = (load: Omit<Load, 'id'>) => {
    const newLoad: Load = { ...load, id: `load-${Date.now()}-${Math.random()}` };
    setLoads(prevLoads => [...prevLoads, newLoad]);
  };

  const removeLoad = (id: string) => {
    setLoads(prevLoads => prevLoads.filter(load => load.id !== id));
  };
  
  const handleCalculate = useCallback(async () => {
    if (loads.length === 0 || !selectedTruck) {
      setError("Please add at least one load and select a truck type.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPackingSolution(null);

    try {
      const solution = await calculatePackingSolution(loads, selectedTruck);
      setPackingSolution(solution);
    } catch (err) {
      console.error("Error calculating packing solution:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please check the console.");
    } finally {
      setIsLoading(false);
    }
  }, [loads, selectedTruck]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 tracking-wider">
            LogiPack AI
          </h1>
          <p className="text-sm text-gray-400 hidden md:block">AI-Powered Shipment Optimizer</p>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2 text-cyan-300">1. Add Packages</h2>
                <LoadInputForm onAddLoad={addLoad} />
                <LoadList loads={loads} onRemoveLoad={removeLoad} />
            </div>
             <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2 text-cyan-300">2. Select Truck</h2>
                <TruckSelector 
                    trucks={AVAILABLE_TRUCKS} 
                    selectedTruck={selectedTruck} 
                    onSelectTruck={setSelectedTruck} 
                />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 min-h-[400px]">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 border-b border-gray-600 pb-2">
                 <h2 className="text-xl font-semibold text-cyan-300 mb-2 sm:mb-0">3. Optimized Shipment Plan</h2>
                 <button
                    onClick={handleCalculate}
                    disabled={isLoading || loads.length === 0}
                    className="w-full sm:w-auto px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Optimizing...
                      </>
                    ) : (
                      "Generate Plan"
                    )}
                 </button>
              </div>

              <ResultsDisplay 
                solution={packingSolution} 
                isLoading={isLoading} 
                error={error} 
                hasLoads={loads.length > 0}
                selectedTruck={selectedTruck}
              />
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center py-4 mt-8 text-gray-500 text-sm">
        <p>Powered by Google Gemini API</p>
      </footer>
    </div>
  );
}
