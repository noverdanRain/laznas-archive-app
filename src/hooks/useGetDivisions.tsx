import { getDivisions } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";

export function useGetDivisions() {
    const queryKey = ["get-all-divisions"];
    const { data: divisions, ...others } = useQuery({
        queryKey,
        queryFn: getDivisions,
    })
    return { divisions, ...others, queryKey };
}
