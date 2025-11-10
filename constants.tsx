
import React from 'react';
import { Truck } from './types';
import { TruckIcon } from './components/icons/TruckIcon';

export const AVAILABLE_TRUCKS: Truck[] = [
  {
    id: 'van',
    name: 'Small Van',
    maxWeight: 1500, // in kg
    maxVolume: 4, // in cubic meters
    icon: <TruckIcon className="w-8 h-8 text-cyan-400" />
  },
  {
    id: 'boxtruck',
    name: 'Box Truck',
    maxWeight: 7000,
    maxVolume: 40,
    icon: <TruckIcon className="w-10 h-10 text-cyan-400" />
  },
  {
    id: 'semitrailer',
    name: 'Semi-Trailer',
    maxWeight: 20000,
    maxVolume: 90,
    icon: <TruckIcon className="w-12 h-12 text-cyan-400" />
  },
];
