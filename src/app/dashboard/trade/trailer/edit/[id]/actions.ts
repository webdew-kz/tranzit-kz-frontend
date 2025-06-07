/** @format */

export async function editTrailer(
    data: any,
    trailerId: string,
    oldPhotos?: string[]
) {
    try {
        const formData = new FormData();

        console.log(
            "Editing trailer with data:",
            data,
            "and trailerId:",
            trailerId
        );

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

        if (Array.isArray(oldPhotos)) {
            oldPhotos.forEach((photo: string) => {
                formData.append("oldPhotos", photo); // имя поля — как в NestJS FileFieldsInterceptor
            });
        }

        const res = await fetch(
            `${process.env.SERVER_URL}/trailer/update/${trailerId}`,
            {
                method: "POST",
                body: formData, // НЕ указываем Content-Type — браузер сам выставит с boundary
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

export async function getTrailer(id: string) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/trailer/find-by-id/${id}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
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
