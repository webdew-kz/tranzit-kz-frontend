/** @format */

// src/shared/store/transportSearchStore.ts
import { create } from "zustand";
import { ITransport } from "../types/transport.type";

// Тип состояния стора
interface TransportSearchState {
    searchTransports: ITransport[];
    setSearchTransports: (transports: ITransport[]) => void;
    clearSearchTransports: () => void;
}

// Создание стора
export const useTransportSearchStore = create<TransportSearchState>((set) => ({
    searchTransports: [],

    setSearchTransports: (transports) => set({ searchTransports: transports }),

    clearSearchTransports: () => set({ searchTransports: [] }),
}));
