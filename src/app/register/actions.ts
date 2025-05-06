/** @format */

"use server";

import { cookies } from "next/headers";

export interface RegisterFormProps {
    login: string;
    password: string;
}

export async function registerAction(data: RegisterFormProps) {
    try {
        const res = await fetch(`${process.env.SERVER_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error("Ошибка при регистрации пользователя");

        const { accessToken, user, message } = await res.json();

        const cookie = await cookies();
        cookie.set("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24,
        });
        cookie.set("userId", user.id, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 1000 * 60 * 60 * 24,
        });

        return { success: true, user, message, accessToken };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function isExistingUser(login: string) {
    try {
        const res = await fetch(
            // `${process.env.SERVER_URL}/auth/is-existing-user`,
            `https://api.itranzit.kz/auth/is-existing-user`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login }),
            }
        );

        return await res.json();
    } catch (error: any) {
        console.error(error);
        throw new Error("Ошибка при проверке существования пользователя");
    }
}

export async function isExistingUserForEmail(email: string) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/auth/is-existing-user-for-email`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            }
        );

        if (!res.ok)
            throw new Error(res.statusText || "Пользователь уже существует!!!");

        return await res.json();
    } catch (error: any) {
        console.error(error);
        throw new Error("Ошибка при проверке существования пользователя");
    }
}
