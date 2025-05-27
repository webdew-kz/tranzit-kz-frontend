/** @format */

// app/api/login/route.ts

export async function POST(req: Request) {
    const body = await req.json();

    const SERVER_URL = process.env.SERVER_URL || "https://api.itranzit.kz"; // Замените на ваш серверный URL по умолчанию
    if (!SERVER_URL) {
        return new Response("Server URL is not defined", {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    const res = await fetch(`${SERVER_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include", // ключевой момент
    });

    const headers = new Headers(res.headers);
    const data = await res.json();

    return new Response(JSON.stringify(data), {
        status: res.status,
        headers,
    });
}
