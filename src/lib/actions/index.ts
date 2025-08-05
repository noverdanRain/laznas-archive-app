"use server";

// Query
import { getUserSession } from "./query/user-session";
import { getDivisions } from "./query/divisions";
import { getAllStaff, getStaffById } from "./query/staff";
import {
    getDirectories,
    getTotalDocsInDirectory,
    getDirectoryById,
} from "./query/directories";
import { getDocumentTypes } from "./query/document-type";
import { getPinataPresignedUrl } from "./query/pinata-presigned-url";
import {
    getAllDocuments,
    getDocumentById,
    getDocumentHistories,
    getDocumentHistoryById,
    getPublicDocuments,
} from "./query/documents";

export {
    getUserSession,
    getDivisions,
    getAllStaff,
    getStaffById,
    getDirectories,
    getTotalDocsInDirectory,
    getDocumentTypes,
    getPinataPresignedUrl,
    getAllDocuments,
    getDocumentById,
    getDocumentHistories,
    getDocumentHistoryById,
    getPublicDocuments,
    getDirectoryById,
};

// =================================================================================

// Mutation
import { addStaff, disableStaff, enableStaff, updateStaffById } from "./mutation/staff";
import { removeUserSession, createUserSession } from "./mutation/user-session";
import {
    addDirectory,
    editDirectory,
    deleteDirectoryById,
} from "./mutation/directories";
import { addDocument, addDocumentHistory } from "./mutation/documents";

export {
    addStaff,
    disableStaff,
    enableStaff,
    createUserSession,
    removeUserSession,
    addDirectory,
    editDirectory,
    deleteDirectoryById,
    addDocument,
    addDocumentHistory,
    updateStaffById,
};
