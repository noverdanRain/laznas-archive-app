"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import FormAddDocument from "./form-add-document";
import { FileWithPath } from "react-dropzone";

type AddDocumentDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    file?: File | FileWithPath | null;
};

export default function AddDocumentDialog(props: AddDocumentDialogProps) {
    const { open, onOpenChange, file } = props;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* <DialogTrigger asChild>
                    <Button variant="outline">Open Dialog</Button>
                </DialogTrigger> */}
            <DialogContent
                className="p-0 overflow-clip"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                <div className="h-[calc(100vh-2rem)] px-5 pb-5 w-full overflow-y-scroll">
                    <DialogHeader className="pb-4 pt-5 border-b-2 border-gray-200 border-dashed sticky top-0 bg-white z-10">
                        <DialogTitle>Tambah Dokumen</DialogTitle>
                        <DialogDescription>
                            Silakan lengkapi form berikut untuk menambahkan
                            dokumen baru.
                        </DialogDescription>
                    </DialogHeader>
                    <FormAddDocument
                        className="mt-4"
                        onCancel={() => onOpenChange(false)}
                        defaultFile={file || undefined}
                        onSubmited={() => onOpenChange(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
