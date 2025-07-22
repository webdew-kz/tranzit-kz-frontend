/** @format */

// src/shared/store/reviewSearchStore.ts
import { create } from "zustand";
import { IReview } from "../types/review.type";

// Тип состояния стора
interface ReviewSearchState {
    searchReviews: IReview[];
    setSearchReviews: (reviews: IReview[]) => void;
    clearSearchReviews: () => void;
}

// Создание стора
export const useReviewSearchStore = create<ReviewSearchState>((set) => ({
    searchReviews: [],

    setSearchReviews: (reviews) => set({ searchReviews: reviews }),

    clearSearchReviews: () => set({ searchReviews: [] }),
}));
