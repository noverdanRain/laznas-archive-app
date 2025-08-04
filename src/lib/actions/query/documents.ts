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
import { eq, sql, gte, and, type SQL, asc, desc, count } from "drizzle-orm";
import { MySqlColumn } from "drizzle-orm/mysql-core";

export type GetDocumentsParams = {
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

const docsQuery = async (
  filters: SQL[],
  sort?: SQL,
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
    .where(and(...filters))
    .orderBy(sort || desc(documents.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
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
  const { filter, sort, paginate } = params || {};
  try {
    const filters = handleFilter(filter);
    const orderBy = handleSort(sort);
    const result = await docsQuery(
      filters,
      orderBy,
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

async function getDocumentById(id: string) {
  try {
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
      .leftJoin(documentTypes, eq(documents.documentTypeId, documentTypes.id))
      .leftJoin(users, eq(documents.userId, users.id))
      .leftJoin(divisions, eq(users.divisionId, divisions.id))
      .leftJoinLateral(docHistory, eq(documents.id, docHistory.documentId))
      .where(eq(documents.id, id));

    return document[0] || null;
  } catch (error) {
    console.log("Error in getDocumentById:", error);
    throwActionError(error);
  }
}

async function getPublicDocuments() {}

export { getAllDocuments, getPublicDocuments, getDocumentById };
