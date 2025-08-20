"use client"

import { getDirectories } from "@/lib/actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IGetDirectoriesParams } from "@/lib/actions/query/directories";
import { useState } from "react";

export function useGetDirectories(params?: IGetDirectoriesParams & { key?: string[] }) {
    const queryKey = ['get-directories', ...(params?.key || [])];
    const queryClient = useQueryClient();
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const { data: directories, ...query } = useQuery({
        queryKey,
        queryFn: () => getDirectories(params),
    })

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey });
    }

    const setFilter = async (filter: IGetDirectoriesParams['filter']) => {
        try {
            setIsUpdating(true);
            const data = await getDirectories({ ...params, filter });
            queryClient.setQueryData(queryKey, data);
            setIsUpdating(false);
        }catch (error) {
            console.error("Error setting filter:", error);
            setIsUpdating(false);
        }
    }

    return { directories, ...query, queryKey, invalidate, setFilter, isUpdating };
}