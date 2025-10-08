import db from "@/lib/db";
import { divisions } from "@/lib/db/schema";
import { throwActionError } from "../helpers";

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
        throwActionError(error);
    }
}
