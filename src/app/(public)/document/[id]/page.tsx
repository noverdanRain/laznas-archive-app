"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useGetDocumentById } from "@/hooks/useGetDocumentById";
import { Copy, FileX, Folder } from "lucide-react";
import { useParams } from "next/navigation";
import FileSection from "./_components/file-section";
import { getDocumentById } from "@/lib/actions";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function PublicDocumentPage() {
    const { id } = useParams<{ id: string }>()

    const documentData = useGetDocumentById({ id });
    console.log("Document Data:", documentData.data);
    if (!documentData.data) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] gap-2">
                <FileX className="text-gray-400" size={30} />
                <h3 className="text-gray-400 font-medium">
                    Dokumen tidak ditemukan
                </h3>
            </div>
        );
    }

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
                            <BreadcrumbLink href="/documents">
                                Dokumen
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem className="max-w-lg">
                            <BreadcrumbPage className="line-clamp-1">
                                Detail Dokumen
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="grid grid-cols-[1.1fr_2fr] gap-6 mt-6">
                <FileSection documentData={documentData.data} />
                <IdentitySection documentData={documentData.data} />
            </div>
        </div>
    );
}

type DocumentType = Awaited<ReturnType<typeof getDocumentById>>;
function IdentitySection({ documentData }: { documentData: DocumentType }) {
    return (
        <div className="w-full">
            <h1 className="font-semibold text-xl">{documentData?.title}</h1>
            <p className="mt-2 text-neutral-600">{documentData?.description}</p>
            <div className="grid grid-cols-[1fr_2.5fr] gap-4 mt-4 border p-4 border-gray-200 rounded-xl text-sm">
                <p className="text-neutral-500">No. Dokumen</p>
                <p>{documentData?.documentNum || "-"}</p>

                <p className="text-neutral-500">CID</p>
                <div className="flex items-center gap-2">
                    <button>
                        <Copy size={12} />
                    </button>
                    <p className="line-clamp-1 text-ellipsis">{documentData?.cid}</p>
                </div>

                <p className="text-neutral-500">Jenis Dokumen</p>
                <p className="line-clamp-1">
                    {documentData?.documentType}
                </p>

                <p className="text-neutral-500">Ditambahkan pada</p>
                <p className="line-clamp-1">
                    {formatDate(documentData?.createdAt || "")}
                </p>

                <p className="text-neutral-500">Ditambahkan oleh</p>
                <p className="line-clamp-1">
                    Div. {documentData?.createdBy.divisions}{" "}
                    <span className="text-xs text-neutral-500">({documentData?.createdBy.username})</span>
                </p>

                <p className="text-neutral-500">Direktori</p>
                <Link
                    href={`/directory/${documentData?.directory?.id}`}
                    className="flex items-center gap-2 hover:underline"
                >
                    <Folder
                        className="fill-amber-500 text-transparent"
                        size={16}
                    />
                    <p className="line-clamp-1">{documentData?.directory?.name}</p>
                </Link>

                <p className="text-neutral-500">Diubah pada</p>
                <div className="flex items-center gap-4">
                    <p>{formatDate(documentData?.updatedAt || "")}</p>
                </div>

                <p className="text-neutral-500">Diubah oleh</p>
                <p className="line-clamp-1">
                    Div. {documentData?.updatedBy?.divisions}{" "}
                    <span className="text-xs text-neutral-500">({documentData?.updatedBy?.username})</span>
                </p>
            </div>
        </div>
    );
}
