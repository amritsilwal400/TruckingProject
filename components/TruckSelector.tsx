
import React from 'react';
import { Truck } from '../types';

interface TruckSelectorProps {
  trucks: Truck[];
  selectedTruck: Truck;
  onSelectTruck: (truck: Truck) => void;
}

const TruckSelector: React.FC<TruckSelectorProps> = ({ trucks, selectedTruck, onSelectTruck }) => {
  return (
    <div className="space-y-4">
      {trucks.map(truck => (
        <div
          key={truck.id}
          onClick={() => onSelectTruck(truck)}
          className={`p-4 rounded-lg cursor-pointer border-2 transition-all duration-200 flex items-center space-x-4
            ${selectedTruck.id === truck.id 
              ? 'bg-cyan-900/50 border-cyan-500 shadow-lg' 
              : 'bg-gray-700 border-gray-600 hover:border-cyan-600'
            }`}
        >
          <div className="flex-shrink-0">
            {truck.icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white">{truck.name}</h3>
            <p className="text-sm text-gray-400">
              Max Weight: {truck.maxWeight.toLocaleString()} kg
            </p>
            <p className="text-sm text-gray-400">
              Max Volume: {truck.maxVolume} m³
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TruckSelector;
