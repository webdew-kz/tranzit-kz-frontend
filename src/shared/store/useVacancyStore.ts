/** @format */

// src/shared/store/cargoSearchStore.ts
import { create } from "zustand";
import { ICargo } from "../types/cargo.type";

// Тип состояния стора
interface CargoState {
    cargos: ICargo[];
    setCargos: (cargos: ICargo[]) => void;
    clearCargos: () => void;
    appendCargos: (cargos: ICargo[]) => void;
}

// Создание стора
interface SetCargosAction {
    (cargos: ICargo[]): void;
}

interface ClearCargosAction {
    (): void;
}

interface AppendCargosAction {
    (cargos: ICargo[]): void;
}

export const useCargoStore = create<CargoState>((set) => ({
    cargos: [],

    setCargos: (cargos: ICargo[]) => set({ cargos: cargos }),

    clearCargos: () => set({ cargos: [] }),

    appendCargos: (cargos: ICargo[]) =>
        set((state) => ({ cargos: [...state.cargos, ...cargos] })), // Добавление новых грузов в существующий массив
}));
