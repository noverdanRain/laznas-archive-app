import { pinata } from "@/lib/pinata-config";
import { NextRequest, NextResponse } from "next/server";
import { errorHandler500 } from "../helpers";

export async function GET(req: NextRequest) {
    return new Response("This is a GET request for documents");
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file: File | null = formData.get("file") as unknown as File;

        if (!file) {
            return new Response("File not found", { status: 400 });
        }

        const upload = (await pinata.upload.public.file(file).name(`Hajimimas Tehek`));

        return NextResponse.json(upload, {
            status: 200,
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        return errorHandler500(error);
    }
}
