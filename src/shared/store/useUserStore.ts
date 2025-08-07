/** @format */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types/user.type";

interface UserState {
    user: User | null;
    isInitialized: boolean;
    setUser: (user: User) => void;
    clearUser: () => void;
    updateBalance: (newBalance: number) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            isInitialized: false, // 👈 добавлено
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
            onRehydrateStorage: () => (state) => {
                // Когда Zustand инициализирует данные из localStorage
                state?.setUser(state.user!); // Это вызовет isInitialized: true
            },
        }
    )
);
