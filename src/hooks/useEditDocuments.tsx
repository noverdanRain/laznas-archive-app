"use client";

import { getPinataPresignedUrl, makeFilePrivate, makeFilePublic, pinataPrivateFile, pinataPublicFile } from "@/lib/actions";
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
import getFileExt, { predictCID } from "@/lib/utils";
import { documentsPage_useGetDocumentsKey } from "@/lib/constants";
import { isCidExsist } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
type EditDocMutateParams = {
    documentId: string;
    cid: string;
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

type PinataUploadParams = {
    file: File | FileWithPath;
    presignedUrl: string;
    isPrivate?: boolean;
};

export function useEditDocument(props?: CustomMutateHooksProps) {
    const { onSuccess, onReject, onError, onMutate } = props || {};
    const queryClient = useQueryClient();
    const router = useRouter();

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
            const { isSuccess, isRejected, reject, data } = res || {};
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
                    onReject({
                        message: reject?.message || "Ada kesalahan saat mengedit dokumen, silakan coba lagi.",
                        data: data,
                    });
                } else {
                    toast.error(reject?.message || "Ada kesalahan saat menambahkan staff, silakan coba lagi.")
                }
            }
        },
        onError: (error) => {
            setIsSubmitting(false);
            if (onError) {
                onError(error);
            } else {
                toast.error("Terjadi kesalahan saat memperbarui dokumen, silakan coba lagi.");
            }
        },
    });



    async function mutate(params: EditDocMutateParams): Promise<MutateActionsReturnType & { data?: any }> {
        const { documentId, data, cid } = params;
        let ipfsUploadRes: Awaited<ReturnType<typeof pinataUpload>> | undefined;
        try {
            setIsSubmitting(true);
            if (data.file) {
                setProgress({ value: 10, message: "Mempersiapkan dokumen untuk diunggah..." });
                const cid = await predictCID(data.file);
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
                        data: {
                            cid
                        }
                    }
                }

                setProgress({ value: 30, message: "Mendapatkan informasi untuk mengunggah dokumen..." });
                const presignedUrl = await getPinataPresignedUrl({
                    fileName: documentId,
                    isPrivate: data.isPrivate,
                });
                setProgress({ value: 50, message: "Mengunggah dokumen ke IPFS..." });
                ipfsUploadRes = await pinataUpload({
                    file: data.file,
                    presignedUrl,
                    isPrivate: data.isPrivate,
                })
            }
            if (!data.file && data.isPrivate !== undefined) {
                setProgress({ value: 30, message: "Mengubah visibilitas file di IPFS" });
                if (data.isPrivate == true) {
                    const { url, id } = await pinataPublicFile(cid)
                    await makeFilePrivate({ docId: documentId, id, url })
                }
                if (data.isPrivate == false) {
                    const { url, id } = await pinataPrivateFile(cid)
                    await makeFilePublic({ docId: documentId, id, url })
                }
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
