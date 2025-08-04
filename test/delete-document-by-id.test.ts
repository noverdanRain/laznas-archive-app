import {
  addDocument,
  deleteDocumentById,
} from "@/lib/actions/mutation/documents";
import db from "@/lib/db";
import { documents } from "@/lib/db/schema";
import { signToken } from "@/lib/jwt";

test("Delete Document - Success", async () => {
  // Setup: Create a test document to delete
  await db.insert(documents).values({
    id: "test-delete-document",
    documentTypeId: "c86b4188-6702-11f0-a420-862ccfb04071",
    directoryId: "f9957466-7119-11f0-a420-862ccfb04071",
    title: "test",
    cid: "test",
    fileExt: "txt",
    isPrivate: true,
  });

  // Generate a token for the test user
  const token = await signToken({
    username: "revo",
    role: "staff",
    id: "fd2a5552-66cc-11f0-a420-862ccfb04071",
  });

  // Test: Call deleteDocumentById with the test document ID
  const result = await deleteDocumentById({
    id: "test-delete-document",
    token,
  });
  expect(result).toEqual({
    isSuccess: true,
  });
});

test("Delete Document - Empty ID", async () => {
  // Generate a token for the test user
  const token = await signToken({
    username: "revo",
    role: "staff",
    id: "fd2a5552-66cc-11f0-a420-862ccfb04071",
  });

  const result = await deleteDocumentById({ id: "", token });
  expect(result).toEqual({
    isRejected: true,
    reject: {
      message: "ID dokumen tidak boleh kosong.",
    },
  });
});

test("Delete Document - Not Logged In", async () => {
  // Attempt to delete a document without a token
  const result = await deleteDocumentById({
    id: "test-delete-document",
    token: "false-token",
  });
  expect(result).toEqual({
    isRejected: true,
    reject: {
      message: "User belum login.",
    },
  });
});
