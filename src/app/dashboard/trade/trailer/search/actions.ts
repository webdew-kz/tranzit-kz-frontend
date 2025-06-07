/** @format */

export async function findAll(page: number) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/trailer/find-all?page=${page}`,
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

export async function findByFilter(data: any) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/trailer/find-by-filter`,
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
        const res = await fetch(
            `${process.env.SERVER_URL}/trailer/add-view/${id}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // body: JSON.stringify({ id }),
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

export async function addToWishlist(id: string) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/trailer/add-to-wishlist/${id}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // body: JSON.stringify({ trailerId }),
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

export async function removeFromWishlist(id: string) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/trailer/remove-from-wishlist/${id}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // body: JSON.stringify({ trailerId }),
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

export async function getWishlistByUserId() {
    try {
        const res = await fetch(`${process.env.SERVER_URL}/trailer/wishlist`, {
            method: "GET",
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

export async function getIsInWishlist(trailerId: string) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/trailer/is-in-wishlist`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ trailerId }),
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
