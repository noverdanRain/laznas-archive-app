import { NextRequest, NextResponse } from "next/server";
import { pinata } from "@/lib/pinata-config"; // Import the Pinata SDK instance
import { errorHandler500 } from "../../helpers";
import { isJwtValid } from "@/lib/jwt";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        const isTokenValid = await isJwtValid(token);
        if (!token || !isTokenValid) {
            return new Response("Unauthorized", { status: 401 });
        }
        const name = req.nextUrl.searchParams.get("name")
        const visibility = req.nextUrl.searchParams.get("visibility");
        let url;

        if (visibility === "public") {
            url = await pinata.upload.public.createSignedURL({
                expires: 600, // URL expiration time in seconds
                name: name || undefined,
            });
        } else {
            url = await pinata.upload.private.createSignedURL({
                expires: 600, // URL expiration time in seconds
                name: name || undefined,
            });
        }
        return NextResponse.json({ url: url }, { status: 200 }); // Returns the signed upload URL
    } catch (error) {
        console.error("Error creating signed URL:", error);
        return errorHandler500(error);
    }
}
