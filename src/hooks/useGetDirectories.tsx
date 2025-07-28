import { getDirectories } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { IGetDirectoriesParams } from "@/lib/actions/query/directories";

export function useGetDirectories(params?: IGetDirectoriesParams) {
    const queryKey = ['get-directories'];

    const { data: directories, ...query } = useQuery({
        queryKey,
        queryFn: () => getDirectories(params),
    })

    return { directories, ...query, queryKey };
}