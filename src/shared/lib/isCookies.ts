/** @format */
import { cookies } from "next/headers";

export const isAuth = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (token) {
        try {
            return true;
        } catch {
            return false;
        }
    }
};
