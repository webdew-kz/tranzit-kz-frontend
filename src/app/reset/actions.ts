/** @format */

"use server";
import { ILoginForm } from "./types";

export const resetAction = async (data: ILoginForm) => {
    try {
        const res = await fetch(`${process.env.SERVER_URL}/auth/reset`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const { message } = await res.json();

        return { success: true, message };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Ошибка при сбросе пароля",
        };
    }
};

export async function isExistingUserForEmailReset(email: string) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/auth/is-existing-user-for-email-reset`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            }
        );

        if (!res.ok)
            throw new Error(res.statusText || "Пользователь уже существует");

        return await res.json();
    } catch (error: any) {
        console.error(error);
        throw new Error("Ошибка при проверке существования пользователя");
    }
}
