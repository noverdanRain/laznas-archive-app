import db from "@/lib/db";
import { divisions, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { AddStaffParams, StaffTypes } from "@/types";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        const staffs: StaffTypes[] = await db
            .select({
                username: users.username,
                role: users.role,
                isDisabled: users.isDisabled,
                division: {
                    id: divisions.id,
                    name: divisions.name,
                },
            })
            .from(users)
            .innerJoin(divisions, eq(users.divisionId, divisions.id))
            .orderBy(users.username);

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

export async function POST(req: NextRequest) {
    try {
        const reqData: AddStaffParams = await req.json();
        if (!reqData.username || !reqData.password || !reqData.divisionId) {
            return Response.json(
                {
                    error: "Bad Request",
                    message:
                        "Username, password, and division ID are required.",
                },
                { status: 400 }
            );
        }
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.username, reqData.username));

        if (existingUser?.username) {
            return Response.json(
                {
                    error: "Conflict",
                    message: "Username already exists.",
                },
                { status: 409 }
            );
        }

        const pwHash = bcrypt.hashSync(reqData.password, 10);

        await db.insert(users).values({
            username: reqData.username,
            password: pwHash,
            divisionId: reqData.divisionId,
        });

        return Response.json(
            {
                message: "Staff account created successfully.",
            },
            { status: 201 }
        );
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
