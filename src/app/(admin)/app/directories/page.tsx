import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input";
import { FolderPlus, Search } from "lucide-react";
import { DirectoriesFilter } from "./_components/directories-filter";
import DirectoryCard from "@/components/common/directory-card";
import AddDirectoryDialog from "@/components/layout/app/add-directory-dialog";
import DirectoriesList from "./_components/directories-list";

export default async function DirectoryPage() {
    return (
        <>
            <section className="flex items-center justify-between p-4 border-b-2 bg-white border-gray-200 border-dashed sticky top-20 z-40">
                <InputWithIcon
                    className="w-lg h-10 bg-gray-100 rounded-full border-none shadow-none focus-visible:border-none"
                    lucideIcon={Search}
                    type="search"
                    placeholder="Cari Direktori..."
                />
                <AddDirectoryDialog>
                    <Button className="rounded-full">
                        <FolderPlus />
                        Buat Direktori Baru
                    </Button>
                </AddDirectoryDialog>
            </section>
            <section className="p-4">
                <DirectoriesFilter />
                <DirectoriesList />
            </section>
        </>
    );
}
