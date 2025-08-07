'use client';

import DirectoryCard from "@/components/common/directory-card";
import { useGetDirectories } from "@/hooks/useGetDirectories";
import { Loader2 } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";


export default function DirectoriesList() {
    const { directories, isLoading } = useGetDirectories()
    const router = useRouter();

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
                        docsCount={directory.documentsCount}
                        onClick={() => router.push(`/app/directories/${directory.id}`)}
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