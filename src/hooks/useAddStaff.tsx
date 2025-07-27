import { addStaff } from "@/lib/actions/staff";
import { useMutation } from "@tanstack/react-query";
import { type IAddStaffParams } from "@/lib/actions/staff";
import { toast } from "sonner";
import { CustomMutateHooksProps } from "@/types";

export function useAddStaff(props?: CustomMutateHooksProps) {
    const { onSuccess, onReject, onError } = props || {};

    const { ...data } = useMutation({
        mutationFn: addStaff,
        onSettled: (data) => {
            const { isSuccess, isRejected, reject } = data || {};
            if (isSuccess) {
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
            onError?.(error);
        },
    })

    return {
        ...data,
    };
}