import PublicDocumentsTable from "@/components/layout/public/documents-table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartNoAxesGantt } from "lucide-react";

export default function PublicHomeLastAdded() {
    return (
        <>
            <div className="flex items-center gap-4 justify-between mb-4">
                <p className="font-semibold ml-2">
                    Dokumen terakhir ditambahkan ke arsip
                </p>
                <Select defaultValue="30days">
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
                            <SelectItem value="6months">
                                6 Bulan terakhir
                            </SelectItem>
                            <SelectItem value="1year">
                                1 Tahun Terakhir
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <PublicDocumentsTable />
        </>
    )
}