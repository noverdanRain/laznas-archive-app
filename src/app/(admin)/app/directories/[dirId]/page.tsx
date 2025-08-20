"use client"

import SelectClearable from "@/components/common/select-clearable";
import StaffDocumentsTable from "@/components/layout/admin/documents-table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useGetDirectoryById } from "@/hooks/useGetDirectoryById";
import { useGetDocType } from "@/hooks/useGetDocType";
import { useGetDocuments, UseGetDocumentsParams } from "@/hooks/useGetDocuments";
import { Folder } from "lucide-react";
import { useParams } from 'next/navigation'
import { useEffect, useState } from "react";

type FilterType = UseGetDocumentsParams["filter"]


export default function DetailsDirectoryPage() {
    const { dirId } = useParams<{ dirId: string }>()
    const directory = useGetDirectoryById({ id: dirId })
    const [filter, setFilter] = useState<FilterType>({
        directory: dirId,
    })
    const { data: documentType } = useGetDocType();

    const document = useGetDocuments({
        key: ["documents", dirId],
        filter
    })

    useEffect(() => {
        document.setQuery({
            filter
        })
    }, [filter])

    return (
        <div className="p-4">
            <div className="flex items-center justify-between">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/app">Beranda</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/app/directories">
                                Direktori
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem className="max-w-lg">
                            <BreadcrumbPage className="line-clamp-1">
                                Detail Direktori
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="mt-5 space-y-2">
                <div className="flex items-center space-x-2">
                    <Folder size={24} className="fill-amber-500 text-transparent" />
                    <h1 className="font-semibold text-lg">{directory.data?.name}</h1>
                </div>
                <p className="text-sm font-medium">Dibuat Oleh Div. {directory.data?.divisionName}</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-3xl">{directory.data?.description}</p>
                <div className="flex items-center gap-2 mt-6">
                    <SelectClearable
                        items={documentType?.map((type) => ({
                            label: type.name,
                            value: type.id
                        }))}
                        placeholder="Jenis Dokumen"
                        onValueChange={(value) => {
                            setFilter((prev) => ({ ...prev, documentType: value }))
                        }}
                    />
                    <SelectClearable
                        items={[
                            { label: "Public", value: "public" },
                            { label: "Private", value: "private" },
                        ]}
                        placeholder="Visibilitas"
                        onValueChange={(value) => {
                            setFilter((prev) => ({ ...prev, visibility: value as "public" | "private" }))
                        }}
                    />
                </div>
                <StaffDocumentsTable stickyTop={100} getDocsData={document} />
            </div>
        </div>
    )
}