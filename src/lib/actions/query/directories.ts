import db from "@/lib/db";
import { directories, divisions, documents } from "@/lib/db/schema";
import { and, eq, getTableColumns, sql, SQL } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getUserSession } from "./user-session";
import { throwActionError } from "../helpers";

export interface IGetDirectoriesParams {
    token?: string;
    filter?: {
        divisionId?: string;
        isPrivate?: boolean;
        query?: string;
    };
}
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

const handleFilter = (params: IGetDirectoriesParams["filter"]) => {
    const { isPrivate, query, divisionId } = params || {};
    const filters: SQL[] = [];

    if (isPrivate !== undefined) {
        filters.push(eq(directories.isPrivate, isPrivate));
    }

    if (divisionId) {
        filters.push(eq(directories.divisionId, divisionId));
    }
    if (query) {
        filters.push(
            sql`${directories.name} LIKE ${`%${query}%`}`
        );
    }
    return filters;
};

async function getDirectories(params?: IGetDirectoriesParams) {
    const { filter } = params || {};

    try {
        const result = await db
            .select({
                id: directories.id,
                name: directories.name,
                description: directories.description,
                isPrivate: directories.isPrivate,
                divisionId: directories.divisionId,
                divisionName: divisions.name,
                documentsCount: db.$count(
                    documents,
                    eq(documents.directoryId, directories.id)
                ),
            })
            .from(directories)
            .leftJoin(divisions, eq(directories.divisionId, divisions.id))
            .where(and(...handleFilter(filter)));
        return result;
    } catch (error) {
        console.error("Error fetching directories:", error);
        throwActionError(error);
    }
}

async function getDirectoryById(params: GetDirectoryByIdParams) {
    try {
        const { id, token } = params;

        const [directory] = await db
            .select({
                ...getTableColumns(directories),
                divisionName: divisions.name,
            })
            .from(directories)
            .leftJoin(divisions, eq(directories.divisionId, divisions.id))
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

async function getDirectoriesCount() {
    try {
        const count = await db.$count(directories);
        return count;
    } catch (error) {
        console.error("Error fetching directories count:", error);
        throwActionError(error);
    }
}

export {
    getDirectories,
    getDirectoryById,
    getDirectoriesCount,
};
