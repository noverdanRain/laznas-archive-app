import { getAllDocuments } from "@/lib/actions";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { GetDocumentsParams } from "@/lib/actions/query/documents";
import { useState } from "react";
import { toast } from "sonner";

export function useGetDocuments(params: GetDocumentsParams & { key: string[] }) {
    const [isMutating, setIsMutating] = useState(false);
    const queryClient = useQueryClient();
    const queryKey = params.key;
    const documents = useQuery({
        queryKey,
        queryFn: () => getAllDocuments(params)
    })

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey });
    }

    const { mutate: setQuery } = useMutation({
        mutationFn: (queryParams: GetDocumentsParams) => getAllDocuments({ ...params, ...queryParams }),
        onMutate: () => {
            setIsMutating(true);
        },
        onSuccess: (data) => {
            queryClient.setQueryData(queryKey, data);
            setIsMutating(false);
        },
        onError: (error) => {
            console.log("Error setting filter:", error);
            toast.error("Gagal mengatur filter dokumen, silakan coba lagi.");
            setIsMutating(false);
        }
    })

    const isLoading = documents.isLoading || isMutating;

    return { ...documents, queryKey, invalidate, setQuery, isLoading }
}