/** @format */

export async function addTractor(data: any) {
    try {
        const formData = new FormData();

        for (const key in data) {
            if (
                key !== "photos" &&
                data[key] !== undefined &&
                data[key] !== null
            ) {
                formData.append(key, String(data[key])); // <-- строка, безопасно
            }
        }

        // Фото
        if (Array.isArray(data.photos)) {
            data.photos.forEach((file: File, index: number) => {
                if (file instanceof File) {
                    formData.append("photos", file); // имя поля — как в NestJS FileFieldsInterceptor
                }
            });
        }

        const res = await fetch(`${process.env.SERVER_URL}/tractor/create`, {
            method: "POST",
            body: formData, // НЕ указываем Content-Type — браузер сам выставит с boundary
            credentials: "include",
        });

        if (!res.ok) {
            console.error(res.statusText);
            throw new Error(`Ошибка: ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        console.error("Ошибка при добавлении тягача:", error);
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}
