"use client";

import { addDocument, getPinataPresignedUrl } from "@/lib/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CustomMutateHooksProps } from "@/types";
import { useState } from "react";
import { FileWithPath } from "react-dropzone";
import { throwActionError } from "@/lib/actions/helpers";
import { editDocumentById } from "@/lib/actions";
import { pinata } from "@/lib/pinata-config";
import { UploadResponse } from "pinata";
import { MutateActionsReturnType } from "@/types";
import { lastAddedTabHome_queryKey } from "@/lib/constants";
import getFileExt from "@/lib/utils";
import { documentsPage_useGetDocumentsKey } from "@/lib/constants";

export function useEditDocument(props?: CustomMutateHooksProps) {
    const { onSuccess, onReject, onError, onMutate } = props || {};
    const queryClient = useQueryClient();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [progress, setProgress] = useState({
        value: 0,
        message: "Mohon tunggu, sedang memproses dokumen...",
    });

    const editDocMutate = useMutation({
        mutationFn: mutate,
        onMutate: (params) => {
            if (onMutate) {
                onMutate(params);
            }
        },
        onSettled: (res) => {
            const { isSuccess, isRejected, reject} = res || {};
            if (isSuccess) {
                setIsSubmitting(true);
                setProgress({ value: 100, message: "Dokumen berhasil diedit." });
                queryClient.invalidateQueries({ queryKey: documentsPage_useGetDocumentsKey });
                queryClient.invalidateQueries({ queryKey: lastAddedTabHome_queryKey });
                if (onSuccess) {
                    onSuccess();
                } else {
                    toast.success("Dokumen berhasil diedit.", {
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
            setIsSubmitting(false);
            if (onError) {
                onError(error);
            } else {
                toast.error("Terjadi kesalahan saat menambahkan dokumen, silakan coba lagi.");
            }
        },
    });

    type EditDocMutateParams = {
        documentId: string;
        data: {
            documentNum?: string;
            documentTypeId?: string;
            directoryId?: string;
            title?: string;
            description?: string;
            file?: File | FileWithPath | null;
            isPrivate?: boolean;
        };
    }

    async function mutate(params: EditDocMutateParams) {
        const { documentId, data } = params;
        setProgress({ value: 10, message: "Sedang mengunggah dokumen..." });
        let ipfsUploadRes: Awaited<ReturnType<typeof pinataUpload>> | undefined;
        try {
            setIsSubmitting(true);
            setProgress({ value: 20, message: "Mendapatkan informasi untuk mengunggah dokumen..." });
            if (data.file) {
                const presignedUrl = await getPinataPresignedUrl({
                    fileName: data.title || "document",
                    isPrivate: data.isPrivate,
                });
                setProgress({ value: 50, message: "Mengunggah dokumen ke IPFS..." });
                ipfsUploadRes = await pinataUpload({
                    file: data.file,
                    presignedUrl,
                    isPrivate: data.isPrivate,
                })
            }
            setProgress({ value: 70, message: "Menyimpan dokumen ke database..." });
            const editDocResponse = await editDocumentById({
                documentId,
                data: {
                    ...data,
                    cid: ipfsUploadRes?.data.cid || undefined,
                    fileExt: ipfsUploadRes?.data.cid ? getFileExt(data.file?.name || "") : undefined,
                }
            })
            setIsSubmitting(false);
            return editDocResponse;
        } catch (error) {
            setIsSubmitting(false);
            console.log("Error in useEditDocument mutate:", error);
            throwActionError(error);
        }
    }

    const isLoading = isSubmitting || editDocMutate.isPending;

    return {
        ...editDocMutate,
        progress,
        isLoading,
    };
}

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
