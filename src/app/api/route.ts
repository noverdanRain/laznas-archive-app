import db from "@/db";
import { divisions, users} from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
    try {
        const result = await db.select().from(users);
        console.log("Divisions fetched successfully:", result);
    } catch (error) {
        console.log("Error fetching divisions:", error);
    }

    return Response.json({
        message: "Welcome to the Laznas Archive API",
        version: "1.0.0",
    });
}
