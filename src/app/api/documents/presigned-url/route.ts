import { NextRequest, NextResponse } from "next/server";
import { pinata } from "@/lib/pinata-config"; // Import the Pinata SDK instance
import { errorHandler500 } from "../../helpers";
import { isJwtValid } from "@/lib/jwt";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        const isTokenValid = isJwtValid(token);
        if (!token || !isTokenValid) {
            return new Response("Unauthorized", { status: 401 });
        }
        const name = req.nextUrl.searchParams.get("name")
        const url = await pinata.upload.public.createSignedURL({
            expires: 600, 
            name: name || undefined,
        });
        return NextResponse.json({ url: url }, { status: 200 }); // Returns the signed upload URL
    } catch (error) {
        console.error("Error creating signed URL:", error);
        return errorHandler500(error);
    }
}
