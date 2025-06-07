/** @format */

// src/shared/store/trailerSearchStore.ts
import { create } from "zustand";
import { ITrailer } from "../types/trailer.type";

// Тип состояния стора
interface TrailerState {
    trailers: ITrailer[];
    setTrailers: (trailers: ITrailer[]) => void;
    clearTrailers: () => void;
    appendTrailers: (trailers: ITrailer[]) => void;
}

// Создание стора
interface SetTrailersAction {
    (trailers: ITrailer[]): void;
}

interface ClearTrailersAction {
    (): void;
}

interface AppendTrailersAction {
    (trailers: ITrailer[]): void;
}

export const useTrailerStore = create<TrailerState>((set) => ({
    trailers: [],

    setTrailers: (trailers: ITrailer[]) => set({ trailers: trailers }),

    clearTrailers: () => set({ trailers: [] }),

    appendTrailers: (trailers: ITrailer[]) =>
        set((state) => ({ trailers: [...state.trailers, ...trailers] })),
}));
