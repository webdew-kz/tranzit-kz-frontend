/** @format */

// src/shared/store/brokerSearchStore.ts
import { create } from "zustand";
import { IBroker } from "../types/broker.type";

// Тип состояния стора
interface BrokerState {
    brokers: IBroker[];
    setBrokers: (brokers: IBroker[]) => void;
    clearBrokers: () => void;
    appendBrokers: (brokers: IBroker[]) => void;
}

// Создание стора
interface SetBrokersAction {
    (brokers: IBroker[]): void;
}

interface ClearBrokersAction {
    (): void;
}

interface AppendBrokersAction {
    (brokers: IBroker[]): void;
}

export const useBrokerStore = create<BrokerState>((set) => ({
    brokers: [],

    setBrokers: (brokers: IBroker[]) => set({ brokers: brokers }),

    clearBrokers: () => set({ brokers: [] }),

    appendBrokers: (brokers: IBroker[]) =>
        set((state) => ({ brokers: [...state.brokers, ...brokers] })), // Добавление новых грузов в существующий массив
}));
