"use client";

import { useGetDocuments } from "@/hooks/useGetDocuments";
import TableContent from "./table-content";
import TableHeader from "./table-header";
import TableItem from "./table-item";
import { Loader2 } from "lucide-react";

type GetDocProps = ReturnType<typeof useGetDocuments>;

export default function StaffDocumentsTable({ getDocsData, className, stickyTop = 164 }: { getDocsData: GetDocProps, className?: string, stickyTop?: number }) {
    const { data: documents, isLoading } = getDocsData;

    return (
        <div>
            <div className={`h-4 w-full sticky top-[${stickyTop - 14}px] bg-white z-10 after:content-[''] after:absolute after:w-full after:h-8 after:bg-white`} />
            <TableHeader stickyTop={stickyTop} />
            <TableContent getDocsData={getDocsData}>
                {isLoading && (
                    <div className="col-span-6 flex justify-center items-center h-[calc(100vh-370px)] text-emerald-600">
                        <Loader2 size={29} className="animate-spin" />
                    </div>
                )}
                {!isLoading && documents?.list?.map((document) => (
                    <TableItem key={document.id} {...document} />
                ))}
                {documents && documents.list.length === 0 && (
                    <div className="col-span-6 flex justify-center items-center h-[calc(100vh-370px)] text-neutral-500">
                        Tidak ada dokumen yang ditemukan
                    </div>
                )}
            </TableContent>
        </div>
    );
}
