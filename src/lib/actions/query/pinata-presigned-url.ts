import { pinata } from "@/lib/pinata-config";
import { throwActionError } from "../helpers";

type PinataPresignedUrlParams = {
    fileName: string;
    isPrivate?: boolean;
};

async function getPinataPresignedUrl(params: PinataPresignedUrlParams) {
    const { fileName, isPrivate } = params;
    try {
        let url: string;

        if (isPrivate) {
            url = await pinata.upload.private.createSignedURL({
                expires: 600,
                name: fileName,
            });
        } else {
            url = await pinata.upload.public.createSignedURL({
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