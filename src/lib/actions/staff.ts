"use server";

import { eq } from "drizzle-orm";
import db from "../db";
import { divisions, users } from "../db/schema";
import { unstable_cache } from "next/cache";
import { MutateActionsReturnType } from "@/types";
import bcrypt from "bcryptjs";

export interface IAddStaffParams {
    username: string;
    password: string;
    divisionId: string;
}

async function getStaffById(id: string) {
    const get = unstable_cache(
        async () => {
            try {
                const [user] = await db
                    .select({
                        id: users.id,
                        username: users.username,
                        role: users.role,
                        divisionName: divisions.name,
                        isDisabled: users.isDisabled,
                    })
                    .from(users)
                    .where(eq(users.id, id))
                    .leftJoin(divisions, eq(users.divisionId, divisions.id));

                if (!user.id) {
                    return null;
                }
                return user;
            } catch (error) {
                console.log("Error select staff by id: ", error);
                throw new Error(
                    `Failed to select staff by id: ${
                        error instanceof Error ? error.message : "Unknown error"
                    }`
                );
            }
        },
        [`staff-${id}`],
        {
            tags: [`staff-${id}`],
        }
    );

    return await get();
}

async function addStaff(params: IAddStaffParams): Promise<MutateActionsReturnType> {
    const { username, password, divisionId } = params;
        try {
            const [existingUser] = await db
                .select()
                .from(users)
                .where(eq(users.username, username));
            if (existingUser?.username) {
                return {
                    isSuccess: false,
                    isRejected: true,
                    reject: {
                        message: "Username sudah dipakai.",
                    },
                };
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.insert(users).values({
                username,
                password: hashedPassword,
                divisionId,
            });
            return {
                isSuccess: true,
                isRejected: false,
            };
        } catch (error) {
            console.error("Error checking existing user:", error);
            throw new Error(
                `Error: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
}

export { getStaffById, addStaff };
