import { getDirectories } from "@/lib/actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IGetDirectoriesParams } from "@/lib/actions/query/directories";

export function useGetDirectories(params?: IGetDirectoriesParams & {key?: string[]}) {
    const queryKey = params?.key || ['get-directories'];
    const queryClient = useQueryClient();

    const { data: directories, ...query } = useQuery({
        queryKey,
        queryFn: () => getDirectories(params),
    })

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey });
    }

    return { directories, ...query, queryKey, invalidate };
}