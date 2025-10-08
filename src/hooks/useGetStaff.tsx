import { getAllStaff } from "@/lib/actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetStaff() {
    const getStaffKey = ["get-all-staff"]
    const { data: staffs, ...others } = useQuery({
        queryKey: getStaffKey,
        queryFn: getAllStaff
    })

    const queryClient = useQueryClient();
    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: getStaffKey });
    }

    return { staffs, ...others, getStaffKey, invalidate }
}