import { disableStaff, enableStaff } from "@/lib/actions";
import { CustomMutateHooksProps } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGetStaff } from "./useGetStaff";

export function useEditStaffStatus(props: CustomMutateHooksProps & { setStatus: "enable" | "disable" }) {
    const { onSuccess, onReject, onError, setStatus } = props || {};
    const setStatusFn = setStatus === "enable" ? enableStaff : disableStaff;
    const toastId = "mutate-status-staff";

    const queryClient = useQueryClient();
    const { getStaffKey } = useGetStaff();

    const { ...data } = useMutation({
        mutationFn: setStatusFn,
        onMutate: () => {
            toast.loading(`Sedang ${setStatus} akun...`, { id: toastId });
        },
        onSettled: (data) => {
            const { isSuccess, isRejected, reject } = data || {};
            if (isSuccess) {
                queryClient.invalidateQueries({ queryKey: getStaffKey })
                if (onSuccess) {
                    onSuccess?.()
                } else {
                    toast.success(`Berhasil '${setStatus}' akun`, {
                        id: toastId
                    });
                }
            } else if (isRejected) {
                if (onReject) {
                    onReject?.(reject?.message || `Ada kesalahan saat melakukan '${setStatus}' staff, silakan coba lagi.`);
                } else {
                    toast.error(`Gagal melakukan '${setStatus}' akun`, {
                        id: toastId,
                        description: reject?.message || `Ada kesalahan saat melakukan '${setStatus}' staff, silakan coba lagi.`
                    })
                }
            }
        },
        onError: (error) => {
            if (onError) {
                onError?.(error);
            } else {
                toast.error(`Gagal melakukan ${setStatus} akun`, {
                    id: toastId,
                    description: error.message || `Ada kesalahan saat melakukan ${setStatus} staff, silakan coba lagi.`
                });
            }
        },
    })
    return { ...data }
}