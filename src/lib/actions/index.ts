"use server";

import { getUserSession } from "./query/user-session";
import { getDivisions } from "./query/divisions";
import { getAllStaff, getStaffById } from "./query/staff";

// Query
export { getUserSession, getDivisions, getAllStaff, getStaffById };

// =================================================================================

import { addStaff, disableStaff, enableStaff } from "./mutation/staff";
import { removeUserSession } from "./mutation/user-session";

// Mutation
export { addStaff, disableStaff, enableStaff, removeUserSession };
