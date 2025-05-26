/** @format */

import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("accessToken");
    const { pathname } = req.nextUrl;

    // Если нет токена и пытаемся зайти на защищённую страницу
    if (!token && pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Если есть токен и пользователь на публичной странице
    const publicPages = ["/", "/login", "/register"];
    if (token && publicPages.includes(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next(); // Продолжить, если ни одно условие не выполнено
}
