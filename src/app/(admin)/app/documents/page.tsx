'use client';
import { FilePlus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DocumentsFilter } from "./_components/documents-filter";
import StaffDocumentsTable from "@/components/layout/admin/documents-table";
import { useGetDocuments } from "@/hooks/useGetDocuments";

export default function DocumentsPage() {


    return (
        <>
            <section className="p-4 flex items-center justify-between w-full border-b-2 border-gray-200 border-dashed bg-white sticky top-20 z-40">
                <div className="relative w-lg h-10 bg-gray-100 rounded-full active:ring-1 ring-gray-300 flex items-center cursor-default select-none">
                    <Search
                        size={16}
                        strokeWidth={2}
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                    />
                    <p className="text-neutral-500 pl-11 text-sm">
                        Cari dokumen
                    </p>
                    <Badge
                        variant={"outline"}
                        className="absolute top-1/2 -translate-y-1/2 transform right-4 bg-gray-200 text-gray-500"
                    >
                        Ctrl K
                    </Badge>
                </div>
                <Button className="rounded-full">
                    <FilePlus />
                    Tambah Dokumen
                </Button>
            </section>
            <section className="p-4">
                <DocumentsFilter />
                <StaffDocumentsTable />
            </section>
        </>
    )
}