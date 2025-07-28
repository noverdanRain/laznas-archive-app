import { useMutation } from "@tanstack/react-query";
import { CustomMutateHooksProps } from "@/types";
import { createUserSession } from "@/lib/actions";
import { toast } from "sonner";

export function useLogin(props?: CustomMutateHooksProps) {
    const { onSuccess, onReject, onError } = props || {};

    const { ...mutation } = useMutation({
        mutationFn: createUserSession,
        onSettled: (data) => {
            const { isSuccess, isRejected, reject } = data || {};
            if (isSuccess) {
                if (onSuccess) {
                    onSuccess?.();
                } else {
                    toast.success("Login berhasil");
                }
            } else if (isRejected) {
                if (onReject) {
                    onReject?.(reject?.message || "Login gagal, silakan coba lagi.");
                } else {
                    toast.error("Login Gagal", {
                        description: reject?.message || "Ada masalah ketika login, silakan coba lagi."
                    });
                }
            }
        },
        onError: (error) => {
            if (onError) {
                onError?.(error);
            } else {
                toast.error("Login Gagal", {
                    description: error.message || "Ada masalah ketika login, silakan coba lagi."
                });
            }
        },
    })

    return {
        ...mutation,
        login: mutation.mutate,
    };
}
