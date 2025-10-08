import { getAllDocuments } from "@/lib/actions";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { GetDocumentsParams } from "@/lib/actions/query/documents";
import { useState } from "react";
import { toast } from "sonner";

export interface UseGetDocumentsParams extends GetDocumentsParams {
    key: string[];
};

export type UseGetDocumentsReturnType = Awaited<ReturnType<typeof getAllDocuments>>;

export function useGetDocuments(params: UseGetDocumentsParams) {
    const [isMutating, setIsMutating] = useState<boolean>();
    const queryClient = useQueryClient();
    const queryKey = params.key;
    const [currentPaginate, setCurrentPaginate] = useState<UseGetDocumentsParams["paginate"]>({
        page: params.paginate?.page || 1,
        pageSize: params.paginate?.pageSize || 12
    });
    const [currentFilter, setCurrentFilter] = useState<UseGetDocumentsParams["filter"]>(params.filter);
    const [currentSort, setCurrentSort] = useState<UseGetDocumentsParams["sort"]>(params.sort);
    const [currentQuery, setCurrentQuery] = useState<UseGetDocumentsParams["query"]>(params.query);

    const documents = useQuery({
        queryKey,
        queryFn: () => getAllDocuments(params)
    })

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey });
    }

    const { mutate: mutateDocuments, isPending: setQueryPending } = useMutation({
        mutationFn: (queryParams: GetDocumentsParams) => getAllDocuments({ ...params, ...queryParams }),
        onMutate: () => {
            setIsMutating(true);
        },
        onSuccess: (data) => {
            queryClient.setQueryData(queryKey, data);
            setIsMutating(false);
        },
        onError: (error) => {
            console.log("Error setting filter/sort/paginate:", error);
            toast.error("Ada kesalahan saat mengatur data dokumen");
            setIsMutating(false);
        }
    })

    function setQuery(queryParams: GetDocumentsParams) {
        const { filter, sort, paginate } = queryParams;
        if (paginate?.page) {
            setCurrentPaginate(paginate);
        }
        if (filter) {
            setCurrentPaginate((prev) => ({ ...prev, page: 1 }));
            setCurrentFilter((prev) => ({
                ...prev,
                ...filter
            }));
        }
        if (sort) {
            setCurrentPaginate((prev) => ({ ...prev, page: 1 }));
            setCurrentSort((prev) => ({
                ...prev,
                ...sort
            }));
        }

        mutateDocuments(queryParams);
    }

    const totalPage = Math.ceil((documents.data?.totalCount || 0) / (params.paginate?.pageSize || 12));
    const isLoading = documents.isLoading || isMutating || setQueryPending;

    return { ...documents, queryKey, invalidate, setQuery, isLoading, isMutating, currentPaginate, currentFilter, currentSort, totalPage, currentQuery };
}