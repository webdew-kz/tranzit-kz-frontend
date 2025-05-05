/** @format */

import { cookies } from "next/headers";

export const getUserId = async (): Promise<string | null> => {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
        return null;
    }

    return userId;
};
