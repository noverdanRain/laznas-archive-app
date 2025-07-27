"use server";

import { cookies } from "next/headers";
import { verifyToken } from "../jwt";
import { getStaffById } from "./staff";

interface IgetUserSessionParams {
    token: string | undefined;
}
async function getUserSession(params?: IgetUserSessionParams) {
    try {
        let token: string | undefined;
        if (params?.token) {
            token = params.token;
        } else {
            const cookieStore = await cookies();
            token = cookieStore.get("token")?.value;
        }
        if (!token) {
            return null;
        }
        const { isValid, payload } = await verifyToken(token);
        if (!isValid || !payload?.username) {
            return null;
        }
        const user = await getStaffById(payload.id);

        if (!user) {
            return null;
        }
        return user;
    } catch (error) {
        console.error("Error getting user session:", error);
        throw new Error(
            `Failed to get user session: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}

async function removeUserSession(): Promise<void> {
    const cookieStore = await cookies();
    if (cookieStore.has("token")) {
        cookieStore.delete("token");
    }
}

export {
    getUserSession,
    removeUserSession
}