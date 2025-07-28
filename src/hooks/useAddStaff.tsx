import { addStaff } from "@/lib/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CustomMutateHooksProps } from "@/types";
import { useGetStaff } from "./useGetStaff";

export function useAddStaff(props?: CustomMutateHooksProps) {
    const { onSuccess, onReject, onError } = props || {};

    const queryClient = useQueryClient();
    const { getStaffKey } = useGetStaff();

    const { ...data } = useMutation({
        mutationFn: addStaff,
        onSettled: (data) => {
            const { isSuccess, isRejected, reject } = data || {};
            if (isSuccess) {
                queryClient.invalidateQueries({ queryKey: getStaffKey })
                if (onSuccess) {
                    onSuccess?.()
                } else {
                    toast.success("Akun staff berhasil ditambahkan.");
                }
            } else if (isRejected) {
                if (onReject) {
                    onReject?.(reject?.message || "Ada kesalahan saat menambahkan staff, silakan coba lagi.");
                } else {
                    toast.error("Gagal Menambahkan Akun", {
                        description: reject?.message || "Ada kesalahan saat menambahkan staff, silakan coba lagi."
                    })
                }
            }
        },
        onError: (error) => {
            if (onError) {
                onError?.(error);
            } else {
                toast.error("Gagal Menambahkan Akun", {
                    description: error.message || "Ada kesalahan saat menambahkan staff, silakan coba lagi."
                });
            }
        },
    })

    return {
        ...data,
    };
}