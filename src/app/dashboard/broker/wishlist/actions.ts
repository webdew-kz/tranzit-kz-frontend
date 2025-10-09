/** @format */

export async function getWishlist() {
    try {
        const res = await fetch(`${process.env.SERVER_URL}/broker/wishlist`, {
            method: "POST",
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
            `${process.env.SERVER_URL}/broker/remove-all-from-wishlist`,
            {
                method: "POST",
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
