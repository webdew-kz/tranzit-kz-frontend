/** @format */

"use server";

import { cookies } from "next/headers";
import { ILoginForm } from "./types";

export async function loginAction(data: ILoginForm) {
    try {
        const res = await fetch(`${process.env.SERVER_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
        });

        // if (!res.ok) throw new Error(res.statusText);

        const { accessToken, user, message } = await res.json();

        if (!accessToken) {
            return {
                success: false,
                message,
            };
        }

        const cookie = await cookies();
        cookie.set("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            domain: `.${process.env.DOMAIN}`,
            path: "/",
            maxAge: 1000 * 60 * 60 * 24,
        });
        cookie.set("userId", user.id, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            domain: `.${process.env.DOMAIN}`,
            path: "/",
            maxAge: 1000 * 60 * 60 * 24,
        });

        return { success: true, user, message, accessToken };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Ошибка при авторизации пользователя",
        };
    }
}

// export async function loginAction(data: ILoginForm) {
//     const res = await fetch(`${process.env.SERVER_URL}/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//         credentials: "include", // 👈 важно, чтобы куки с бэка сохранились
//     });

//     if (!res.ok) {
//         const message = await res.text();
//         throw new Error(message || "Login failed");
//     }

//     const { accessToken, user, message } = await res.json();
//     return { success: true, user, message, accessToken };
// }
