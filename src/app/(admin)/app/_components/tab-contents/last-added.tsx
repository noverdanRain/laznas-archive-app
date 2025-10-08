"use client";

import { ChartNoAxesGantt, } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import StaffDocumentsTable from "@/components/layout/admin/documents-table";
import { useGetDocuments } from "@/hooks/useGetDocuments";
import { lastAddedTabHome_queryKey } from "@/lib/constants";


export default function LastAddedTabContent() {
    const getDocuments = useGetDocuments({
        key: lastAddedTabHome_queryKey, filter: {
            lastAdded: "30days"
        }
    });

    const handleSelectChange = (value: "7days" | "30days" | "6month" | "1year") => {
        getDocuments.setQuery({
            filter: {
                lastAdded: value,
            },
        })
    }

    return (
        <>
            <div className="flex items-center gap-4 pb-1 justify-between">
                <p className="font-semibold ml-2">
                    Terakhir ditambahkan ke arsip
                </p>
                <Select onValueChange={handleSelectChange} defaultValue="30days">
                    <SelectTrigger className="w-3xs shadow-none rounded-full border-none bg-gray-100 text-sm h-8 py-0 focus-within:ring-0">
                        <div className="flex items-center gap-2">
                            <ChartNoAxesGantt strokeWidth={2.5} />
                            <SelectValue placeholder="Select range" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="7days">
                                7 Hari terakhir
                            </SelectItem>
                            <SelectItem value="30days">
                                30 Hari Terakhir
                            </SelectItem>
                            <SelectItem value="6month">
                                6 Bulan terakhir
                            </SelectItem>
                            <SelectItem value="1year">
                                1 Tahun Terakhir
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <StaffDocumentsTable getDocsData={getDocuments} />
        </>
    );
}