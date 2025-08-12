"use client";

import { addDocument, getPinataPresignedUrl, isCidExsist } from "@/lib/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CustomMutateHooksProps } from "@/types";
import { useState } from "react";
import { FileWithPath } from "react-dropzone";
import { throwActionError } from "@/lib/actions/helpers";
import { AddDocumentResponse } from "@/lib/actions/mutation/documents";
import { pinata } from "@/lib/pinata-config";
import { UploadResponse } from "pinata";
import { MutateActionsReturnType } from "@/types";
import { lastAddedTabHome_queryKey } from "@/lib/constants";
import { documentsPage_useGetDocumentsKey } from "@/lib/constants";
import { randomUUID } from "crypto";
import { predictCID } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid"

export function useAddDocument(props?: CustomMutateHooksProps<AddDocumentResponse>) {
    const { onSuccess, onReject, onError, onMutate } = props || {};
    const queryClient = useQueryClient();

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
                queryClient.invalidateQueries({ queryKey: documentsPage_useGetDocumentsKey });
                queryClient.invalidateQueries({ queryKey: lastAddedTabHome_queryKey });
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
                    onReject({
                        message: reject?.message || "Ada kesalahan saat menambahkan dokumen, silakan coba lagi.",
                        data,
                    });
                } else {
                    toast.error(`${reject?.message || "Ada kesalahan saat menambahkan dokumen, silakan coba lagi."}`);
                }
            }
        },
        onError: (error) => {
            setIsSubmitting(false);
            console.log("Error in useAddDocument:", error);
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

    async function mutate(params: AddDocMutateParams): Promise<MutateActionsReturnType & { data?: AddDocumentResponse }> {
        setProgress({ value: 0, message: "Sedang mengunggah dokumen..." });
        const docId = uuidv4();
        try {
            setIsSubmitting(true);

            setProgress({ value: 10, message: "Mempersiapkan dokumen untuk diunggah..." });
            const cid = await predictCID(params.file);
            if (!cid) {
                setIsSubmitting(false);
                throw new Error("Gagal memprediksi CID dari file.");
            }
            const fileExists = await isCidExsist(cid);
            if (fileExists) {
                setIsSubmitting(false);
                return {
                    isRejected: true,
                    reject: {
                        message: "File sudah pernah disimpan sebelumnya, silakan gunakan file lain.",
                    },
                    data: { cid, id: "" },
                }
            }

            setProgress({ value: 30, message: "Mendapatkan informasi untuk mengunggah dokumen..." });
            const presignedUrl = await getPinataPresignedUrl({
                fileName: docId,
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
                id: docId,
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
            setIsSubmitting(false);
            console.log("Error in useAddDocument mutate:", error);
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
