import { pinata } from "@/lib/pinata-config";
import { FileWithPath } from "react-dropzone";
import { throwActionError } from "./helpers";
import { UploadResponse } from "pinata";
import { MutateActionsReturnType } from "@/types";

type PinataUploadParams = {
    file: File | FileWithPath;
    presignedUrl: string;
    isPrivate?: boolean;
};

async function pinataUpload(
    params: PinataUploadParams
): Promise<MutateActionsReturnType & { data: UploadResponse }> {
    const { file, presignedUrl, isPrivate } = params;
    try {
        if (isPrivate) {
            const privateUpload = await pinata.upload.private
                .file(file)
                .url(presignedUrl);
            return {
                isSuccess: true,
                data: privateUpload,
            };
        } else {
            const publicUpload = await pinata.upload.public
                .file(file)
                .url(presignedUrl);
            return {
                isSuccess: true,
                data: publicUpload,
            };
        }
    } catch (error) {
        console.log("Error uploading to Pinata:", error);
        throwActionError(error);
    }
}

export { pinataUpload };
