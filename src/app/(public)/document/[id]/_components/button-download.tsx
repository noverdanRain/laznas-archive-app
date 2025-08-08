"use client";

import { TooltipText } from "@/components/common/tooltip-text";
import { pinataPrivateFile, pinataPublicFile } from "@/lib/actions";
import { downloadFileFromURI } from "@/lib/utils";
import { ArrowDownToLine, Loader2 } from "lucide-react";
import { useState } from "react";

export function ButtonDownload({ fileName, cid, isPrivate }: { fileName: string, cid: string, isPrivate?: boolean }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        setIsLoading(true);
        const uri = isPrivate ? await pinataPrivateFile(cid) : await pinataPublicFile(cid);
        await downloadFileFromURI(uri, fileName);
        setIsLoading(false);
    }
    return (
        <TooltipText text="Unduh Dokumen">
            <button className="cursor-pointer hover:text-emerald-600 transition-colors ml-auto" onClick={handleDownload}>
                {isLoading ? <Loader2 className="animate-spin text-emerald-600" size={18} /> : <ArrowDownToLine size={18} />}
            </button>
        </TooltipText>
    )
}