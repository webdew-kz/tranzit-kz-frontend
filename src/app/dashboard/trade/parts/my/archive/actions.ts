/** @format */

export async function remove(id: string) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/parts/delete/${id}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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

export async function removeMany({ ids }: { ids: string[] }) {
    try {
        const res = await fetch(`${process.env.SERVER_URL}/parts/remove-many`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids }),
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
            `${process.env.SERVER_URL}/parts/activate-many`,
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

export async function findAllArchivedByUserId() {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/parts/find-all-archived-by-user-id`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                // body: JSON.stringify({ page }),
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

export async function activate({ id }: { id: string }) {
    try {
        console.log(`Activating parts with ID: ${id}`); // Debugging log

        const res = await fetch(
            `${process.env.SERVER_URL}/parts/activate/${id}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
