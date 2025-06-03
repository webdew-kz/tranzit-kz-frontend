/** @format */

export async function findAll(page: number) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/truck/find-all?page=${page}`,
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
            `${process.env.SERVER_URL}/truck/find-by-filter`,
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
            `${process.env.SERVER_URL}/truck/add-view/${id}`,
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
            `${process.env.SERVER_URL}/truck/add-to-wishlist/${id}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // body: JSON.stringify({ truckId }),
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
            `${process.env.SERVER_URL}/truck/remove-from-wishlist/${id}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // body: JSON.stringify({ truckId }),
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
        const res = await fetch(`${process.env.SERVER_URL}/truck/wishlist`, {
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

export async function getIsInWishlist(truckId: string) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/truck/is-in-wishlist`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ truckId }),
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
