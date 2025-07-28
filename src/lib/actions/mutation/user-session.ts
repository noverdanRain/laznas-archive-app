import db from "@/lib/db";
import { users } from "@/lib/db/schema";
import { signToken } from "@/lib/jwt";
import { MutateActionsReturnType } from "@/types";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { throwActionError } from "../helpers";

interface ICreateUserSessionParams {
    username: string;
    password: string;
}

async function createUserSession(
    params: ICreateUserSessionParams
): Promise<MutateActionsReturnType> {
    try {
        const cookieStore = await cookies();

        const [user] = await db
            .select({
                password: users.password,
                role: users.role,
                isDisabled: users.isDisabled,
                id: users.id,
            })
            .from(users)
            .where(eq(users.username, params.username));

        if (!user) {
            return {
                isRejected: true,
                isSuccess: false,
                reject: {
                    message: "Username tidak ditemukan.",
                },
            };
        }

        const isPasswordValid = await bcrypt.compare(
            params.password,
            user.password
        );

        if (!isPasswordValid) {
            return {
                isRejected: true,
                isSuccess: false,
                reject: {
                    message: "Password salah.",
                },
            };
        }

        if (user.isDisabled) {
            return {
                isRejected: true,
                isSuccess: false,
                reject: {
                    message: "Akun ini telah dinonaktifkan.",
                },
            };
        }

        const tokenCreated = await signToken({
            username: params.username,
            role: user.role,
            id: user.id,
        });
        cookieStore.set("token", tokenCreated, {
            httpOnly: true,
            sameSite: "strict",
        });

        return {
            isSuccess: true,
            isRejected: false,
        };
    } catch (error) {
        console.error("Error fetching user:", error);
        throwActionError(error);
    }
}

async function removeUserSession(): Promise<void> {
    try {
        const cookieStore = await cookies();
        if (cookieStore.has("token")) {
            cookieStore.delete("token");
        }
    } catch (error) {
        console.error("Failed to remove user session:", error);
        throwActionError(error);
    }
}

export { removeUserSession, createUserSession };
