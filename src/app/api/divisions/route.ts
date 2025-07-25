import { divisions } from "@/lib/db/schema";
import db from "@/lib/db";
import { DivisionTypes } from "@/types";
import { errorHandler500 } from "../helpers";

export async function GET() {
    try {
        const allDivisions: DivisionTypes[] = await db.select().from(divisions);
        return Response.json(allDivisions);
    } catch (error) {
        console.error("Error fetching divisions:", error);
        return errorHandler500(error);
    }
}
