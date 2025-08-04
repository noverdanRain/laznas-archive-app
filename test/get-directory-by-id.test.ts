import { getDirectoryById } from "@/lib/actions/query/directories";
import db from "@/lib/db";
import { directories } from "@/lib/db/schema";
import { signToken } from "@/lib/jwt";
import { DirectoryTypes } from "@/types";
import axios from "axios";
import { eq } from "drizzle-orm";

test("Get Directory by ID - Success", async () => {
  await db.delete(directories).where(eq(directories.id, "test-get-directory"));
  // Insert a test directory
  await db.insert(directories).values({
    id: "test-get-directory",
    name: "Test Directory",
    description: "This is a test directory",
    isPrivate: true,
  });

  // Get token for authentication
  const token = await signToken({
    username: "revo",
    role: "staff",
    id: "fd2a5552-66cc-11f0-a420-862ccfb04071",
  });

  // Fetch the directory by test ID
  const result = await getDirectoryById({ id: "test-get-directory", token });
  expect(result).toMatchObject<DirectoryTypes>({
    id: "test-get-directory",
    name: "Test Directory",
    description: "This is a test directory",
    isPrivate: true,
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  });

  // Clean up test directory
  await db
    .delete(directories)
    .where(eq(directories.id, "test-get-directory-invalid-token"));
});

test("Get Directory by ID - Invalid Token", async () => {
  await db
    .delete(directories)
    .where(eq(directories.id, "test-get-directory-invalid-token"));
  // Insert a test directory
  await db.insert(directories).values({
    id: "test-get-directory-invalid-token",
    name: "Test Directory",
    description: "This is a test directory",
    isPrivate: true,
  });

  // Fetch the directory by test ID
  const result = await getDirectoryById({
    id: "test-get-directory-invalid-token",
    token: "token",
  });
  expect(result).toBeNull();

  // Clean up test directory
  await db
    .delete(directories)
    .where(eq(directories.id, "test-get-directory-invalid-token"));
});

test("Get Directory by ID - Not Found", async () => {
  const result = await getDirectoryById({
    id: "ora nana",
  });
  expect(result).toBeNull();
});

test("Get Directory by ID - Empty ID", async () => {
  const result = await getDirectoryById({
    id: "",
  });
  expect(result).toBeNull();
});
