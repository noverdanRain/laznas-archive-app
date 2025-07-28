import { getTotalDocsInDirectory } from "@/lib/actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";


export function useGetDocsCountInDirectory(directoryId: string) {
    const queryKey = [`get-docs-count-${directoryId}`];

    const { ...query } = useQuery({
        queryKey,
        queryFn: () => getTotalDocsInDirectory(directoryId),
    });

    const queryClient = useQueryClient();
    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey });
    };

    return { ...query, queryKey, invalidate };
}