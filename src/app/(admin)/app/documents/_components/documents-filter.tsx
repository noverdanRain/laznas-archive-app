'use client';

import SelectClearable from "@/components/common/select-clearable";
import { useGetDivisions } from "@/hooks/useGetDivisions";
import { useGetDocType } from "@/hooks/useGetDocType";
import { useEffect, useState } from "react";
import { GetDocumentsParams } from "@/lib/actions/query/documents";
import { useGetDocuments } from "@/hooks/useGetDocuments";
import { documentsPage_useGetDocumentsParams } from "../page";
import { useTopLoader } from "nextjs-toploader";

type FilterT = GetDocumentsParams["filter"];
type FilterKeyT = keyof NonNullable<GetDocumentsParams["filter"]>;

export function DocumentsFilter() {
    const [filter, setFilter] = useState<FilterT>();
    const topLoader = useTopLoader();

    const documentType = useGetDocType();
    const divisions = useGetDivisions();
    const documents = useGetDocuments(documentsPage_useGetDocumentsParams);

    useEffect(() => {
        if (documents.isLoading) {
            topLoader.start();
        } else {
            topLoader.done();
        }
    }, [documents.isLoading]);

    const handleFilterChange = (name: FilterKeyT, value: string) => {
        setFilter((prev) => {
            return { ...prev, [name]: value ? value : undefined };
        });
        documents.setQuery({
            filter: { ...filter, [name]: value ? value : undefined },
            paginate: { page: 1, pageSize: documents.currentPaginate?.pageSize }
        });
    };

    return (
        <div className="flex items-center gap-2">
            <SelectClearable
                items={documentType.data?.map((type) => ({
                    value: type.id,
                    label: type.name,
                }))}
                placeholder="Jenis Dokumen"
                onValueChange={(value) => handleFilterChange("documentType", value)}
            />
            <SelectClearable
                items={divisions.data?.map((division) => ({
                    value: division.id,
                    label: `Div. ${division.name}`,
                }))}
                placeholder="Ditambahkan Oleh"
                onValueChange={(value) => handleFilterChange("addedByDivision", value)}
            />
            <SelectClearable
                items={[
                    { value: "public", label: "Public" },
                    { value: "private", label: "Private" },
                ]}
                placeholder="Visibilitas"
                onValueChange={(value) => handleFilterChange("visibility", value)}
            />
            {/* <Button variant={"ghost"}>Hapus Filter</Button> */}
        </div>
    )
}