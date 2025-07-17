/** @format */

// src/shared/store/vacancySearchStore.ts
import { create } from "zustand";
import { IVacancy } from "../types/vacancy.type";

// Тип состояния стора
interface VacancySearchState {
    searchVacancys: IVacancy[];
    setSearchVacancys: (vacancys: IVacancy[]) => void;
    clearSearchVacancys: () => void;
}

// Создание стора
export const useVacancySearchStore = create<VacancySearchState>((set) => ({
    searchVacancys: [],

    setSearchVacancys: (vacancys) => set({ searchVacancys: vacancys }),

    clearSearchVacancys: () => set({ searchVacancys: [] }),
}));
