import { NextRequest, NextResponse } from "next/server";
import { errorHandler500, notOkResponse } from "../helpers";
import { isJwtValid, verifyJwt } from "@/lib/jwt";
import db from "@/lib/db";
import { documents } from "@/lib/db/schema";
import { randomUUID } from "crypto";

export type AddDocumentInputData = {
    cid: string;
    directoryId: string;
    title: string;
    description?: string;
    documentTypeId: string;
    documentNum?: string | null;
    visibility: "public" | "private";
    fileExt: string;
};

function validateAddDocumentInputData(data: any): data is AddDocumentInputData {
    if (!data || typeof data !== "object") {
        return false;
    }

    const requiredFields = [
        "cid",
        "directoryId",
        "title",
        "documentTypeId",
        "visibility",
        "fileExt",
    ];

    // Check if all required properties exist
    for (const field of requiredFields) {
        if (!(field in data)) {
            return false;
        }
    }

    // Check if all string fields are not empty
    const stringFields = [
        "cid",
        "directoryId",
        "title",
        "documentTypeId",
        "fileExt",
    ];
    for (const field of stringFields) {
        if (typeof data[field] !== "string" || data[field].trim() === "") {
            return false;
        }
    }

    // Check visibility field
    if (data.visibility !== "public" && data.visibility !== "private") {
        return false;
    }

    return true;
}

export async function GET(req: NextRequest) {
    return new Response("This is a GET request for documents");
}

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        const isTokenValid = await isJwtValid(token);
        if (!token || !isTokenValid) {
            return new Response("Unauthorized", { status: 401 });
        }
        const user = await verifyJwt(token);

        const data: AddDocumentInputData = await req.json();
        if (!validateAddDocumentInputData(data)) {
            return notOkResponse(
                "Bad Request",
                "Invalid input data for document",
                400
            );
        }

        const docId = randomUUID() as string;
        const newDocument: typeof documents.$inferInsert = {
            id: docId,
            cid: data.cid,
            directoryId: data.directoryId,
            title: data.title,
            description: !data.description ? null : data.description,
            documentTypeId: data.documentTypeId,
            documentNum: !data.documentNum ? null : data.documentNum,
            isPrivate: data.visibility === "private",
            userId: user.id,
            fileExt: data.fileExt,
        };

        const hasil = await db.insert(documents).values(newDocument);

        console.log("Hasil insert dokumen:", hasil);
        return NextResponse.json(
            { 
                message: "Document created successfully", 
                documentId: docId
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error uploading file:", error);
        return errorHandler500(error);
    }
}
