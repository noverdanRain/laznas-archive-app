"use server";

// Query
import { getUserSession } from "./query/user-session";
import { getDivisions } from "./query/divisions";
import { getAllStaff, getStaffById } from "./query/staff";
import {
    getDirectories,
    getDirectoryById,
    getDirectoriesCount,
} from "./query/directories";
import { getDocumentTypes, } from "./query/document-type";
import { getPinataPresignedUrl, } from "./query/pinata-presigned-url";
import {
    getAllDocuments,
    getDocumentById,
    getDocumentHistories,
    getDocumentHistoryById,
    getPublicDocuments,
    getDocumentsCount,
    getDocumentsCountByUserId,
} from "./query/documents";

import { pinataPrivateFile, pinataPublicFile, } from "./query/pinata";

export {
    getUserSession,
    getDivisions,
    getAllStaff,
    getStaffById,
    getDirectories,
    getDocumentTypes,
    getPinataPresignedUrl,
    getAllDocuments,
    getDocumentById,
    getDocumentHistories,
    getDocumentHistoryById,
    getPublicDocuments,
    getDirectoryById,
    pinataPrivateFile,
    pinataPublicFile,
    getDirectoriesCount,
    getDocumentsCount,
    getDocumentsCountByUserId,
};

// =================================================================================

// Mutation
import { addStaff, disableStaff, enableStaff, updateStaffById ,} from "./mutation/staff";
import { removeUserSession, createUserSession, } from "./mutation/user-session";
import {
    addDirectory,
    editDirectory,
    deleteDirectoryById, 
} from "./mutation/directories";
import { addDocument, addDocumentHistory,deleteDocumentById, editDocumentById } from "./mutation/documents";

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
    deleteDocumentById,
    editDocumentById,
};
