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
            domain: `.${process.env.DOMAIN}`,
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
        });
        cookie.set("userId", user.id, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            domain: `.${process.env.DOMAIN}`,
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
        });

        return { success: true, user, message, accessToken };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function isExistingUser(login: string) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/auth/is-existing-user`,
            // `https://api.itranzit.kz/auth/is-existing-user`,
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
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            console.error("API error:", res.status, data);
            throw new Error(data.message || "Ошибка проверки email");
        }

        return data; // { isExistingUser: boolean }
    } catch (error: any) {
        console.error("Fetch error:", error);
        throw new Error("Ошибка при проверке существования пользователя");
    }
}

// export async function register() {
//     try {
//         const res = await fetch(`${process.env.SERVER_URL}/auth/register`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             credentials: "include",
//         });

//         if (!res.ok) {
//             const errorData = await res.json();
//             return { data: null, error: errorData.message || "Ошибка запроса" };
//         }

//         return await res.json();
//     } catch (error) {
//         console.error(error);
//         return {
//             data: null,
//             error:
//                 error instanceof Error ? error.message : "Неизвестная ошибка",
//         };
//     }
// }
