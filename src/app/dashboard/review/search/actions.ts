/** @format */

// export async function findAll(page: number) {
//     try {
//         const res = await fetch(
//             `${process.env.SERVER_URL}/review?page=${page}`,
//             {
//                 method: "GET",
//                 headers: { "Content-Type": "application/json" },
//                 // body: JSON.stringify(data),
//                 credentials: "include",
//             }
//         );

//         if (!res.ok) {
//             const errorData = await res.json();
//             throw new Error(errorData.message);
//         }

//         return await res.json();
//     } catch (error) {
//         console.error(error);
//         throw new Error(error instanceof Error ? error.message : String(error));
//     }
// }

export async function findByIin(data: any) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/review/find-by-iin`,
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

export async function removeReview(id: string) {
    try {
        const res = await fetch(`${process.env.SERVER_URL}/review/${id}`, {
            method: "DELETE",
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

// export async function addView(id: string) {
//     try {
//         const res = await fetch(`${process.env.SERVER_URL}/review/add-view`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ id }),
//             credentials: "include",
//         });

//         if (!res.ok) {
//             const errorData = await res.json();
//             throw new Error(errorData.message);
//         }

//         return await res.json();
//     } catch (error) {
//         console.error(error);
//         throw new Error(error instanceof Error ? error.message : String(error));
//     }
// }

// export async function addToWishlist(reviewId: string) {
//     try {
//         const res = await fetch(
//             `${process.env.SERVER_URL}/review/add-to-wishlist`,
//             {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ reviewId }),
//                 credentials: "include",
//             }
//         );

//         if (!res.ok) {
//             const errorData = await res.json();
//             throw new Error(errorData.message);
//         }

//         return await res.json();
//     } catch (error) {
//         console.error(error);
//         throw new Error(error instanceof Error ? error.message : String(error));
//     }
// }

// export async function removeFromWishlist(reviewId: string) {
//     try {
//         const res = await fetch(
//             `${process.env.SERVER_URL}/review/remove-from-wishlist`,
//             {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ reviewId }),
//                 credentials: "include",
//             }
//         );

//         if (!res.ok) {
//             const errorData = await res.json();
//             throw new Error(errorData.message);
//         }

//         return await res.json();
//     } catch (error) {
//         console.error(error);
//         throw new Error(error instanceof Error ? error.message : String(error));
//     }
// }

// export async function getWishlist() {
//     try {
//         const res = await fetch(`${process.env.SERVER_URL}/review/wishlist`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             credentials: "include",
//         });

//         if (!res.ok) {
//             const errorData = await res.json();
//             throw new Error(errorData.message);
//         }

//         return await res.json();
//     } catch (error) {
//         console.error(error);
//         throw new Error(error instanceof Error ? error.message : String(error));
//     }
// }

export async function lock(reviewId: string, adminComment: string) {
    try {
        const res = await fetch(`${process.env.SERVER_URL}/review/lock`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reviewId, adminComment }),
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

export async function unlock(reviewId: string) {
    try {
        const res = await fetch(`${process.env.SERVER_URL}/review/unlock`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reviewId }),
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
