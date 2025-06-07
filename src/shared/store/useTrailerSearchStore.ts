/** @format */

// src/shared/store/trailerSearchStore.ts
import { create } from "zustand";
import { ITrailer } from "../types/trailer.type";

// Тип состояния стора
interface TrailerSearchState {
    searchTrailers: ITrailer[];
    setSearchTrailers: (trailers: ITrailer[]) => void;
    clearSearchTrailers: () => void;
}

// Создание стора
export const useTrailerSearchStore = create<TrailerSearchState>((set) => ({
    searchTrailers: [],

    setSearchTrailers: (trailers) => set({ searchTrailers: trailers }),

    clearSearchTrailers: () => set({ searchTrailers: [] }),
}));
