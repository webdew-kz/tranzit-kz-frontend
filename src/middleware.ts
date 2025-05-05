/** @format */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("accessToken")?.value;
    const pathname = request.nextUrl.pathname;

    const isLoginPage = pathname === "/login";
    const isRegisterPage = pathname === "/register";
    const isHomePage = pathname === "/";
    const isProtectedPage = pathname.startsWith("/dashboard");

    // ✅ Если пользователь авторизован и пытается попасть на login/register
    if (token && (isLoginPage || isRegisterPage || isHomePage)) {
        try {
            // console.log(
            //     "Пользователь авторизован и находится на auth-странице"
            // );
            return NextResponse.redirect(new URL("/dashboard", request.url));
        } catch (err) {
            // console.log("JWT INVALID:", err);
            return NextResponse.next();
        }
    }

    // ✅ Если пользователь не авторизован и пытается попасть на защищённую страницу
    if (!token && isProtectedPage) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // ✅ Если пользователь неавторизован, но уже на /login или /register — оставляем
    // ✅ Если авторизован и на разрешённой странице — оставляем
    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/login", "/register", "/dashboard/:path*"],
};
