/** @format */

// src/shared/store/cargoSearchStore.ts
import { create } from "zustand";
import { ICargo } from "../types/cargo.type";

// Тип состояния стора
interface CargoSearchState {
    searchCargos: ICargo[];
    setSearchCargos: (cargos: ICargo[]) => void;
    clearSearchCargos: () => void;
}

// Создание стора
export const useCargoSearchStore = create<CargoSearchState>((set) => ({
    searchCargos: [],

    setSearchCargos: (cargos) => set({ searchCargos: cargos }),

    clearSearchCargos: () => set({ searchCargos: [] }),
}));
