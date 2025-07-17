/** @format */

// src/shared/store/vacancySearchStore.ts
import { create } from "zustand";
import { IVacancy } from "../types/vacancy.type";

// Тип состояния стора
interface VacancyState {
    vacancys: IVacancy[];
    setVacancys: (vacancys: IVacancy[]) => void;
    clearVacancys: () => void;
    appendVacancys: (vacancys: IVacancy[]) => void;
}

// Создание стора
interface SetVacancysAction {
    (vacancys: IVacancy[]): void;
}

interface ClearVacancysAction {
    (): void;
}

interface AppendVacancysAction {
    (vacancys: IVacancy[]): void;
}

export const useVacancyStore = create<VacancyState>((set) => ({
    vacancys: [],

    setVacancys: (vacancys: IVacancy[]) => set({ vacancys: vacancys }),

    clearVacancys: () => set({ vacancys: [] }),

    appendVacancys: (vacancys: IVacancy[]) =>
        set((state) => ({ vacancys: [...state.vacancys, ...vacancys] })), // Добавление новых грузов в существующий массив
}));
