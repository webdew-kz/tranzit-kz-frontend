/** @format */

export async function activateVacancy({ id }: { id: string }) {
    try {
        const res = await fetch(`${process.env.SERVER_URL}/vacancy/activate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
            credentials: "include",
        });

        if (!res.ok) {
            console.error(res.statusText);
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}

export async function archivateVacancy({ id }: { id: string }) {
    try {
        const res = await fetch(`${process.env.SERVER_URL}/vacancy/archivate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
            credentials: "include",
        });

        if (!res.ok) {
            console.error(res.statusText);
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}

export async function activateMany({ ids }: { ids: string[] }) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/vacancy/activate-many`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids }),
                credentials: "include",
            }
        );

        if (!res.ok) {
            console.error(res.statusText);
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}

export async function archivateMany({ ids }: { ids: string[] }) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/vacancy/archivate-many`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids }),
                credentials: "include",
            }
        );

        if (!res.ok) {
            console.error(res.statusText);
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}

export async function findByUserId(page: number) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/vacancy/find-by-user-id`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ page }),
                credentials: "include",
            }
        );

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
