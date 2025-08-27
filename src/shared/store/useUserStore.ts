/** @format */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types/user.type";

interface UserState {
    user: User | null;
    isInitialized: boolean;
    setUser: (user: User | null) => void;
    clearUser: () => void;
    updateBalance: (newBalance: number) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            isInitialized: false,

            setUser: (user) => set({ user, isInitialized: true }),

            clearUser: () => set({ user: null, isInitialized: true }),

            updateBalance: (newBalance: number) => {
                const { user } = get();
                if (user) {
                    set({ user: { ...user, balance: newBalance } });
                }
            },
        }),
        {
            name: "user-storage",
            onRehydrateStorage: () => (state, error) => {
                // доступ к set можно сделать через state?setUser
                // или аккуратнее:
                if (!error) {
                    state?.setUser(state?.user ?? null);
                }
            },
        }
    )
);
