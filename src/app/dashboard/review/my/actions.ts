/** @format */

// export async function activateReview({ id }: { id: string }) {
//     try {
//         const res = await fetch(`${process.env.SERVER_URL}/review/activate`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ id }),
//             credentials: "include",
//         });

//         if (!res.ok) {
//             console.error(res.statusText);
//         }

//         return await res.json();
//     } catch (error) {
//         console.error(error);
//         throw new Error(error instanceof Error ? error.message : String(error));
//     }
// }

// export async function archivateReview({ id }: { id: string }) {
//     try {
//         const res = await fetch(`${process.env.SERVER_URL}/review/archivate`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ id }),
//             credentials: "include",
//         });

//         if (!res.ok) {
//             console.error(res.statusText);
//         }

//         return await res.json();
//     } catch (error) {
//         console.error(error);
//         throw new Error(error instanceof Error ? error.message : String(error));
//     }
// }

// export async function activateMany({ ids }: { ids: string[] }) {
//     try {
//         const res = await fetch(
//             `${process.env.SERVER_URL}/review/activate-many`,
//             {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ ids }),
//                 credentials: "include",
//             }
//         );

//         if (!res.ok) {
//             console.error(res.statusText);
//         }

//         return await res.json();
//     } catch (error) {
//         console.error(error);
//         throw new Error(error instanceof Error ? error.message : String(error));
//     }
// }

// export async function archivateMany({ ids }: { ids: string[] }) {
//     try {
//         const res = await fetch(
//             `${process.env.SERVER_URL}/review/archivate-many`,
//             {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ ids }),
//                 credentials: "include",
//             }
//         );

//         if (!res.ok) {
//             console.error(res.statusText);
//         }

//         return await res.json();
//     } catch (error) {
//         console.error(error);
//         throw new Error(error instanceof Error ? error.message : String(error));
//     }
// }

export async function findByUserId(page: number) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/review/find-by-user-id`,
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

/** @format */

export async function remove(id: string) {
    try {
        const res = await fetch(`${process.env.SERVER_URL}/vacancy/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
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

export async function removeMany({ ids }: { ids: string[] }) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/vacancy/remove-many`,
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
