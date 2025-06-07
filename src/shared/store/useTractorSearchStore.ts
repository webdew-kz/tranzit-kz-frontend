/** @format */

// src/shared/store/tractorSearchStore.ts
import { create } from "zustand";
import { ITractor } from "../types/tractor.type";

// Тип состояния стора
interface TractorSearchState {
    searchTractors: ITractor[];
    setSearchTractors: (tractors: ITractor[]) => void;
    clearSearchTractors: () => void;
}

// Создание стора
export const useTractorSearchStore = create<TractorSearchState>((set) => ({
    searchTractors: [],

    setSearchTractors: (tractors) => set({ searchTractors: tractors }),

    clearSearchTractors: () => set({ searchTractors: [] }),
}));
