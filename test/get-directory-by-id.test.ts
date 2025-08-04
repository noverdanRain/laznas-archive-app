import { getDirectoryById } from "@/lib/actions/query/directories";
import db from "@/lib/db";
import { directories } from "@/lib/db/schema";
import { DirectoryTypes } from "@/types";
import axios from "axios";
import { eq } from "drizzle-orm";

test("Get Directory by ID - Success", async () => {
  // Insert a test directory
  await db.insert(directories).values({
    id: "test-get-directory",
    name: "Test Directory",
    description: "This is a test directory",
    isPrivate: false,
  });

  // Fetch the directory by test ID
  const result = await getDirectoryById("test-get-directory");
  expect(result).toMatchObject<DirectoryTypes>({
    id: "test-get-directory",
    name: "Test Directory",
    description: "This is a test directory",
    isPrivate: false,
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  });

  // Clean up test directory
  await db.delete(directories).where(eq(directories.id, "test-get-directory"));
});

test("Get Directory by ID - Not Found", async () => {
  const result = await getDirectoryById("ora nana");
  expect(result).toBeNull();
});

test("Get Directory by ID - Empty ID", async () => {
  const result = await getDirectoryById("");
  expect(result).toBeNull();
});
