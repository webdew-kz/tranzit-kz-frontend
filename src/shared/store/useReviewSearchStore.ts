/** @format */

// src/shared/store/reviewSearchStore.ts
import { create } from "zustand";
import { IReview } from "../types/review.type";

// Тип состояния стора
interface ReviewSearchState {
    searchReviews: IReview[];
    setSearchReviews: (
        reviews: IReview[] | ((prev: IReview[]) => IReview[])
    ) => void;
    clearSearchReviews: () => void;
}

// Создание стора
export const useReviewSearchStore = create<ReviewSearchState>((set) => ({
    searchReviews: [],

    setSearchReviews: (reviewsOrUpdater) =>
        set((state) => ({
            searchReviews:
                typeof reviewsOrUpdater === "function"
                    ? (reviewsOrUpdater as (prev: IReview[]) => IReview[])(
                          state.searchReviews
                      )
                    : reviewsOrUpdater,
        })),

    clearSearchReviews: () => set({ searchReviews: [] }),
}));
