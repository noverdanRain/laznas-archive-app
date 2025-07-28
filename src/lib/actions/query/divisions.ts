import db from "@/lib/db";
import { divisions } from "@/lib/db/schema";

type GetDivisionReturnType = (typeof divisions.$inferSelect)[];

export async function getDivisions(): Promise<GetDivisionReturnType | null> {
    try {
        const result = await db.select().from(divisions);
        if (result.length === 0) {
            return null;
        }
        return result;
    } catch (error) {
        console.error("Error fetching divisions:", error);
        throw new Error(
            `Failed to fetch divisions: ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
}
