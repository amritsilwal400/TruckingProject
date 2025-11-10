import React from 'react';
import { Load } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface LoadListProps {
  loads: Load[];
  onRemoveLoad: (id: string) => void;
}

const LoadList: React.FC<LoadListProps> = ({ loads, onRemoveLoad }) => {
  if (loads.length === 0) {
    return (
      <div className="mt-6 text-center text-gray-500">
        <p>No packages added yet.</p>
        <p className="text-sm">Use the form above to add items to the shipment.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-3 max-h-60 overflow-y-auto pr-2">
      {loads.map(load => (
        <div key={load.id} className="bg-gray-700 rounded-lg p-3 flex items-center justify-between shadow-sm transition-transform hover:scale-[1.02]">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate">
              {load.name} <span className="text-gray-400 font-normal">x{load.quantity}</span>
            </p>
            <p className="text-sm text-gray-400">
              {load.weight} kg / {load.volume} m³ (each)
            </p>
          </div>
          <button
            onClick={() => onRemoveLoad(load.id)}
            className="ml-4 p-2 rounded-full text-gray-400 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            aria-label={`Remove ${load.name}`}
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default LoadList;
