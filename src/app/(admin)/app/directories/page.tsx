"use client";

import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input";
import { FolderPlus, Search, X } from "lucide-react";
import { DirectoriesFilter } from "./_components/directories-filter";
import AddDirectoryDialog from "./_components/dialog-add-directory";
import DirectoriesList from "./_components/directories-list";
import { useGetDirectories } from "@/hooks/useGetDirectories";
import { useRef, useState } from "react";

export default function DirectoryPage() {
    const directories = useGetDirectories({
        key: ["dir-staff"],
    });
    const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const target = e.target as HTMLInputElement;
            setSearchQuery(target.value);
        }
    };

    return (
        <>
            <section className="flex items-center justify-between p-4 border-b-2 bg-white border-gray-200 border-dashed sticky top-20 z-40">
                <InputWithIcon
                    className="w-lg h-10 bg-gray-100 rounded-full border-none shadow-none focus-visible:border-none"
                    lucideIcon={Search}
                    placeholder="Cari Direktori..."
                    onKeyDown={handleSearch}
                    ref={searchInputRef}
                />
                <AddDirectoryDialog>
                    <Button className="rounded-full">
                        <FolderPlus />
                        Buat Direktori Baru
                    </Button>
                </AddDirectoryDialog>
            </section>
            <section className="p-4">
                <div className="mb-4 flex items-center gap-3">
                    {
                        searchQuery && (
                            <>
                                <p>Pencarian {`"${searchQuery}"`}</p>
                                <Button
                                    onClick={() => {
                                        setSearchQuery(undefined);
                                        searchInputRef.current!.value = "";
                                        searchInputRef.current?.focus();
                                    }}
                                    variant={"outline"}
                                    size={"icon"}
                                    className="rounded-full size-7"
                                >
                                    <X />
                                </Button>
                            </>
                        )
                    }
                </div>
                <DirectoriesFilter query={searchQuery} getDirectories={directories} />
                {
                    directories.isSuccess && directories.directories?.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center mt-10">Tidak ada direktori ditemukan.</p>
                    ) : (
                        <DirectoriesList directories={directories} />
                    )
                }
            </section>
        </>
    );
}
