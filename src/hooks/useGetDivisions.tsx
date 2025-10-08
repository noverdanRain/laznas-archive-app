import { getDivisions } from "@/lib/actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetDivisions() {
    const queryKey = ["get-all-divisions"];
    const divisions = useQuery({
        queryKey,
        queryFn: getDivisions,
    })

    const queryClient = useQueryClient();
    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey });
    };

    return { ...divisions, queryKey, invalidate };
}
