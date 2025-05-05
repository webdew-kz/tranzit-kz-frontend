/** @format */

export async function logoutAction() {
    try {
        const res = await fetch(`http://localhost:5000/auth/logout`, {
            method: "POST",
            credentials: "include",
        });

        const contentType = res.headers.get("content-type");

        if (!res.ok) {
            const errorText = contentType?.includes("application/json")
                ? JSON.stringify(await res.json())
                : await res.text();
            console.error("Logout failed:", res.status, errorText);
            throw new Error(`Logout failed: ${res.status}`);
        }

        // Всё хорошо — возвращаем JSON или ничего
        if (contentType?.includes("application/json")) {
            return await res.json(); // ← в твоём случае это { message: "Вы вышли из системы" }
        }

        return;
    } catch (error) {
        console.error("Logout error:", error);
        throw new Error("Ошибка при выходе из системы");
    }
}
