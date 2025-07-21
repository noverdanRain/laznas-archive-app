'use client';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { queryKey } from "@/constants";
import { TypeOfDocumentTypes } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function SelectDocType({ ...props }: React.ComponentProps<typeof Select>) {

    const getDocType = useQuery({
        queryKey: [queryKey.GET_ALL_DOCUMENT_TYPES],
        queryFn: () => axios.get<TypeOfDocumentTypes[]>("/api/document-types").then(res => res.data),
    })

    return (
        <Select {...props} >
            <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Pilih Jenis Dokumen" />
            </SelectTrigger>
            <SelectContent>
                {
                    getDocType.isLoading && (
                        <p className="text-sm p-2">Memuat ...</p>
                    )
                }
                {
                    getDocType.isError && (
                        <p className="text-sm p-2">Error saat mengambil data.</p>
                    )
                }
                <SelectGroup>
                    {
                        getDocType.data?.map((docType) => (
                            <SelectItem key={docType.id} value={docType.id}>
                                {docType.name}
                            </SelectItem>
                        ))
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}