/** @format */

export async function findAll(page: number) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/vacancy?page=${page}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                // body: JSON.stringify(data),
                credentials: "include",
            }
        );

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message);
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}

export async function findManyByFilter(data: any) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/vacancy/find-many-by-filter`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include",
            }
        );

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message);
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}

export async function addView(id: string) {
    try {
        const res = await fetch(`${process.env.SERVER_URL}/vacancy/add-view`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
            credentials: "include",
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message);
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}

export async function addToWishlist(vacancyId: string) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/vacancy/add-to-wishlist`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ vacancyId }),
                credentials: "include",
            }
        );

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message);
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}

export async function removeFromWishlist(vacancyId: string) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/vacancy/remove-from-wishlist`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ vacancyId }),
                credentials: "include",
            }
        );

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message);
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}

export async function getWishlist() {
    try {
        const res = await fetch(`${process.env.SERVER_URL}/vacancy/wishlist`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message);
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}
