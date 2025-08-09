"use client";

import SelectClearable from "@/components/common/select-clearable";
import PublicDocumentsTable from "@/components/layout/public/documents-table";
import { useGetDocType } from "@/hooks/useGetDocType";
import { useGetDocuments } from "@/hooks/useGetDocuments";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";


export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchPageContent />
        </Suspense>
    );
}

function SearchPageContent() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('query') || '';

    const documents = useGetDocuments({
        key: ['search-documents', searchQuery],
        query: searchQuery,
        filter: {
            visibility: 'public',
        }
    })
    const { data: docType } = useGetDocType();

    const handleFilters = (type: string, value: string) => {
        documents.setQuery({
            filter: {
                ...documents.currentFilter,
                [type]: value ? value : undefined
            }
        })
    }

    if (!searchQuery) {
        return <div className="p-4">Tidak ada hasil pencarian.</div>;
    }
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Hasil Pencarian Dari {`"${searchQuery}"`}</h1>
            <div className="flex items-center gap-2 mb-6">
                <SelectClearable
                    items={docType?.map((type) => ({
                        label: type.name,
                        value: type.id,
                    })) || []}
                    placeholder="Jenis Dokumen"
                    onValueChange={(value) => handleFilters('documentType', value)}
                />
                <SelectClearable
                    items={[
                        { label: '7 Hari Terakhir', value: '7days' },
                        { label: '30 Hari Terakhir', value: '30days' },
                        { label: '6 Bulan Terakhir', value: '6month' },
                        { label: '1 Tahun Terakhir', value: '1year' },]}
                    placeholder="Waktu Ditambahkan"
                    onValueChange={(value) => handleFilters('lastAdded', value)}
                />
            </div>
            {/* Render search results here */}
            <PublicDocumentsTable getDocsData={documents || null} />
        </div>
    );
}