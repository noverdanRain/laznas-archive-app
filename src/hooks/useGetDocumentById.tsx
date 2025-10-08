import { useQuery } from "@tanstack/react-query";
import { getDocumentById } from "@/lib/actions";

export function useGetDocumentById({ id,  }: { id: string; }) {

    const data = useQuery({
        queryKey: ["document", id],
        queryFn: () => getDocumentById({ id }),
    });
    return data;
}