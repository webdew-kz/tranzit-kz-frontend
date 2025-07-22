/** @format */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types/user.type";

interface UserState {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
    updateBalance: (newBalance: number) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),
            updateBalance: (newBalance: number) => {
                const { user } = get();
                if (user) {
                    set({ user: { ...user, balance: newBalance } });
                }
            },
        }),
        {
            name: "user-storage",
        }
    )
);
