/** @format */

export async function getWishlist() {
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

export async function removeAllFromWishlist() {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/trailer/remove-all-from-wish-list`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
