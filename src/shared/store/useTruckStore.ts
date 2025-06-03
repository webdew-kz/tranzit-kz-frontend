/** @format */

// src/shared/store/truckSearchStore.ts
import { create } from "zustand";
import { ITruck } from "../types/truck.type";

// Тип состояния стора
interface TruckState {
    trucks: ITruck[];
    setTrucks: (trucks: ITruck[]) => void;
    clearTrucks: () => void;
    appendTrucks: (trucks: ITruck[]) => void;
}

// Создание стора
interface SetTrucksAction {
    (trucks: ITruck[]): void;
}

interface ClearTrucksAction {
    (): void;
}

interface AppendTrucksAction {
    (trucks: ITruck[]): void;
}

export const useTruckStore = create<TruckState>((set) => ({
    trucks: [],

    setTrucks: (trucks: ITruck[]) => set({ trucks: trucks }),

    clearTrucks: () => set({ trucks: [] }),

    appendTrucks: (trucks: ITruck[]) =>
        set((state) => ({ trucks: [...state.trucks, ...trucks] })),
}));
