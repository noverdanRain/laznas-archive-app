import { NextResponse } from "next/server";
import { errorHandler500 } from "../helpers";
import { TypeOfDocumentTypes } from "@/types";
import db from "@/db";
import { documentTypes } from "@/db/schema";

// GET: Retrieve all document types
export async function GET() {
    try {
        const documentTypesList: TypeOfDocumentTypes[] = await db.select().from(documentTypes);
        return NextResponse.json(documentTypesList);
    } catch (error) {
        return errorHandler500(error);
    }
}