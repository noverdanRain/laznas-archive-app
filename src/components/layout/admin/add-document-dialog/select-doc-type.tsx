'use client';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetDocType } from "@/hooks/useGetDocType";

export default function SelectDocType({ ...props }: React.ComponentProps<typeof Select>) {

    const { data: documentType, isLoading, isError } = useGetDocType();

    return (
        <Select {...props} >
            <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Pilih Jenis Dokumen" />
            </SelectTrigger>
            <SelectContent>
                {
                    isLoading && (
                        <p className="text-sm p-2">Memuat ...</p>
                    )
                }
                {
                    isError && (
                        <p className="text-sm p-2">Error saat mengambil data.</p>
                    )
                }
                <SelectGroup>
                    {
                        documentType?.map((docType) => (
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