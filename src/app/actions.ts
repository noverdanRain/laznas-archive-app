"use server";

import db from "@/db";
import { divisions, users } from "@/db/schema";
import { verifyJwt } from "@/lib/jwt";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

export const deleteSession = async () => {
    const cookieStore = await cookies();
    if (cookieStore.has("token")) {
        cookieStore.delete("token");
    }
};

export const getSession = unstable_cache(
    async (token: string | undefined) => {
        if (!token) {
            return null;
        }
        try {
            console.log("=========GET SESSION==========");
            const payload = await verifyJwt(token);
            const [user] = await db
                .select({
                    username: users.username,
                    role: users.role,
                    divisionName: divisions.name,
                    isDisabled: users.isDisabled,
                })
                .from(users)
                .where(eq(users.username, payload.username as string))
                .leftJoin(divisions, eq(users.divisionId, divisions.id));
            if(user.isDisabled) {
                return null; // User is disabled, return null
            }
            return user;
        } catch (error) {
            return null;
        }
    },
    ["user-session"],
    {
        tags: ["user-session"],
    }
);
