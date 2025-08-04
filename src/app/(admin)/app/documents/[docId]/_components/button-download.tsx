"use client";

import { TooltipText } from "@/components/common/tooltip-text";
import { downloadFileFromURI } from "@/lib/utils";
import { ArrowDownToLine } from "lucide-react";

export function ButtonDownload({ uri, fileName }: { uri: string; fileName: string }) {

    const handleDownload = () => {
        downloadFileFromURI(uri, fileName);
    }
    return (
        <TooltipText text="Unduh Dokumen">
            <button className="cursor-pointer hover:text-emerald-600 transition-colors ml-auto" onClick={handleDownload}>
                <ArrowDownToLine size={18} />
            </button>
        </TooltipText>
    )
}