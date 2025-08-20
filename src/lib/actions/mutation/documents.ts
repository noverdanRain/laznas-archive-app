import { documents, documentsHistory } from "@/lib/db/schema";
import { throwActionError } from "../helpers";
import { randomUUID } from "crypto";
import db from "@/lib/db";
import { MutateActionsReturnType } from "@/types";
import { cookies } from "next/headers";
import { getUserSession } from "../query/user-session";
import { eq } from "drizzle-orm";
import { pinata } from "@/lib/pinata-config";

export type AddDocumentParams = typeof documents.$inferInsert;
export type EditDocumentParams = {
    documentId: string;
    data: {
        documentNum?: string;
        documentTypeId?: string;
        directoryId?: string;
        title?: string;
        description?: string;
        cid?: string;
        fileExt?: string;
        isPrivate?: boolean;
    };
};
type AddDocumentHistoryParams = typeof documentsHistory.$inferInsert;

export type AddDocumentResponse = {
    id: string;
    cid: string;
};

export type DeleteDocumentByIdParams = {
    id: string;
};

export type MakeFilePublicParams = {
    id: string;
    docId: string;
    url: string;
};

export type MakeFilePrivateParams = {
    id: string;
    docId: string;
    url: string;
};

const checkIsLoggedIn = async (token?: string): Promise<boolean> => {
    if (token) {
        const user = await getUserSession({ token });
        return !!user;
    } else {
        const user = await getUserSession();
        return !!user;
    }
};

async function addDocument(
    params: AddDocumentParams
): Promise<MutateActionsReturnType & { data?: AddDocumentResponse }> {
    try {
        const cookieStorage = await cookies();
        const token = cookieStorage.get("token")?.value;
        const useSession = await getUserSession({ token });
        if (!useSession) {
            return {
                isRejected: true,
                reject: {
                    message: "User session not found or invalid.",
                },
            };
        }

        const docId = randomUUID() as string;
        const dateNow = new Date();
        await db.insert(documents).values({
            id: params.id || docId,
            createdAt: dateNow,
            updatedAt: dateNow,
            userId: useSession.id,
            ...params,
        });
        await addDocumentHistory({
            documentId: params.id || docId,
            dateChanged: dateNow,
            cid: params.cid,
            documentTypeId: params.documentTypeId,
            fileExt: params.fileExt,
            isPrivate: params.isPrivate,
            title: params.title,
            description: params.description,
            directoryId: params.directoryId,
            documentNum: params.documentNum,
            changeNotes: "Menambahkan dokumen",
        });
        return {
            isSuccess: true,
            data: {
                id: docId,
                cid: params.cid,
            },
        };
    } catch (error) {
        console.log("Error adding document:", error);
        throwActionError(error);
    }
}

async function editDocumentById(
    params: EditDocumentParams
): Promise<MutateActionsReturnType> {
    const { documentId, data } = params;

    const changeNotes = `Mengubah ${data.title ? "nama, " : ""}
    ${data.documentNum ? "nomor dokumen, " : ""}${
        data.description ? "deskripsi, " : ""
    }${data.documentTypeId ? "jenis dokumen, " : ""}${
        data.directoryId ? "direktori, " : ""
    }${data.isPrivate !== undefined ? "visibilitas dokumen, " : ""}${
        data.cid ? "file dokumen" : ""
    }`;

    try {
        const cookieStorage = await cookies();
        const token = cookieStorage.get("token")?.value;
        const useSession = await getUserSession({ token });
        if (!useSession) {
            return {
                isRejected: true,
                reject: {
                    message: "User session not found or invalid.",
                },
            };
        }
        const [docBefore] = await db
            .select()
            .from(documents)
            .where(eq(documents.id, documentId))
            .limit(1);
        const dateNow = new Date();
        await db
            .update(documents)
            .set({
                ...data,
                updatedAt: dateNow,
            })
            .where(eq(documents.id, documentId));
        await addDocumentHistory({
            documentId,
            dateChanged: dateNow,
            cid: data.cid || docBefore.cid,
            documentTypeId: data.documentTypeId || docBefore.documentTypeId,
            fileExt: data.fileExt || docBefore.fileExt,
            isPrivate: data.isPrivate ?? docBefore.isPrivate,
            title: data.title || docBefore.title,
            description: data.description || docBefore.description,
            directoryId: data.directoryId || docBefore.directoryId,
            documentNum: data.documentNum || docBefore.documentNum,
            changeNotes,
        });
        return {
            isSuccess: true,
        };
    } catch (error) {
        console.error("Error editing document:", error);
        throwActionError(error);
    }
}

async function addDocumentHistory(
    params: AddDocumentHistoryParams
): Promise<MutateActionsReturnType> {
    try {
        const cookieStorage = await cookies();
        const token = cookieStorage.get("token")?.value;
        const useSession = await getUserSession({ token });
        if (!useSession) {
            return {
                isRejected: true,
                reject: {
                    message: "User session not found or invalid.",
                },
            };
        }
        const historyId = randomUUID() as string;
        await db.insert(documentsHistory).values({
            ...params,
            id: historyId,
            userId: useSession.id,
        });
        return {
            isSuccess: true,
        };
    } catch (error) {
        console.error("Error adding document history:", error);
        throwActionError(error);
    }
}

async function deleteDocumentById(
    params: DeleteDocumentByIdParams
): Promise<MutateActionsReturnType> {
    try {
        const { id } = params;
        if (!id) {
            return {
                isRejected: true,
                reject: {
                    message: "ID dokumen tidak boleh kosong.",
                },
            };
        }
        const { files: publicFiles } = await pinata.files.public
            .list()
            .name(id);
        await pinata.files.public.delete(publicFiles.map((file) => file.id));

        const { files: privateFiles } = await pinata.files.private
            .list()
            .name(id);
        await pinata.files.private.delete(privateFiles.map((file) => file.id));

        await db.delete(documents).where(eq(documents.id, id));
        return {
            isSuccess: true,
        };
    } catch (error) {
        console.error("Error deleting document:", error);
        throwActionError(error);
    }
}

async function makeFilePublic(
    params: MakeFilePublicParams
): Promise<MutateActionsReturnType> {
    try {
        const { id, docId, url } = params;
        if (!id || !docId || !url) {
            return {
                isRejected: true,
                reject: {
                    message: "ID, dokumen ID, dan URL tidak boleh kosong.",
                },
            };
        }
        await pinata.upload.public.url(url).name(docId);
        await pinata.files.private.delete([id]);

        return {
            isSuccess: true,
        };
    } catch (error) {
        console.error("Error making file public:", error);
        throwActionError(error);
    }
}

async function makeFilePrivate(
    params: MakeFilePrivateParams
): Promise<MutateActionsReturnType> {
    try {
        const { id, docId, url } = params;
        if (!id || !docId || !url) {
            return {
                isRejected: true,
                reject: {
                    message: "ID, dokumen ID, dan URL tidak boleh kosong.",
                },
            };
        }

        await pinata.upload.private.url(url).name(docId);
        await pinata.files.public.delete([id]);

        return {
            isSuccess: true,
        };
    } catch (error) {
        console.error("Error making file private:", error);
        throwActionError(error);
    }
}

export {
    addDocument,
    addDocumentHistory,
    deleteDocumentById,
    editDocumentById,
    makeFilePublic,
    makeFilePrivate,
};
