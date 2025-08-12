import { editDirectory } from "@/lib/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomMutateHooksProps } from "@/types";
import { toast } from "sonner";

export default function useEditDirectory(props?: CustomMutateHooksProps) {
    const queryClient = useQueryClient();
    const { onSuccess, onReject, onError, } = props || {};

    const mutate = useMutation({
        mutationFn: editDirectory,
        onSettled: (res) => {
            const { isSuccess, isRejected, reject } = res || {};
            if (isSuccess) {
                queryClient.invalidateQueries({ queryKey: ["get-directories"] });
                if (onSuccess) {
                    onSuccess();
                } else {
                    toast.success("Direktori berhasil diedit.");
                }
            } else if (isRejected) {
                if (onReject) {
                    onReject(reject?.message || "Ada kesalahan saat mengedit direktori, silakan coba lagi.");
                } else {
                    toast.error(`${reject?.message || "Ada kesalahan saat mengedit direktori, silakan coba lagi."}`);
                }
            }
        },
        onError: (error) => {
            if (onError) {
                onError(error);
            }else {
                toast.error(error.message || "Ada kesalahan saat mengedit direktori, silakan coba lagi.");
            }
        }
    })

    return mutate
}