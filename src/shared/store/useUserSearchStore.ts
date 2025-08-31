/** @format */

// src/shared/store/userSearchStore.ts
import { create } from "zustand";
import { User } from "../types/user.type";

// Тип состояния стора
interface UserSearchState {
    searchUsers: User[];
    setSearchUsers: (users: User[] | ((prev: User[]) => User[])) => void;
    clearSearchUsers: () => void;

    averageRating: string;
    setAverageRating: (value: string) => void;
}

// Создание стора
export const useUserSearchStore = create<UserSearchState>((set) => ({
    searchUsers: [],

    setSearchUsers: (usersOrUpdater) =>
        set((state) => ({
            searchUsers:
                typeof usersOrUpdater === "function"
                    ? (usersOrUpdater as (prev: User[]) => User[])(
                          state.searchUsers
                      )
                    : usersOrUpdater,
        })),

    clearSearchUsers: () => set({ searchUsers: [] }),

    averageRating: "",

    setAverageRating: (value: string) => set({ averageRating: value }),
}));
