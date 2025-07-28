import { eq } from "drizzle-orm";
import db from "@/lib/db";
import { users } from "@/lib/db/schema";
import { revalidateTag } from "next/cache";
import { MutateActionsReturnType } from "@/types";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export interface IAddStaffParams {
    username: string;
    password: string;
    divisionId: string;
}

async function addStaff(
    params: IAddStaffParams
): Promise<MutateActionsReturnType> {
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
        const generatedUid = randomUUID()
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.insert(users).values({
            id: generatedUid,
            username: username.toLocaleLowerCase(),
            password: hashedPassword,
            divisionId,
        });
        revalidateTag("all-staff");
        return {
            isSuccess: true,
            isRejected: false,
        };
    } catch (error) {
        console.error("Error adding staff:", error);
        throw new Error(
            `Error: ${
                error instanceof Error ? error.message : "Something went wrong!"
            }`
        );
    }
}

async function disableStaff(id: string): Promise<MutateActionsReturnType> {
    try {
        await db
            .update(users)
            .set({ isDisabled: true })
            .where(eq(users.id, id));

        revalidateTag(`staff-${id}`);
        revalidateTag("all-staff");

        return {
            isSuccess: true,
            isRejected: false,
        };
    } catch (error) {
        console.error("Error disabling staff:", error);
        throw new Error(
            `Error: ${
                error instanceof Error ? error.message : "Something went wrong!"
            }`
        );
    }
}

async function enableStaff(id: string): Promise<MutateActionsReturnType> {
    try {
        await db
            .update(users)
            .set({ isDisabled: false })
            .where(eq(users.id, id));

        revalidateTag(`staff-${id}`);
        revalidateTag("all-staff");

        return {
            isSuccess: true,
            isRejected: false,
        };
    } catch (error) {
        console.error("Error enabling staff:", error);
        throw new Error(
            `Error: ${
                error instanceof Error ? error.message : "Something went wrong!"
            }`
        );
    }
}

export { addStaff, disableStaff, enableStaff };
