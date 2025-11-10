
import React, { useState } from 'react';
import { PackingSolution, Truck as TruckType, Load } from '../types';

interface ResultsDisplayProps {
  solution: PackingSolution | null;
  isLoading: boolean;
  error: string | null;
  hasLoads: boolean;
  selectedTruck: TruckType;
}

const ProgressBar: React.FC<{ value: number }> = ({ value }) => {
  const percentage = Math.min(Math.max(value, 0), 100);
  let colorClass = 'bg-green-500';
  if (percentage > 75) colorClass = 'bg-yellow-500';
  if (percentage > 90) colorClass = 'bg-red-500';

  return (
    <div className="w-full bg-gray-600 rounded-full h-2.5">
      <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

const CollapsibleTruck: React.FC<{ truckData: PackingSolution['trucks'][0], truckType: TruckType }> = ({ truckData, truckType }) => {
  const [isOpen, setIsOpen] = useState(truckData.truckNumber === 1);

  return (
    <div className="bg-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center text-left bg-gray-700 hover:bg-gray-600 transition-colors"
      >
        <div className="flex items-center">
            <span className="font-bold text-lg text-cyan-400 mr-4">Truck #{truckData.truckNumber}</span>
             <div className="hidden sm:flex items-center space-x-4">
                <div className="text-sm text-gray-300">
                    Weight: {truckData.totalWeight.toFixed(2)} / {truckType.maxWeight} kg
                </div>
                <div className="text-sm text-gray-300">
                    Volume: {truckData.totalVolume.toFixed(2)} / {truckType.maxVolume} m³
                </div>
            </div>
        </div>
        <svg
          className={`w-6 h-6 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-medium text-gray-300">Weight Utilization</span>
                <span className="text-sm font-bold">{truckData.weightUtilization.toFixed(1)}%</span>
              </div>
              <ProgressBar value={truckData.weightUtilization} />
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-medium text-gray-300">Volume Utilization</span>
                <span className="text-sm font-bold">{truckData.volumeUtilization.toFixed(1)}%</span>
              </div>
              <ProgressBar value={truckData.volumeUtilization} />
            </div>
          </div>
          <h4 className="font-semibold mt-4 mb-2 text-gray-300">Packages ({truckData.loads.length}):</h4>
          <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {truckData.loads.map((load: Load) => (
              <li key={load.id} className="text-sm bg-gray-800 p-2 rounded flex justify-between">
                <span>{load.name}</span>
                <span className="text-gray-400">{load.weight}kg, {load.volume}m³</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ solution, isLoading, error, hasLoads, selectedTruck }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <svg className="animate-spin h-10 w-10 text-cyan-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg font-semibold">Generating optimal plan...</p>
        <p className="text-gray-400">The AI is crunching the numbers to pack your trucks efficiently.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-red-900/20 rounded-lg">
        <p className="text-xl font-bold text-red-400">Oops! Something went wrong.</p>
        <p className="text-gray-300 mt-2">{error}</p>
      </div>
    );
  }

  if (solution) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-900 p-4 rounded-lg text-center">
            <p className="text-gray-400 text-lg">Total Trucks Required</p>
            <p className="text-5xl font-bold text-cyan-400 my-2">{solution.totalTrucks}</p>
            <p className="text-gray-400">using {selectedTruck.name}s</p>
        </div>
        <div className="space-y-4">
          {solution.trucks.map(truck => (
            <CollapsibleTruck key={truck.truckNumber} truckData={truck} truckType={selectedTruck} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <h3 className="text-2xl font-semibold text-gray-300">Ready to Optimize?</h3>
      <p className="mt-2 text-gray-400 max-w-md">
        {hasLoads 
         ? "You've added packages and selected a truck. Click the 'Generate Plan' button to let our AI find the most efficient way to ship your items."
         : "Add some packages and select a truck type to get started. The AI will calculate the best way to load your shipment."
        }
      </p>
    </div>
  );
};

export default ResultsDisplay;
