/** @format */

// src/shared/store/tractorSearchStore.ts
import { create } from "zustand";
import { ITractor } from "../types/tractor.type";

// Тип состояния стора
interface TractorState {
    tractors: ITractor[];
    setTractors: (tractors: ITractor[]) => void;
    clearTractors: () => void;
    appendTractors: (tractors: ITractor[]) => void;
}

// Создание стора
interface SetTractorsAction {
    (tractors: ITractor[]): void;
}

interface ClearTractorsAction {
    (): void;
}

interface AppendTractorsAction {
    (tractors: ITractor[]): void;
}

export const useTractorStore = create<TractorState>((set) => ({
    tractors: [],

    setTractors: (tractors: ITractor[]) => set({ tractors: tractors }),

    clearTractors: () => set({ tractors: [] }),

    appendTractors: (tractors: ITractor[]) =>
        set((state) => ({ tractors: [...state.tractors, ...tractors] })),
}));
