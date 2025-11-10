import React, { useState } from 'react';
import { Load } from '../types';
import { PlusIcon } from './icons/PlusIcon';

interface LoadInputFormProps {
  onAddLoad: (load: Omit<Load, 'id'>) => void;
}

const LoadInputForm: React.FC<LoadInputFormProps> = ({ onAddLoad }) => {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [volume, setVolume] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightNum = parseFloat(weight);
    const volumeNum = parseFloat(volume);
    const quantityNum = parseInt(quantity, 10);

    if (!name.trim() || isNaN(weightNum) || isNaN(volumeNum) || isNaN(quantityNum) || weightNum <= 0 || volumeNum <= 0 || quantityNum <= 0) {
      setError('Please fill in all fields with valid, positive numbers.');
      return;
    }
    
    setError('');
    onAddLoad({ name, weight: weightNum, volume: volumeNum, quantity: quantityNum });
    setName('');
    setWeight('');
    setVolume('');
    setQuantity('1');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-400 text-sm">{error}</p>}
      <div>
        <label htmlFor="loadName" className="block text-sm font-medium text-gray-400">Package Name</label>
        <input
          id="loadName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Box of Widgets"
          className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm p-2"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-400">Weight (kg)</label>
          <input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g., 50"
            min="0.1"
            step="0.1"
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="volume" className="block text-sm font-medium text-gray-400">Volume (m³)</label>
          <input
            id="volume"
            type="number"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            placeholder="e.g., 0.5"
            min="0.01"
            step="0.01"
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-400">Quantity</label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g., 5"
            min="1"
            step="1"
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm p-2"
          />
        </div>
      </div>
      <button type="submit" className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors">
        <PlusIcon className="w-5 h-5 mr-2" />
        Add Package
      </button>
    </form>
  );
};

export default LoadInputForm;
