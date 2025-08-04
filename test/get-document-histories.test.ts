import {
  getDocumentById,
  getDocumentHistories,
} from "@/lib/actions/query/documents";

test("Get Document Histories by Document ID - Success", async () => {
  // Get token for authentication
  const result = await getDocumentHistories({
    documentId: "baead896-7e69-4312-a52d-61a99f4a706b",
  });
  expect(result).toHaveLength(2);
  expect(result).toMatchObject([
    {
      id: "d1bf0a1d-e3bd-41a4-b231-bd7a6246b222",
      documentId: "baead896-7e69-4312-a52d-61a99f4a706b",
      documentTypeId: "c86b3f57-6702-11f0-a420-862ccfb04071",
      directoryId: "ee075f98-672f-11f0-a420-862ccfb04071",
      userId: "fecbbe09-6bac-11f0-a420-862ccfb04071",
      documentNum: "3007/2025/UNCK",
      title: "Sertifikat Masuk",
      description: null,
      cid: "bafybeifxz6de5xzqxr7jzdw2kj46ttk3jyzcfn6qxf4c7iglg63rwhboxa",
      fileExt: "pdf",
      isPrivate: false,
      changeNotes: "Menambahkan dokumen",
      dateChanged: new Date("2025-07-30T11:21:35.000Z"),
    },
    {
      id: "ddff862d-6d37-11f0-a420-862ccfb04071",
      documentId: "baead896-7e69-4312-a52d-61a99f4a706b",
      documentTypeId: "c86b3f57-6702-11f0-a420-862ccfb04071",
      directoryId: "ee075f98-672f-11f0-a420-862ccfb04071",
      userId: "f067cac8-6b06-11f0-a420-862ccfb04071",
      documentNum: "3007/2025/UNCK",
      title: "Sertifikat Mahasiswa Magang",
      description: "Sertifikat pendaftaran mahasiswa magang 2025",
      cid: "bafybeifxz6de5xzqxr7jzdw2kj46ttk3jyzcfn6qxf4c7iglg63rwhboxa",
      fileExt: "pdf",
      isPrivate: false,
      changeNotes: "Mengubah nama dan deskripsi",
      dateChanged: new Date("2025-07-30T11:25:16.000Z"),
    },
  ]);
});

test("Get Document Histories by Document ID - Not Found", async () => {
  // Attempt to fetch a document that does not exist
  const result = await getDocumentHistories({
    documentId: "ora ana",
  });
  expect(result).toBeNull();
});

test("Get Document Histories by Document ID - Empty ID", async () => {
  // Attempt to fetch document with empty ID
  const result = await getDocumentHistories({
    documentId: "",
  });
  expect(result).toBeNull();
});
