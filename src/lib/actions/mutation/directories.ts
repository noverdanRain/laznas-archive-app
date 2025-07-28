import db from "@/lib/db";
import {
    type GetDirectoryCacheTag,
    type GetTotalDocsInDirectoryCacheTag,
} from "../query/directories";
import { directories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { MutateActionsReturnType } from "@/types";
import { revalidateTag } from "next/cache";

type AddDirectoryParams = {
    name: string;
    description: string | null;
    isPrivate: boolean;
};

async function addDirectory(
    params: AddDirectoryParams
): Promise<MutateActionsReturnType> {
    const { name, description, isPrivate } = params;

    try {
        const [existingName] = await db
            .select()
            .from(directories)
            .where(eq(directories.name, name));
        if (existingName) {
            return {
                isRejected: true,
                reject: {
                    message: `Direktori dengan nama "${name}" sudah ada.`,
                },
            };
        }
        await db.insert(directories).values({
            name,
            description,
            isPrivate,
        });
        revalidateTag("get-dir-public" as GetDirectoryCacheTag);
        revalidateTag("get-dir-staff" as GetDirectoryCacheTag);
        return {
            isSuccess: true,
        };
    } catch (error) {
        console.error("Error create new directory", error);
        throw new Error(
            `Error: ${
                error instanceof Error ? error.message : "Something went wrong!"
            }`
        );
    }
}

export { addDirectory };
