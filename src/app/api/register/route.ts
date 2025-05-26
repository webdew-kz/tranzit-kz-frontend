/** @format */

// app/api/login/route.ts

export async function POST(req: Request) {
    const body = await req.json();

    const res = await fetch(`${process.env.SERVER_URL}/auth/register`, {
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
