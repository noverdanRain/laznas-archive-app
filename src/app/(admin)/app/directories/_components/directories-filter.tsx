'use client';

import SelectClearable from "@/components/common/select-clearable";
import { useGetDivisions } from "@/hooks/useGetDivisions";
import { DocumentsFilterType } from "@/types";
import { useState } from "react";
import { useAtom } from "jotai";
import { dirFilterAtom } from "@/lib/atom";
import { IGetDirectoriesParams } from "@/lib/actions/query/directories";
import { useGetDirectories } from "@/hooks/useGetDirectories";
import { useQueryClient } from "@tanstack/react-query";

export function DirectoriesFilter() {
    const [dirFilter, setDirFilter] = useAtom(dirFilterAtom);
    const queryclient = useQueryClient();
    const { directories, isLoading, setFilter } = useGetDirectories({
        key: ["dir-staff"]
    })

    const { data: divisions } = useGetDivisions();

    const handleFilterChange = (name: keyof IGetDirectoriesParams, value: string) => {
        if (!value) {
            setFilter({ isPrivate: undefined });
        } else {
            setFilter({ isPrivate: value === "private" });
        }
    };

    return (
        <div className="flex items-center gap-2">
            <SelectClearable
                items={[
                    { value: "public", label: "Public" },
                    { value: "private", label: "Private" },
                ]}
                placeholder="Visibilitas"
                onValueChange={(value) => handleFilterChange("filter", value)}
            />
            {/* <Button variant={"ghost"}>Hapus Filter</Button> */}
        </div>
    )
}