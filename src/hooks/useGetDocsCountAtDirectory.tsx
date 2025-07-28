import { getTotalDocsInDirectory } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";


export function useGetDocsCountInDirectory(directoryId: string) {
    const queryKey = [`get-docs-count-${directoryId}`];

    const { ...query } = useQuery({
        queryKey,
        queryFn: () => getTotalDocsInDirectory(directoryId),
    });

    return { ...query, queryKey };
}