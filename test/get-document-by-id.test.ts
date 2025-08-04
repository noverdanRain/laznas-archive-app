import { getDocumentById } from "@/lib/actions/query/documents";
import { signToken } from "@/lib/jwt";

test("Get Documents by ID - Success", async () => {
  // Get token for authentication
  const token = await signToken({
    username: "revo",
    role: "staff",
    id: "fd2a5552-66cc-11f0-a420-862ccfb04071",
  });

  const result = await getDocumentById({
    id: "f16c0a7e-2ba1-4ab2-b43c-d7a2900ef9f0",
    token,
  });
  expect(result).toMatchObject({
    id: "f16c0a7e-2ba1-4ab2-b43c-d7a2900ef9f0",
    title: "Skripsi Draft Mahasiswa Magang",
    cid: "bafybeiacpdelcmyx7fj2sioqnymzcoauf5gm7r2klxirbs7oxgrjcwfoxm",
    documentNum: "3007/2025/DBN8",
    description: null,
    documentType: "Lainnya",
    viewsCount: 0,
    isPrivate: true,
    createdAt: new Date("2025-05-22T11:22:25.000Z"),
    updatedAt: new Date("2025-07-30T11:22:25.000Z"),
    fileExt: "pdf",
    directory: {
      id: "b6d4d174-6bd0-11f0-a420-862ccfb04071",
      name: "Surat Keluar",
    },
    createdBy: { username: "vespa", divisions: "Kelembagaan" },
    updatedBy: { username: "vespa", divisions: "Kelembagaan" },
    changeNotes: "Menambahkan dokumen",
  });
});

test("Get Document by ID - Not Found", async () => {
  // Generate a token for authentication
  const token = await signToken({
    username: "revo",
    role: "staff",
    id: "fd2a5552-66cc-11f0-a420-862ccfb04071",
  });

  // Attempt to fetch a document that does not exist
  const result = await getDocumentById({
    id: "ora ana",
    token,
  });
  expect(result).toBeNull();
});

test("Get Document by ID - Empty ID", async () => {
  // Generate a token for authentication
  const token = await signToken({
    username: "revo",
    role: "staff",
    id: "fd2a5552-66cc-11f0-a420-862ccfb04071",
  });

  // Attempt to fetch document with empty ID
  const result = await getDocumentById({
    id: "",
    token,
  });
  expect(result).toBeNull();
});
