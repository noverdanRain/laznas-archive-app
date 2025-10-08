"use client";

import DocumentHistoriesDialog from "@/components/layout/admin/document-histories-dialog";
import { useState } from "react";

type ButtonSeeHistoryProps = {
    docId: string;
    docName: string;
};
export function ButtonSeeHistory(props: ButtonSeeHistoryProps) {
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setDialogOpen(true)}
                className="text-xs font-medium underline text-neutral-500 hover:text-neutral-800 cursor-pointer"
            >
                Lihat histori
            </button>
            <DocumentHistoriesDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                docId={props.docId}
                docName={props.docName}
            />
        </>
    );
}
