import { documents, documentsHistory } from "@/lib/db/schema";
import { throwActionError } from "../helpers";
import { randomUUID } from "crypto";
import db from "@/lib/db";
import { MutateActionsReturnType } from "@/types";
import { cookies } from "next/headers";
import { getUserSession } from "../query/user-session";

export type AddDocumentParams = typeof documents.$inferInsert;
type AddDocumentHistoryParams = typeof documentsHistory.$inferInsert;

export type AddDocumentResponse = {
    id: string;
    cid: string;
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
            id: docId,
            createdAt: dateNow,
            updatedAt: dateNow,
            userId: useSession.id,
            ...params,
        });
        await addDocumentHistory({
            documentId: docId,
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

export { addDocument, addDocumentHistory };
