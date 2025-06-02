/** @format */

export async function getTruck(id: string) {
    try {
        const res = await fetch(
            `${process.env.SERVER_URL}/truck/find-by-id/${id}`,
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

export async function copyTruck(data: any, oldPhotos?: string[]) {
    try {
        console.log(oldPhotos);

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

        if (oldPhotos?.length) {
            oldPhotos.forEach((photo) => {
                formData.append("oldPhotos", photo);
            });
        }

        const res = await fetch(`${process.env.SERVER_URL}/truck/create-copy`, {
            method: "POST",
            body: formData, // НЕ указываем Content-Type — браузер сам выставит с boundary
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
