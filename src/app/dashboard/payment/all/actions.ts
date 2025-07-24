/** @format */

export async function getAll(page: number) {
    try {
        const res = await fetch(`${process.env.SERVER_URL}/payment/all`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ page }),
            credentials: "include",
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { data: null, error: errorData.message || "Ошибка запроса" };
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        return {
            data: null,
            error:
                error instanceof Error ? error.message : "Неизвестная ошибка",
        };
    }
}
