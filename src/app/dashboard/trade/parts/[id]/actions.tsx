export async function findById(id: string) {
	try {
		const res = await fetch(`${process.env.SERVER_URL}/parts/find-by-id/${id}`, {
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