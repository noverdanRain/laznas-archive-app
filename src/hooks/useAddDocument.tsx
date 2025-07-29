"use client";

import { addDocument, getPinataPresignedUrl } from "@/lib/actions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CustomMutateHooksProps } from "@/types";
import { useState } from "react";
import { FileWithPath } from "react-dropzone";
import { throwActionError } from "@/lib/actions/helpers";
import { AddDocumentResponse } from "@/lib/actions/mutation/documents";

export function useAddDocument(props?: CustomMutateHooksProps<AddDocumentResponse>) {
    const { onSuccess, onReject, onError, onMutate } = props || {};

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [progress, setProgress] = useState({
        value: 0,
        message: "Mohon tunggu, sedang memproses dokumen...",
    });

    const addDocMutate = useMutation({
        mutationFn: mutate,
        onMutate: (params) => {
            if (onMutate) {
                onMutate(params);
            }
        },
        onSettled: (res) => {
            const { isSuccess, isRejected, reject, data } = res || {};
            if (isSuccess) {
                setIsSubmitting(true);
                setProgress({ value: 100, message: "Dokumen berhasil ditambahkan." });
                if (onSuccess) {
                    onSuccess(data);
                } else {
                    toast.success("Dokumen berhasil ditambahkan.", {
                        description: `Dokumen telah berhasil ditambahkan.`,
                        duration: 3000,
                    });
                }
                setTimeout(() => {
                    setIsSubmitting(false);
                }, 600);
            } else if (isRejected) {
                if (onReject) {
                    onReject(reject?.message || "Ada kesalahan saat menambahkan staff, silakan coba lagi.");
                } else {
                    toast.error(`${reject?.message || "Ada kesalahan saat menambahkan staff, silakan coba lagi."}`);
                }
            }
        },
        onError: (error) => {
            if (onError) {
                onError(error);
            } else {
                toast.error("Terjadi kesalahan saat menambahkan dokumen, silakan coba lagi.");
            }
        },
    });

    type AddDocMutateParams = {
        file: File | FileWithPath;
        directoryId: string,
        documentTypeId: string,
        title: string,
        description: string | null,
        fileExt: string,
        documentNum: string | null,
        isPrivate: boolean,
    }

    async function mutate(params: AddDocMutateParams) {
        setProgress({ value: 0, message: "Sedang mengunggah dokumen..." });
        try {
            setIsSubmitting(true);
            setProgress({ value: 20, message: "Mendapatkan informasi untuk mengunggah dokumen..." });
            const presignedUrl = await getPinataPresignedUrl({
                fileName: params.title,
                isPrivate: params.isPrivate,
            });
            setProgress({ value: 50, message: "Mengunggah dokumen ke IPFS..." });
            const IpfsUploadRes = await pinataUpload({
                file: params.file,
                presignedUrl,
                isPrivate: params.isPrivate,
            })
            setProgress({ value: 75, message: "Menyimpan dokumen ke database..." });
            const addDocResponse = await addDocument({
                cid: IpfsUploadRes.data.cid,
                directoryId: params.directoryId,
                documentTypeId: params.documentTypeId,
                title: params.title,
                description: params.description,
                fileExt: params.fileExt,
                documentNum: params.documentNum,
                isPrivate: params.isPrivate,
            })
            setIsSubmitting(false);
            return addDocResponse;
        } catch (error) {
            console.error("Error in useAddDocument mutate:", error);
            throwActionError(error);
        }
    }

    const isLoading = isSubmitting || addDocMutate.isPending;

    return {
        ...addDocMutate,
        progress,
        isLoading,
    };
}

import { pinata } from "@/lib/pinata-config";
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
