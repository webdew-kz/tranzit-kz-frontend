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
            path: "/",
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
            secure: false, //process.env.NODE_ENV === "production",
        });
        cookie.set("userId", user.id, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24,
            secure: process.env.NODE_ENV === "production",
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
