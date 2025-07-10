/** @format */

// src/shared/store/partsSearchStore.ts
import { create } from "zustand";
import { IParts } from "../types/parts.type";

// Тип состояния стора
interface PartsSearchState {
    searchPartss: IParts[];
    setSearchPartss: (partss: IParts[]) => void;
    clearSearchPartss: () => void;
}

// Создание стора
export const usePartsSearchStore = create<PartsSearchState>((set) => ({
    searchPartss: [],

    setSearchPartss: (partss) => set({ searchPartss: partss }),

    clearSearchPartss: () => set({ searchPartss: [] }),
}));
