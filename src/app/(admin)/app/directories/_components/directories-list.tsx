'use client';

import DirectoryCard from "@/components/common/directory-card";
import { queryKey } from "@/constants";
import { DirectoryTypes } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function DirectoriesList() {
    const directories = useQuery({
        queryKey: [queryKey.GET_ALL_DIRECTORIES],
        queryFn: () => axios.get<DirectoryTypes[]>("/api/directories").then(res => res.data),
    })

    if(directories.isLoading){
        return(
            <Loader2 className="size-8 text-emerald-600 animate-spin mx-auto mt-10"/>
        )
    }

    return (
        <div className="mt-5 grid grid-cols-4 gap-4">
            {
                directories.data?.map((directory) => (
                    <DirectoryCard
                        key={directory.id}
                        name={directory.name}
                        documentsCount={0}
                        isPrivate={directory.isPrivate}
                    />
                )) || (
                    <div className="col-span-4 text-center text-gray-500">
                        Tidak ada direktori ditemukan.
                    </div>
                )
            }
        </div>
    );
}