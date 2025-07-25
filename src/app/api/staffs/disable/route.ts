import db from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
    try {
        const {username, isDisabled }: { username: string; isDisabled: boolean } = await req.json();
        if (!username || typeof isDisabled !== "boolean") {
            return Response.json(
                {
                    error: "Bad Request",
                    message: "Username and isDisabled status are required.",
                },
                { status: 400 }
            );
        }

        // Update the user's disabled status in the database
        await db
            .update(users)
            .set({ isDisabled })
            .where(eq(users.username, username));

        revalidateTag("user-session");

        return Response.json({ message: "User status updated successfully." });
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
