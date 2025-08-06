import { editDocumentById } from "@/lib/actions/mutation/documents";

test("Coba Edit Document", async () => {
    const result = await editDocumentById({
        documentId: "002d5375-c7bd-4bdd-b775-772fbcc6478c",
        data: {
            title: "Dokumen yang telah direvisi",
            description: "Ini adalah deskripsi dokumen yang telah direvisi.",
            documentTypeId: "dt-12",
            directoryId: "78a7ec8b-b797-47b5-9427-5bb236e2a515",
            documentNum: "DOC-12345",
            isPrivate: false,
        },
    });
    expect(result).toEqual({
        isSuccess: true,
    });
});