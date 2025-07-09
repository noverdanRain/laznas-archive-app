import db from "@/db";
import { divisions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { isAdministrator } from "../authorization";

export async function GET(request: NextRequest) {
    const cookies = request.cookies;
    const token = cookies.get("token")?.value;
    
    try {
        const staffs = await db.select({
            username: users.username,
            division: divisions.name,
            role: users.role,
            isDisabled: users.isDisabled,
        }).from(users).innerJoin(divisions, eq(users.divisionId, divisions.id));

        return Response.json(staffs);

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