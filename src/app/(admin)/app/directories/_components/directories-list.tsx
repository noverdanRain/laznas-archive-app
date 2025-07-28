'use client';

import DirectoryCard from "@/components/common/directory-card";
import { useGetDirectories } from "@/hooks/useGetDirectories";
import { Loader2 } from "lucide-react";

export default function DirectoriesList() {
    const { directories, isLoading } = useGetDirectories()

    if (isLoading) {
        return (
            <Loader2 className="size-8 text-emerald-600 animate-spin mx-auto mt-10" />
        )
    }

    return (
        <div className="mt-5 grid grid-cols-4 gap-4">
            {
                directories?.map((directory) => (
                    <DirectoryCard
                        key={directory.id}
                        id={directory.id}
                        name={directory.name}
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