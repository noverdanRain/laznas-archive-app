import {
  addDirectory,
  deleteDirectoryById,
} from "@/lib/actions/mutation/directories";
import db from "@/lib/db";
import { directories } from "@/lib/db/schema";
import axios from "axios";

async function revalidateTag(tag: string) {
  console.log(`Revalidating tag: ${tag}`);
  try {
    const data = await axios.post("http://localhost:3000/api/revalidate-tag", {
      tag,
    });
    console.log("Revalidation response:", data.data);
    console.log(`Successfully revalidated tag: ${tag}`);
  } catch (error) {
    throw new Error(`Failed to revalidate tag: ${tag}`);
  }
}

// Mock revalidateTag
jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
}));

test("Delete Directory - Success", async () => {
  // Setup: Create a test directory to delete
  await db.insert(directories).values({
    id: "test",
    name: "test",
    description: "test",
    isPrivate: false,
  });

  // Test: Call deleteDirectory with the test directory ID
  const result = await deleteDirectoryById("test");
  await revalidateTag("get-dir-public");
  await revalidateTag("get-dir-staff");
  expect(result).toEqual({
    isSuccess: true,
  });
});

test("Delete Directory - Not Found", async () => {
  const result = await deleteDirectoryById("ora nana");
  expect(result).toEqual({
    isRejected: true,
    reject: {
      message: "Direktori dengan id ora nana tidak ditemukan.",
    },
  });
});

test("Delete Directory - Empty ID", async () => {
  const result = await deleteDirectoryById("");
  expect(result).toEqual({
    isRejected: true,
    reject: {
      message: "ID direktori tidak boleh kosong.",
    },
  });
});
