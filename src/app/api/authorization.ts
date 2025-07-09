import { verifyJwt } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

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
        if ( payload.role === "administrator"){
            return NextResponse.next();
        } else {
            return NextResponse.json(
                {
                    error: "Forbidden",
                    message: "You do not have permission to access this resource",
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
