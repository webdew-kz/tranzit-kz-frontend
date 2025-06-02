/** @format */

// src/shared/store/truckSearchStore.ts
import { create } from "zustand";
import { ITruck } from "../types/truck.type";

// Тип состояния стора
interface TruckSearchState {
    searchTrucks: ITruck[];
    setSearchTrucks: (trucks: ITruck[]) => void;
    clearSearchTrucks: () => void;
}

// Создание стора
export const useTruckSearchStore = create<TruckSearchState>((set) => ({
    searchTrucks: [],

    setSearchTrucks: (trucks) => set({ searchTrucks: trucks }),

    clearSearchTrucks: () => set({ searchTrucks: [] }),
}));
