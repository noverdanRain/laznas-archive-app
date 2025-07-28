import { pinata } from "@/lib/pinata-config";
import { throwActionError } from "../helpers";

export type PinataPresignedUrlParams = {
    fileName: string;
    visibility: "public" | "private";
};

async function getPinataPresignedUrl(params: PinataPresignedUrlParams) {
    const { fileName, visibility } = params;
    try {
        let url: string;

        if (visibility === "public") {
            url = await pinata.upload.public.createSignedURL({
                expires: 600,
                name: fileName,
            });
        } else {
            url = await pinata.upload.private.createSignedURL({
                expires: 600,
                name: fileName,
            });
        }

        return url;
    } catch (error) {
        console.error("Error creating Pinata presigned URL:", error);
        throwActionError(error);
    }
}

export { getPinataPresignedUrl };