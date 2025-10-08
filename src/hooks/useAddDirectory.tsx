import { addDirectory } from "@/lib/actions";
import { useMutation } from "@tanstack/react-query";
import { CustomMutateHooksProps } from "@/types";
import { toast } from "sonner";
import { useGetDirectories } from "./useGetDirectories";

export function useAddDirectory(props?: CustomMutateHooksProps) {
    const { onSuccess, onReject, onError } = props || {};
    const toastId = "add-directory";

    const { invalidate } = useGetDirectories()

    const mutation = useMutation({
        mutationFn: addDirectory,
        onMutate: () => {
            toast.loading("Sedang menambahkan direktori...", { id: toastId });
        },
        onSettled: (data) => {
            const { isSuccess, isRejected, reject } = data || {};
            if (isSuccess) {
                toast.success("Direktori berhasil ditambahkan.", { id: toastId });
                invalidate();
                if (onSuccess) {
                    onSuccess?.();
                }
            } else if (isRejected) {
                toast.error(reject?.message || "Gagal menambahkan direktori.", { id: toastId });
                if (onReject) {
                    onReject?.(reject?.message || "Ada kesalahan saat menambahkan direktori, silakan coba lagi.");
                }
            }
        },
        onError: (error) => {
            toast.error("Terjadi kesalahan saat menambahkan direktori, silakan coba lagi.", { id: toastId });
            if (onError) {
                onError?.(error);
            }
        },
    })

    return {
        ...mutation,
    };
}