/** @format */

// src/shared/store/brokerSearchStore.ts
import { create } from "zustand";
import { IBroker } from "../types/broker.type";

// Тип состояния стора
interface BrokerSearchState {
    searchBrokers: IBroker[];
    setSearchBrokers: (brokers: IBroker[]) => void;
    clearSearchBrokers: () => void;
}

// Создание стора
export const useBrokerSearchStore = create<BrokerSearchState>((set) => ({
    searchBrokers: [],

    setSearchBrokers: (brokers) => set({ searchBrokers: brokers }),

    clearSearchBrokers: () => set({ searchBrokers: [] }),
}));
