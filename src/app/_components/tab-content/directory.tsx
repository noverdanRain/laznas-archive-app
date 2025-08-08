import DirectoryCard from "@/components/common/directory-card";
import { useGetDirectories } from "@/hooks/useGetDirectories";
import { Loader2 } from "lucide-react";

export default function PublicHomeDirectories() {

    const { directories, isLoading, isSuccess } = useGetDirectories({ filter: { isPrivate: false } });

    return (
        <>
            <div className="flex items-center gap-4 justify-between">
                <p className="font-semibold ml-2">
                    Dokumen terakhir dimodifikasi
                </p>
            </div>
            <div className="mt-5 grid grid-cols-4 gap-4">
                {
                    isLoading && (
                        <div className="col-span-4 flex justify-center">
                            <Loader2 className="size-8 text-emerald-600 animate-spin mx-auto mt-10" />
                        </div>
                    )
                }
                {
                    isSuccess && directories?.map((directory) => (
                        <DirectoryCard
                            key={directory.id}
                            id={directory.id}
                            name={directory.name}
                            isPrivate={directory.isPrivate}
                            docsCount={directory.documentsCount}
                        />
                    )) || (
                        <div className="col-span-4 text-center text-gray-500">
                            Tidak ada direktori ditemukan.
                        </div>
                    )
                }
            </div>
        </>
    )
}