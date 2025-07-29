import { pinataUpload } from "@/lib/actions/pinataUpload";
import { useMutation } from "@tanstack/react-query";
import { CustomMutateHooksProps } from "@/types";
import { UploadResponse } from "pinata";
import { toast } from "sonner";

export function usePinataUpload(cb?: CustomMutateHooksProps<UploadResponse>) {
    const { onSuccess, onReject, onError, onMutate } = cb || {};

    const { data: mutateResponse, ...others } = useMutation({
        mutationFn: pinataUpload,
        onMutate: (params) => {
            if (onMutate) {
                onMutate(params);
            }
        },
        onSettled: (res) => {
            const { isSuccess, isRejected, reject, data } = res || {};
            if (isSuccess) {
                if (onSuccess) {
                    onSuccess(data);
                }
            } else if (isRejected) {
                if (onReject) {
                    onReject(reject?.message || "Ada kesalahan saat menambahkan direktori, silakan coba lagi.");
                } else {
                    toast.error(reject?.message || "Ada kesalahan saat menambahkan direktori, silakan coba lagi.");
                }
            }
        },
        onError: (error) => {
            if (onError) {
                onError?.(error);
            } else {
                toast.error(`Terjadi kesalahan saat mengunggah dokumen ke IPFS, silakan coba lagi.`);
            }
        },
    })

    const res = mutateResponse?.data

    return {
        res,
        ...others
    };
}