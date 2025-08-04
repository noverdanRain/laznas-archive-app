import { getDocumentHistoryById } from "@/lib/actions/query/documents";

test("Get Document History by ID - Success", async () => {
  const result = await getDocumentHistoryById({
    id: "d1bf0a1d-e3bd-41a4-b231-bd7a6246b222",
  });
  expect(result).toMatchObject({
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
  });
});

test("Get Document History by ID - Not Found", async () => {
  // Attempt to fetch a document that does not exist
  const result = await getDocumentHistoryById({
    id: "ora ana",
  });
  expect(result).toBeNull();
});

test("Get Document History by ID - Empty ID", async () => {
  // Attempt to fetch document with empty ID
  const result = await getDocumentHistoryById({
    id: "",
  });
  expect(result).toBeNull();
});
