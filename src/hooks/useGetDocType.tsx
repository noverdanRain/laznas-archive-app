import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDocumentTypes } from "@/lib/actions";

export function useGetDocType() {
    const queryClient = useQueryClient();
    const queryKey = ["get-document-types"];

    const query = useQuery({
        queryKey,
        queryFn: getDocumentTypes,
    })

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey });
    };
    return { ...query, invalidate, queryKey };
}
