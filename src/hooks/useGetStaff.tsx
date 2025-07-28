import { getAllStaff } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";

export function useGetStaff() {
    const getStaffKey = ["get-all-staff"]
    const { data: staffs, ...others } = useQuery({
        queryKey: getStaffKey,
        queryFn: getAllStaff
    })

    return { staffs, ...others, getStaffKey }
}