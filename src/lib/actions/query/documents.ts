import db from "@/lib/db";
import {
    documents,
    users,
    directories,
    divisions,
    documentTypes,
    documentsHistory,
} from "@/lib/db/schema";
import { throwActionError } from "../helpers";
import {
    eq,
    sql,
    gte,
    and,
    type SQL,
    asc,
    desc,
    count,
    getTableColumns,
} from "drizzle-orm";
import { MySqlColumn } from "drizzle-orm/mysql-core";
import { getUserSession } from "./user-session";

export type GetDocumentsParams = {
    query?: string;
    filter?: {
        documentType?: string;
        addedBy?: string;
        visibility?: "public" | "private";
        directory?: string;
        addedByDivision?: string;
        lastAdded?: "7days" | "30days" | "6month" | "1year";
        lastUpdated?: "7days" | "30days" | "6month" | "1year";
    };
    sort?: {
        field: "createdAt" | "updatedAt" | "title";
        order: "asc" | "desc";
    };
    paginate?: {
        page?: number;
        pageSize?: number;
    };
};

export type GetDocumentByIdParams = {
    id: string;
    token?: string;
};

export type GetDocumentHistoriesByIdParams = {
    documentId: string;
};

export type GetDocumentHistoryByIdParams = {
    id: string;
};

const docHistoryQuery = () => {
    return db
        .select({
            documentId: documentsHistory.documentId,
            updatedBy: {
                username: users.username,
                divisions: divisions.name,
            },
            changeNotes: documentsHistory.changeNotes,
        })
        .from(documentsHistory)
        .leftJoin(users, eq(users.id, documentsHistory.userId))
        .leftJoin(divisions, eq(divisions.id, users.divisionId))
        .rightJoin(documents, eq(documents.id, documentsHistory.documentId))
        .where(eq(documents.updatedAt, documentsHistory.dateChanged))
        .as("documentHistory");
};

const checkIsLoggedIn = async (token?: string): Promise<boolean> => {
    if (token) {
        const user = await getUserSession({ token });
        return !!user;
    } else {
        const user = await getUserSession();
        return !!user;
    }
};

const docsQuery = async (
    filters: SQL[],
    sort?: SQL,
    query?: SQL,
    page = 1,
    pageSize = 12
) => {
    const docHistory = docHistoryQuery();

    return await db
        .select({
            id: documents.id,
            title: documents.title,
            cid: documents.cid,
            documentNum: documents.documentNum,
            description: documents.description,
            documentType: documentTypes.name,
            viewsCount: documents.viewsCount,
            isPrivate: documents.isPrivate,
            createdAt: documents.createdAt,
            updatedAt: documents.updatedAt,
            fileExt: documents.fileExt,
            directory: {
                id: directories.id,
                name: directories.name,
            },
            createdBy: {
                username: users.username,
                divisions: divisions.name,
            },
            updatedBy: {
                username: docHistory.updatedBy.username,
                divisions: docHistory.updatedBy.divisions,
            },
            changeNotes: docHistory.changeNotes,
        })
        .from(documents)
        .leftJoin(directories, eq(documents.directoryId, directories.id))
        .leftJoin(documentTypes, eq(documents.documentTypeId, documentTypes.id))
        .leftJoin(users, eq(documents.userId, users.id))
        .leftJoin(divisions, eq(users.divisionId, divisions.id))
        .leftJoinLateral(docHistory, eq(documents.id, docHistory.documentId))
        .where(and(query, ...filters))
        .orderBy(sort || desc(documents.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize);
};
const handleQuerySearch = (query?: string) => {
    if (!query) return undefined;
    const search = sql`MATCH(${documents.title}, ${documents.description}, ${documents.documentNum}, ${documents.cid}) AGAINST(${query} IN NATURAL LANGUAGE MODE)`;
    return search;
};

const handleFilter = (filter?: GetDocumentsParams["filter"]) => {
    const {
        addedBy,
        documentType,
        directory,
        visibility,
        addedByDivision,
        lastAdded,
        lastUpdated,
    } = filter || {};
    const filters: SQL[] = [];

    addedBy && filters.push(eq(users.id, addedBy));
    documentType && filters.push(eq(documents.documentTypeId, documentType));
    directory && filters.push(eq(documents.directoryId, directory));
    if (visibility) {
        visibility === "public" && filters.push(eq(documents.isPrivate, false));
        visibility === "private" && filters.push(eq(documents.isPrivate, true));
    }
    addedByDivision &&
        filters.push(
            sql<MySqlColumn>`${users.divisionId} IN (SELECT id FROM divisions WHERE id = ${addedByDivision})`
        );
    if (lastAdded) {
        const date = new Date();
        switch (lastAdded) {
            case "7days":
                date.setDate(date.getDate() - 7);
                filters.push(gte(documents.createdAt, date));
                break;
            case "30days":
                date.setDate(date.getDate() - 30);
                filters.push(gte(documents.createdAt, date));
                break;
            case "6month":
                date.setMonth(date.getMonth() - 6);
                filters.push(gte(documents.createdAt, date));
                break;
            case "1year":
                date.setFullYear(date.getFullYear() - 1);
                filters.push(gte(documents.createdAt, date));
                break;
        }
    }
    if (lastUpdated) {
        const date = new Date();
        switch (lastUpdated) {
            case "7days":
                date.setDate(date.getDate() - 7);
                filters.push(gte(documents.updatedAt, date));
                break;
            case "30days":
                date.setDate(date.getDate() - 30);
                filters.push(gte(documents.updatedAt, date));
                break;
            case "6month":
                date.setMonth(date.getMonth() - 6);
                filters.push(gte(documents.updatedAt, date));
                break;
            case "1year":
                date.setFullYear(date.getFullYear() - 1);
                filters.push(gte(documents.updatedAt, date));
                break;
        }
    }
    return filters;
};

const handleSort = (sort?: GetDocumentsParams["sort"]) => {
    if (!sort) return desc(documents.createdAt);
    const { field, order } = sort;
    if (field === "createdAt") {
        return order === "asc"
            ? asc(documents.createdAt)
            : desc(documents.createdAt);
    }
    if (field === "updatedAt") {
        return order === "asc"
            ? asc(documents.updatedAt)
            : desc(documents.updatedAt);
    }
    if (field === "title") {
        return order === "asc" ? asc(documents.title) : desc(documents.title);
    }
};

async function getAllDocuments(params?: GetDocumentsParams) {
    const { filter, sort, paginate, query } = params || {};
    try {
        const filters = handleFilter(filter);
        const orderBy = handleSort(sort);
        const searchQuery = handleQuerySearch(query);
        const result = await docsQuery(
            filters,
            orderBy,
            searchQuery,
            paginate?.page,
            paginate?.pageSize
        );
        const documentsCount = await db
            .select({ count: count() })
            .from(documents)
            .leftJoin(users, eq(documents.userId, users.id))
            .leftJoin(divisions, eq(users.divisionId, divisions.id))
            .where(and(...filters))
            .then((res) => Number(res[0]?.count) || 0);
        return { list: result, totalCount: documentsCount };
    } catch (error) {
        console.log("Error in getAllDocuments:", error);
        throwActionError(error);
    }
}

async function getDocumentById(params: GetDocumentByIdParams) {
    try {
        const { id, token } = params;
        const docHistory = docHistoryQuery();
        const document = await db
            .select({
                id: documents.id,
                title: documents.title,
                cid: documents.cid,
                documentNum: documents.documentNum,
                description: documents.description,
                documentType: documentTypes.name,
                viewsCount: documents.viewsCount,
                isPrivate: documents.isPrivate,
                createdAt: documents.createdAt,
                updatedAt: documents.updatedAt,
                fileExt: documents.fileExt,
                directory: {
                    id: directories.id,
                    name: directories.name,
                },
                createdBy: {
                    username: users.username,
                    divisions: divisions.name,
                },
                updatedBy: {
                    username: docHistory.updatedBy.username,
                    divisions: docHistory.updatedBy.divisions,
                },
                changeNotes: docHistory.changeNotes,
            })
            .from(documents)
            .leftJoin(directories, eq(documents.directoryId, directories.id))
            .leftJoin(
                documentTypes,
                eq(documents.documentTypeId, documentTypes.id)
            )
            .leftJoin(users, eq(documents.userId, users.id))
            .leftJoin(divisions, eq(users.divisionId, divisions.id))
            .leftJoinLateral(
                docHistory,
                eq(documents.id, docHistory.documentId)
            )
            .where(eq(documents.id, id));

        if (document[0]?.isPrivate) {
            const isLoggedIn = await checkIsLoggedIn(token);
            if (!isLoggedIn) {
                return null;
            }
        }

        return document[0] || null;
    } catch (error) {
        console.log("Error in getDocumentById:", error);
        throwActionError(error);
    }
}

async function getDocumentHistories(params: GetDocumentHistoriesByIdParams) {
    try {
        const { documentId } = params;

        if (!documentId) {
            return null;
        }

        const histories = await db
            .select({
                ...getTableColumns(documentsHistory),
                updatedBy: {
                    username: users.username,
                    divisions: divisions.name,
                },
            })
            .from(documentsHistory)
            .leftJoin(users, eq(users.id, documentsHistory.userId))
            .leftJoin(divisions, eq(users.divisionId, divisions.id))
            .where(eq(documentsHistory.documentId, documentId))
            .orderBy(desc(documentsHistory.dateChanged));

        if (histories.length === 0) {
            return null;
        }

        return histories;
    } catch (error) {
        console.log("Error in getDocumentHistories:", error);
        throwActionError(error);
    }
}

async function getDocumentHistoryById(params: GetDocumentHistoryByIdParams) {
    try {
        const { id } = params;

        if (!id) {
            return null;
        }

        const history = await db
            .select({
                ...getTableColumns(documentsHistory),
                updatedBy: {
                    username: users.username,
                    divisions: divisions.name,
                },
                directoryName: directories.name,
            })
            .from(documentsHistory)
            .leftJoin(users, eq(users.id, documentsHistory.userId))
            .leftJoin(divisions, eq(users.divisionId, divisions.id))
            .leftJoin(
                directories,
                eq(documentsHistory.directoryId, directories.id)
            )
            .where(eq(documentsHistory.id, id));

        if (history.length === 0) {
            return null;
        }

        return history[0];
    } catch (error) {
        console.log("Error in getDocumentHistoryById:", error);
        throwActionError(error);
    }
}

async function getPublicDocuments() {}

async function getDocumentsCount() {
    try {
        const documentCount = await db.$count(documents);
        return documentCount;
    } catch (error) {
        console.log("Error in getDocumentsCount:", error);
        throwActionError(error);
    }
}

async function getDocumentsCountByUserId({ userId }: { userId: string }) {
    try {
        const documentCount = await db.$count(
            documents,
            eq(documents.userId, userId)
        );
        return documentCount;
    } catch (error) {
        console.log("Error in getDocumentsCount:", error);
        throwActionError(error);
    }
}

export {
    getAllDocuments,
    getPublicDocuments,
    getDocumentById,
    getDocumentHistories,
    getDocumentHistoryById,
    getDocumentsCount,
    getDocumentsCountByUserId,
};
