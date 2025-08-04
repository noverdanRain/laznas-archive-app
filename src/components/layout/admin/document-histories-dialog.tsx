"use client";

import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { useGetDocHistories } from "@/hooks/useGetDocHistories";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

type HistoryDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    docId: string;
    docName: string;
};
export default function DocumentHistoriesDialog(props: HistoryDialogProps) {
    const { data: histories, isSuccess } = useGetDocHistories({ docId: props.docId });

    return (
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
            <DialogContent
                className="w-fit sm:min-w-[440px] max-w-xl p-0 overflow-hidden [&>button:last-child]:z-40"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className="max-h-[85vh] overflow-y-auto pb-5 px-4 space-y-4">
                    <AlertDialogHeader className="py-4 pt-5 sticky top-0 bg-white border-b-2 border-gray-200 border-dashed z-30">
                        <DialogTitle>Histori Perubahan</DialogTitle>
                        <DialogDescription>{props.docName}</DialogDescription>
                    </AlertDialogHeader>
                    <div className="grid gap-4 pl-2 pt-0 relative">
                        <div className="absolute w-1 h-[calc(100%-62px)] left-3 top-2 bg-gray-300 rounded-full" />
                        {
                            isSuccess && histories && (
                                histories.map((history, index) => (
                                    <div key={history.id} className="flex gap-4 z-20">
                                        <div className={`${index !== 0 ? "bg-gray-400" : "bg-emerald-600"} size-3 rounded-full mt-2`} />
                                        <div>
                                            <Link href={`${props.docId}/history/${history.id}`} className="hover:underline">
                                                {history.changeNotes || "Tidak ada catatan perubahan"}
                                            </Link>
                                            <p className="text-sm text-gray-500">
                                                Diubah oleh Div. {history.updatedBy.divisions} ({history.updatedBy.username})
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formatDate(history.dateChanged)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )
                        }
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
