import db from "@/lib/db";
import { directories, documents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getUserSession } from "./user-session";
import { revalidateTag } from "next/cache";
import { throwActionError } from "../helpers";
import { DirectoryTypes } from "@/types";

export interface IGetDirectoriesParams {
  token?: string;
}
export type GetDirectoryCacheTag = `get-dir-${"staff" | "public"}`;
export type GetTotalDocsInDirectoryCacheTag = `get-total-docs-${string}`;
export type GetDirectoryByIdParams = { id: string; token?: string };

const checkIsLoggedIn = async (token?: string): Promise<boolean> => {
  if (token) {
    const user = await getUserSession({ token });
    return !!user;
  } else {
    const user = await getUserSession();
    return !!user;
  }
};

async function getDirectories(params?: IGetDirectoriesParams) {
  const isLoggedIn = await checkIsLoggedIn(params?.token);

  const cacheTag: GetDirectoryCacheTag = `get-dir-${
    isLoggedIn ? "staff" : "public"
  }`;
  const cache = unstable_cache(
    async () => {
      try {
        if (isLoggedIn) {
          const allDirectories = await db
            .select({
              id: directories.id,
              name: directories.name,
              description: directories.description,
              isPrivate: directories.isPrivate,
            })
            .from(directories);
          return allDirectories;
        } else {
          const publicDirectories = await db
            .select({
              id: directories.id,
              name: directories.name,
              description: directories.description,
              isPrivate: directories.isPrivate,
            })
            .from(directories)
            .where(eq(directories.isPrivate, false));
          return publicDirectories;
        }
      } catch (error) {
        console.error("Error fetching directories:", error);
        throwActionError(error);
      }
    },
    [cacheTag],
    {
      tags: [cacheTag],
    }
  );
  return cache();
}

async function getTotalDocsInDirectory(directoryId: string) {
  const cacheTag: GetTotalDocsInDirectoryCacheTag = `get-total-docs-${directoryId}`;
  const cache = unstable_cache(
    async () => {
      try {
        const count = await db.$count(
          documents,
          eq(documents.directoryId, directoryId)
        );
        return count;
      } catch (error) {
        console.error("Error fetching total documents in directory:", error);
        throwActionError(error);
      }
    },
    [cacheTag],
    {
      tags: [cacheTag],
    }
  );
  return cache();
}

async function getDirectoryById(params: GetDirectoryByIdParams) {
  try {
    const { id, token } = params;

    const [directory] = await db
      .select()
      .from(directories)
      .where(eq(directories.id, id));
    if (!directory) {
      return null;
    }
    if (directory.isPrivate) {
      const isLoggedIn = await checkIsLoggedIn(token);
      if (!isLoggedIn) {
        return null;
      }
    }
    return directory;
  } catch (error) {
    console.error("Error get directory: ", error);
    throwActionError(error);
  }
}

export { getDirectories, getTotalDocsInDirectory, getDirectoryById };
