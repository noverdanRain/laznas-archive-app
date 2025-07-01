import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "./lib/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const cookies = request.cookies;

    if (pathname.startsWith("/dashboard")) {
        const token = cookies.get("token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/auth", request.url));
        }

        try {
            await verifyJwt(token);
            return NextResponse.next();
        } catch (error) {
            console.log("Token verification failed:", error);
            return NextResponse.redirect(new URL("/auth", request.url));
        }
    }

    if (pathname.startsWith("/auth")) {
        const token = cookies.get("token")?.value;
        if (token) {
            try {
                await verifyJwt(token);
                return NextResponse.redirect(
                    new URL("/dashboard", request.url)
                );
            } catch (error) {
                console.log("Token verification failed in auth:", error);
                return NextResponse.next();
            }
        }
    }
}
