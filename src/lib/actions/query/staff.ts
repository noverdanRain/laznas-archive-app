import { eq } from "drizzle-orm";
import db from "@/lib/db";
import { divisions, users } from "@/lib/db/schema";
import { unstable_cache } from "next/cache";


async function getAllStaff() {
    const get = unstable_cache(
        async () => {
            try {
                const staffs = await db
                    .select({
                        id: users.id,
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
                return staffs;
            } catch (error) {
                console.error("Error while select all staffs: ", error);
                throw new Error(
                    `Error: ${
                        error instanceof Error
                            ? error.message
                            : "Something went wrong!"
                    }`
                );
            }
        },
        ["all-staff"],
        {
            tags: ["all-staff"],
        }
    );
    return await get();
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
                console.error("Error select staff by id: ", error);
                throw new Error(
                    `Failed to select staff by id: ${
                        error instanceof Error
                            ? error.message
                            : "Something went wrong!"
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

export { getAllStaff, getStaffById };
