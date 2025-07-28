"use server";

import { getUserSession } from "./query/user-session";
import { getDivisions } from "./query/divisions";
import { getAllStaff, getStaffById } from "./query/staff";
import { getDirectories, getTotalDocsInDirectory } from "./query/directories";

// Query
export { getUserSession, getDivisions, getAllStaff, getStaffById, getDirectories, getTotalDocsInDirectory };

// =================================================================================

import { addStaff, disableStaff, enableStaff } from "./mutation/staff";
import { removeUserSession, createUserSession } from "./mutation/user-session";
import { addDirectory } from "./mutation/directories";

// Mutation
export { addStaff, disableStaff, enableStaff, createUserSession, removeUserSession, addDirectory };
