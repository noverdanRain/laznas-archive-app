import db from "@/lib/db";
import { users, divisions } from "@/lib/db/schema";
import bcrypt from "bcryptjs";
import { eq, is, not } from "drizzle-orm";
import { cookies } from "next/headers";
import { signJwt, verifyJwt } from "@/lib/jwt";
import { NextRequest } from "next/server";
import { errorHandler500, notOkResponse } from "../helpers";

export async function POST(req: Request) {
    const cookieStore = await cookies();
    try {
        const reqData = await req.formData();
        const username = reqData.get("username") as string;
        const password = reqData.get("password") as string;
        if (!username || !password) {
            return notOkResponse(
                "Bad Request",
                "Username and password are required",
                400
            );
        }

        const [user] = await db
            .select({
                password: users.password,
                role: users.role,
                isDisabled: users.isDisabled,
                id: users.id,
            })
            .from(users)
            .where(eq(users.username, username));

        if (!user) {
            return notOkResponse(
                "Not Found",
                "Username tidak ditemukan",
                404
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return notOkResponse(
                "Unauthorized",
                "Password yang anda masukkan salah",
                401
            );
        }

        if (user.isDisabled) {
            return notOkResponse(
                "Forbidden",
                "Akun telah dinonaktifkan",
                403
            )
        }

        const token = await signJwt({
            username,
            role: user.role,
            id: user.id,
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
        return errorHandler500(error);
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
                isDisabled: users.isDisabled,
            })
            .from(users)
            .where(eq(users.username, payload.username as string))
            .leftJoin(divisions, eq(users.divisionId, divisions.id));

        return Response.json({
            message: "Token is valid",
            user: {
                username: user.username,
                divisionName: user.divisionName,
                role: user.role,
            },
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
