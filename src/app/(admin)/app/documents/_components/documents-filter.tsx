'use client';

import SelectClearable from "@/components/common/select-clearable";
import { Button } from "@/components/ui/button";
import { queryKey } from "@/constants";
import { DivisionTypes, TypeOfDocumentTypes } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export type DocumentsFilterType = {
    type: string;
    addedBy: string;
    visibility: string;
}

export function DocumentsFilter() {
    const [filter, setFilter] = useState<DocumentsFilterType>();

    const documentType = useQuery({
        queryKey: [queryKey.GET_ALL_DOCUMENT_TYPES],
        queryFn: () => axios.get<TypeOfDocumentTypes[]>("/api/document-types").then(res => res.data),
    })
    const divisions = useQuery({
        queryKey: [queryKey.GET_ALL_DIVISION],
        queryFn: () => axios.get<DivisionTypes[]>("/api/divisions").then(res => res.data),
    });

    const handleFilterChange = (name: keyof DocumentsFilterType, value: string) => {
        setFilter((prev) => {
            return { ...prev, [name]: value } as DocumentsFilterType;
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
                onValueChange={(value) => handleFilterChange("type", value)}
            />
            <SelectClearable
                items={divisions.data?.map((division) => ({
                    value: division.id,
                    label: `Div. ${division.name}`,
                }))}
                placeholder="Ditambahkan Oleh"
                onValueChange={(value) => handleFilterChange("addedBy", value)}
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