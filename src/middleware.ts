import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "./lib/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const cookies = request.cookies;

    if (pathname.startsWith("/app")) {
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
                return NextResponse.redirect(new URL("/app", request.url));
            } catch (error) {
                console.log("Token verification failed in auth:", error);
                return NextResponse.next();
            }
        }
    }

    if (pathname.startsWith("/api/staffs")) {
        return await isAdministrator(request);
    }
}

export async function isAuthenticated(req: NextRequest) {
    const cookies = req.cookies;
    const token = cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json(
            {
                error: "Unauthorized",
                message: "Token is required for authentication",
            },
            { status: 401 }
        );
    }

    try {
        await verifyJwt(token);
        return NextResponse.next();
    } catch (error) {
        console.error("Error verifying token:", error);
        return NextResponse.json(
            {
                error: "Unauthorized",
                message: "Invalid token",
            },
            { status: 401 }
        );
    }
}

export async function isAdministrator(req: NextRequest) {
    const cookies = req.cookies;
    const token = cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json(
            {
                error: "Unauthorized",
                message: "Token is required to check administrator status",
            },
            { status: 401 }
        );
    }

    try {
        const payload = await verifyJwt(token);
        if (payload.role === "administrator") {
            return NextResponse.next();
        } else {
            return NextResponse.json(
                {
                    error: "Forbidden",
                    message:
                        "You do not have permission to access this resource",
                },
                { status: 403 }
            );
        }
    } catch (error) {
        console.error("Error verifying token:", error);
        return NextResponse.json(
            {
                error: "Unauthorized",
                message: "Invalid token",
            },
            { status: 401 }
        );
    }
}
