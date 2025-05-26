/** @format */

"use server";

// import { cookies } from "next/headers";
import { ILoginForm } from "./types";

export async function loginAction(data: ILoginForm) {
    try {
        const res = await fetch(`${process.env.SERVER_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message);
        }

        return await res.json();
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
