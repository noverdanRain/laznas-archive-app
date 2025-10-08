import { getDirectoryById } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";

export function useGetDirectoryById({ id, queryKey }: { id: string, queryKey?: string[] }) {
    const directory = useQuery({
        queryKey: queryKey || ["directory", id],
        queryFn: () => getDirectoryById({ id }),
    })

    return { ...directory }
}