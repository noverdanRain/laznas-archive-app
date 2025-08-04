import db from "@/lib/db";
import {
  type GetDirectoryCacheTag,
  type GetTotalDocsInDirectoryCacheTag,
} from "../query/directories";
import { directories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { MutateActionsReturnType } from "@/types";
import { revalidateTag } from "next/cache";
import { throwActionError } from "../helpers";

type AddDirectoryParams = {
  name: string;
  description: string | null;
  isPrivate: boolean;
};
type EditDirectoryParams = {
  id: string;
  name?: string;
  description?: string | null;
  isPrivate?: boolean;
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
    console.error("Error create new directory: ", error);
    throwActionError(error);
  }
}

async function editDirectory(
  params: EditDirectoryParams
): Promise<MutateActionsReturnType> {
  const { id, name, description, isPrivate } = params;

  if (!id) {
    return {
      isRejected: true,
      reject: {
        message: "ID direktori tidak boleh kosong.",
      },
    };
  }

  try {
    // Execute queries in parallel for better performance
    const [existingNameQuery, existingDirectoryQuery] = await Promise.all([
      name
        ? db.select().from(directories).where(eq(directories.name, name))
        : Promise.resolve([]),
      db.select().from(directories).where(eq(directories.id, id)),
    ]);

    const [existingName] = existingNameQuery;
    const [existingDirectory] = existingDirectoryQuery;

    if (name && existingName) {
      return {
        isRejected: true,
        reject: {
          message: `Direktori dengan nama "${name}" sudah ada.`,
        },
      };
    }

    if (!existingDirectory) {
      return {
        isRejected: true,
        reject: {
          message: `Direktori dengan id ${id} tidak ditemukan.`,
        },
      };
    }

    // Only update fields that are provided
    const updateData: Partial<{
      name: string;
      description: string | null;
      isPrivate: boolean;
    }> = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isPrivate !== undefined) updateData.isPrivate = isPrivate;

    // Only execute update if there are fields to update
    if (Object.keys(updateData).length > 0) {
      await db
        .update(directories)
        .set(updateData)
        .where(eq(directories.id, id));
    }

    revalidateTag("get-dir-public" as GetDirectoryCacheTag);
    revalidateTag("get-dir-staff" as GetDirectoryCacheTag);
    return {
      isSuccess: true,
    };
  } catch (error) {
    console.error("Error edit directory: ", error);
    throwActionError(error);
  }
}

export { addDirectory, editDirectory };
