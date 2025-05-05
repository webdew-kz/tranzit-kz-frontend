/** @format */

import { cookies } from "next/headers";

export const getPrefLangCookie = async () => {
    return (await cookies()).get("googtrans")?.value ?? "ru";
};
