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

export const getSessionFromClient = async ()=>{
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    return await getSession(token);
}

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
            return user;
        } catch (error) {
            return null;
        }
    },
    [],
    {
        tags: ["user-session"],
    }
);

export const isDisabledStaff = unstable_cache(
    async (username: string) => {
        const [user] = await db
            .select({ isDisabled: users.isDisabled })
            .from(users)
            .where(eq(users.username, username));
        return user?.isDisabled;
    },
    [],
    {
        tags: ["staff-disabled-status"],
    }
);
