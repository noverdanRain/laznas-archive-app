'use client';

import SelectClearable from "@/components/common/select-clearable";
import { queryKey } from "@/constants";
import { DivisionTypes } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export type DocumentsFilterType = {
    addedBy: string;
    visibility: string;
}

export function DirectoriesFilter() {
    const [filter, setFilter] = useState<DocumentsFilterType>();

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