/** @format */

import { cookies } from "next/headers";

export const getToken = async (): Promise<string | null> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        return null;
    }

    return token;
};
