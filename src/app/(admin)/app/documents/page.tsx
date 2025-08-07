'use client';
import { FilePlus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentsFilter } from "./_components/documents-filter";
import StaffDocumentsTable from "@/components/layout/admin/documents-table";
import AddDocumentDialog from "@/components/layout/admin/add-document-dialog";
import { Suspense, useState } from "react";
import { useGetDocuments } from "@/hooks/useGetDocuments";
import { InputWithIcon } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { documentsPage_useGetDocumentsKey } from "@/lib/constants";

export default function DocumentsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DocumentsPageContent />
        </Suspense>
    )
}

function DocumentsPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const searchQuery = searchParams.get('search');

    const [searchInput, setSearchInput] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    
    const getDocuments = useGetDocuments({
        key: documentsPage_useGetDocumentsKey,
        query: searchQuery || undefined,
    });

    const handleSearchEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        if (event.key === 'Enter' && value.trim() !== '') {
            router.push(`?search=${encodeURIComponent(value)}`);
            setSearchInput('');
            getDocuments.setQuery({
                query: value,
                filter: { ...getDocuments.currentFilter },
            });
        }
    }

    const handleClearSearch = () => {
        setSearchInput('');
        router.push('documents');
        getDocuments.setQuery({
            query: undefined,
            filter: { ...getDocuments.currentFilter },
        })
    }

    return (
        <>
            <section className="p-4 flex items-center justify-between w-full border-b-2 border-gray-200 border-dashed bg-white sticky top-20 z-40">
                <div className="flex items-center gap-2">
                    <InputWithIcon
                        lucideIcon={Search}
                        className="bg-gray-100 rounded-full w-96 shadow-none"
                        placeholder="Cari dokumen..."
                        onKeyDown={handleSearchEnter}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    {
                        searchInput && searchInput.trim() !== '' ? (
                            <Button
                                variant="outline"
                                className="rounded-full bg-gray-100 size-6"
                                size={"icon"}
                                onClick={() => setSearchInput('')}
                            >
                                <X />
                            </Button>
                        ) : null
                    }
                </div>
                <Button onClick={() => setOpenDialog(true)} className="rounded-full">
                    <FilePlus />
                    Tambah Dokumen
                </Button>
            </section>
            <section className="p-4">
                {
                    searchQuery && (
                        <div className="flex  gap-2items-center mb-4">
                            <p className="ml-1 font-medium">Hasil Pencarian {`"${searchQuery}"`}</p>
                            <button
                                onClick={handleClearSearch}
                                className="size-6 flex items-center justify-center rounded-full bg-gray-100 ml-2 cursor-pointer hover:bg-gray-200 transition-colors">
                                <X size={14} />
                            </button>
                        </div>
                    )
                }
                <DocumentsFilter getDocsData={getDocuments} />
                <StaffDocumentsTable getDocsData={getDocuments} />
            </section>
            <AddDocumentDialog open={openDialog} onOpenChange={setOpenDialog} />
        </>
    )
}