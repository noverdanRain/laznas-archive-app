import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDocumentHistories } from "@/lib/actions";

type Params = {
    docId: string;
}
export function useGetDocHistories(params: Params) {
    const queryClient = useQueryClient();
    const queryKey = ["histories", params.docId];

    const query = useQuery({
        queryKey,
        queryFn: () => getDocumentHistories({ documentId: params.docId }),
    })

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey });
    };
    return { ...query, invalidate, queryKey };
}
