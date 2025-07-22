/** @format */

// src/shared/store/reviewSearchStore.ts
import { create } from "zustand";
import { IReview } from "../types/review.type";

// Тип состояния стора
interface ReviewState {
    reviews: IReview[];
    setReviews: (reviews: IReview[]) => void;
    clearReviews: () => void;
    appendReviews: (reviews: IReview[]) => void;
}

// Создание стора
interface SetReviewsAction {
    (reviews: IReview[]): void;
}

interface ClearReviewsAction {
    (): void;
}

interface AppendReviewsAction {
    (reviews: IReview[]): void;
}

export const useReviewStore = create<ReviewState>((set) => ({
    reviews: [],

    setReviews: (reviews: IReview[]) => set({ reviews: reviews }),

    clearReviews: () => set({ reviews: [] }),

    appendReviews: (reviews: IReview[]) =>
        set((state) => ({ reviews: [...state.reviews, ...reviews] })), // Добавление новых грузов в существующий массив
}));
