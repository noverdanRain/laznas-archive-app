"use client";

import { useGetDocuments } from "@/hooks/useGetDocuments";
import TableContent from "./table-content";
import TableHeader from "./table-header";
import TableItem from "./table-item";
import { Loader2 } from "lucide-react";
import { documentsPage_useGetDocumentsParams } from "@/app/(admin)/app/documents/page";

export default function StaffDocumentsTable() {
    const { data: documents, isLoading } = useGetDocuments(documentsPage_useGetDocumentsParams);

    return (
        <div>
            <div className="h-4 w-full sticky top-[150px] bg-white z-10 after:content-[''] after:absolute after:w-full after:h-8 after:bg-white" />
            <TableHeader />
            <TableContent>
                {isLoading && (
                    <div className="col-span-6 flex justify-center items-center h-[calc(100vh-370px)] text-emerald-600">
                        <Loader2 size={29} className="animate-spin" />
                    </div>
                )}
                {documents?.list?.map((document) => (
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
