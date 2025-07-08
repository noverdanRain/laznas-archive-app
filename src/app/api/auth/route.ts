import db from "@/db";
import { users, divisions } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { signJwt, verifyJwt } from "@/lib/jwt";
import { NextRequest } from "next/server";

export async function POST(req: Request) {
    const cookieStore = await cookies();
    try {
        const reqData = await req.formData();
        const username = reqData.get("username") as string;
        const password = reqData.get("password") as string;
        if (!username || !password) {
            return Response.json(
                {
                    error: "Bad Request",
                    message: "Username and password are required",
                },
                { status: 400 }
            );
        }

        const [user] = await db
            .select({
                password: users.password,
                role: users.role,
            })
            .from(users)
            .where(eq(users.username, username));

        if (!user) {
            return Response.json(
                {
                    error: "Not Found",
                    message: "Username tidak ditemukan",
                },
                { status: 404 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return Response.json(
                {
                    error: "Unauthorized",
                    message: "Password yang anda masukkan salah",
                },
                { status: 401 }
            );
        }

        const token = await signJwt({
            username,
            role: user.role,
        });

        cookieStore.set("token", token, {
            httpOnly: true,
            sameSite: "strict",
        });

        return Response.json({
            message: "Login successful",
            user: {
                username,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Error processing request:", error);
        return Response.json(
            {
                error: "Internal Server Error",
                message: `An error occurred while processing your request: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    const cookieStore = request.cookies;
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return Response.json(
            {
                error: "Unauthorized",
                message: "No token provided",
            },
            { status: 401 }
        );
    }

    try {
        const payload = await verifyJwt(token);
        const [user] = await db
            .select({
                username: users.username,
                role: users.role,
                createdAt: users.createdAt,
                divisionName: divisions.name,
            })
            .from(users)
            .where(eq(users.username, payload.username as string))
            .leftJoin(divisions, eq(users.divisionId, divisions.id));

        return Response.json({
            message: "Token is valid",
            user,
        });
    } catch (err) {
        return Response.json(
            {
                error: "Unauthorized",
                message: `Invalid token: ${
                    err instanceof Error ? err.message : "Unknown error"
                }`,
            },
            { status: 401 }
        );
    }
}
