import { getDocumentById } from "@/lib/actions/query/documents";

test("Get Documents by ID - Success", async () => {
  const result = await getDocumentById("f16c0a7e-2ba1-4ab2-b43c-d7a2900ef9f0");
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
  const result = await getDocumentById("ora nana");
  expect(result).toBeNull();
});

test("Get Document by ID - Empty ID", async () => {
  const result = await getDocumentById("");
  expect(result).toBeNull();
});
