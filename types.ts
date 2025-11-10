import { ReactNode } from 'react';

export interface Load {
  id: string;
  name: string;
  weight: number;
  volume: number;
  quantity: number;
}

export interface Truck {
  id: string;
  name: string;
  maxWeight: number;
  maxVolume: number;
  icon: ReactNode;
}

export interface PackedTruck {
  truckNumber: number;
  loads: Load[];
  totalWeight: number;
  totalVolume: number;
  weightUtilization: number;
  volumeUtilization: number;
}

export interface PackingSolution {
  totalTrucks: number;
  trucks: PackedTruck[];
}
