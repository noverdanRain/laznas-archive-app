import { cookies } from "next/headers";

async function removeUserSession(): Promise<void> {
    const cookieStore = await cookies();
    if (cookieStore.has("token")) {
        cookieStore.delete("token");
    }
}

export {
    removeUserSession
}