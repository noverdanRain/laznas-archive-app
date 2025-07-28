'use client';

import SelectClearable from "@/components/common/select-clearable";
import { queryKey } from "@/constants";
import { useGetDivisions } from "@/hooks/useGetDivisions";
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

    const { divisions } = useGetDivisions();

    const handleFilterChange = (name: keyof DocumentsFilterType, value: string) => {
        setFilter((prev) => {
            return { ...prev, [name]: value } as DocumentsFilterType;
        });
    };

    return (
        <div className="flex items-center gap-2">
            <SelectClearable
                items={divisions?.map((division) => ({
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