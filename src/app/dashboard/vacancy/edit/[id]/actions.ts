/** @format */

export async function editVacancy(data: any, vacancyId: string) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/vacancy/${vacancyId}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
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
