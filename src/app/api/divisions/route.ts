import { divisions } from "@/db/schema";
import db from "@/db";
import { DivisionTypes } from "@/types";

export async function GET() {
    try {
        const allDivisions: DivisionTypes[] = await db.select().from(divisions);
        return Response.json(allDivisions);
    } catch (error) {
        console.error("Error fetching divisions:", error);
        return Response.json(
            {
                error: "Internal Server Error",
                message: `An error occurred while fetching divisions: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`,
            },
            { status: 500 }
        );
    }
}
