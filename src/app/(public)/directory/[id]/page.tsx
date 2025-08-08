"use client";
import SelectClearable from "@/components/common/select-clearable";
import PublicDocumentsTable from "@/components/layout/public/documents-table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useGetDirectoryById } from "@/hooks/useGetDirectoryById";
import { useGetDocType } from "@/hooks/useGetDocType";
import { useGetDocuments } from "@/hooks/useGetDocuments";
import { Folder } from "lucide-react";
import { useParams } from "next/navigation";

export default function PublicDirectoryDetailPage() {
    const { id } = useParams<{ id: string }>()
    const docType = useGetDocType();
    const directory = useGetDirectoryById({ id })
    const document = useGetDocuments({
        key: ["documents", id],
        filter: {
            directory: id,
            visibility: "public"
        }
    })

    return (
        <div className="p-4">
            <div className="flex items-center justify-between">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">
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
                <p className="text-sm text-muted-foreground mt-1 max-w-3xl">{directory.data?.description}</p>
                <div className="flex items-center gap-2 mt-6">
                    <SelectClearable
                        items={docType.data?.map((type) => ({ label: type.name, value: type.id }))}
                        placeholder="Jenis Dokumen"
                    />
                </div>
                <PublicDocumentsTable getDocsData={document} />
            </div>
        </div>
    );
}