'use client';

import SelectClearable from "@/components/common/select-clearable";
import { useGetDivisions } from "@/hooks/useGetDivisions";
import { useEffect, useState } from "react";
import { IGetDirectoriesParams } from "@/lib/actions/query/directories";
import { useGetDirectories } from "@/hooks/useGetDirectories";
type GetDirectoriesResponse = ReturnType<typeof useGetDirectories>;
type FilterType = NonNullable<IGetDirectoriesParams["filter"]>;
import { useTopLoader } from "nextjs-toploader";

export function DirectoriesFilter({ getDirectories, query }: { getDirectories: GetDirectoriesResponse, query?: string | undefined }) {
    const [filter, setFilter] = useState<FilterType>()
    const topLoader = useTopLoader();
    console.log(filter);

    const handleFilterChange = (name: keyof FilterType, value: string) => {
        if (!value) {
            setFilter((prev) => ({
                ...prev,
                [name]: undefined
            }))
            return;
        }
        setFilter((prev) => ({
            ...prev,
            [name]: name === "isPrivate" ? value === "private" : value ? value : undefined,
        }));
    };

    useEffect(() => {
        setFilter((prev) => ({
            ...prev,
            query
        }))
    }, [query]);

    useEffect(() => {
        getDirectories.setFilter(filter);
    }, [filter]);

    useEffect(() => {
        if (getDirectories.isUpdating) {
            topLoader.start();
        } else {
            topLoader.done();
        }
    }, [getDirectories.isUpdating]);

    const { data: divisions } = useGetDivisions();

    return (
        <div className="flex items-center gap-2">
            <SelectClearable
                items={divisions?.map((division) => ({
                    value: division.id,
                    label: `Div. ${division.name}`,
                }))}
                placeholder="Dibuat Oleh"
                onValueChange={(value) => handleFilterChange("divisionId", value)}
            />
            <SelectClearable
                items={[
                    { value: "public", label: "Public" },
                    { value: "private", label: "Private" },
                ]}
                placeholder="Visibilitas"
                onValueChange={(value) => handleFilterChange("isPrivate", value)}
            />
        </div>
    )
}