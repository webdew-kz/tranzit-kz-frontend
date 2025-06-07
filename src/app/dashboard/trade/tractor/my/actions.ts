/** @format */

export async function activate({ id }: { id: string }) {
    try {
        console.log(`Activating tractor with ID: ${id}`); // Debugging log

        const res = await fetch(
            `${process.env.SERVER_URL}/tractor/activate/${id}`,
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

export async function archivate({ id }: { id: string }) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/tractor/archivate/${id}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // body: JSON.stringify({ id }),
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

export async function activateMany({ ids }: { ids: string[] }) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/tractor/activate-many`,
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
            `${process.env.SERVER_URL}/tractor/archivate-many`,
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

export async function findAllActiveByUserId() {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/tractor/find-all-active-by-user-id`,
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
