/** @format */

// src/shared/store/transportSearchStore.ts
import { create } from "zustand";
import { ITransport } from "../types/transport.type";

// Тип состояния стора
interface TransportState {
    transports: ITransport[];
    setTransports: (transports: ITransport[]) => void;
    clearTransports: () => void;
    appendTransports: (transports: ITransport[]) => void;
}

// Создание стора
interface SetTransportsAction {
    (transports: ITransport[]): void;
}

interface ClearTransportsAction {
    (): void;
}

interface AppendTransportsAction {
    (transports: ITransport[]): void;
}

export const useTransportStore = create<TransportState>((set) => ({
    transports: [],

    setTransports: (transports: ITransport[]) =>
        set({ transports: transports }),

    clearTransports: () => set({ transports: [] }),

    appendTransports: (transports: ITransport[]) =>
        set((state) => ({ transports: [...state.transports, ...transports] })), // Добавление новых грузов в существующий массив
}));
