/** @format */

// src/shared/store/partsSearchStore.ts
import { create } from "zustand";
import { IParts } from "../types/parts.type";

// Тип состояния стора
interface PartsState {
    partss: IParts[];
    setPartss: (partss: IParts[]) => void;
    clearPartss: () => void;
    appendPartss: (partss: IParts[]) => void;
}

// Создание стора
interface SetPartssAction {
    (partss: IParts[]): void;
}

interface ClearPartssAction {
    (): void;
}

interface AppendPartssAction {
    (partss: IParts[]): void;
}

export const usePartsStore = create<PartsState>((set) => ({
    partss: [],

    setPartss: (partss: IParts[]) => set({ partss: partss }),

    clearPartss: () => set({ partss: [] }),

    appendPartss: (partss: IParts[]) =>
        set((state) => ({ partss: [...state.partss, ...partss] })),
}));
