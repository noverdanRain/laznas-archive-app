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

async function getDirectories(params?: IGetDirectoriesParams) {
  const checkIsLoggedIn = async (): Promise<boolean> => {
    if (params?.token) {
      const user = await getUserSession({ token: params.token });
      return !!user;
    } else {
      const user = await getUserSession();
      return !!user;
    }
  };

  const isLoggedIn = await checkIsLoggedIn();

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

async function getDirectoryById(id: string): Promise<DirectoryTypes | null> {
  try {
    if (!id) {
      return null;
    }

    const [directory] = await db
      .select()
      .from(directories)
      .where(eq(directories.id, id));
    if (!directory) {
      return null;
    }
    return directory;
  } catch (error) {
    console.error("Error get directory: ", error);
    throwActionError(error);
  }
}

export { getDirectories, getTotalDocsInDirectory, getDirectoryById };
