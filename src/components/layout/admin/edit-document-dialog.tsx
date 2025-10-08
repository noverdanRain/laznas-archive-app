"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import FormEditDocument from "./form-edit-document";
import { getAllDocuments } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";
import { useRef } from "react";
type DocumentDetail = Awaited<ReturnType<typeof getAllDocuments>>["list"][0];

type EditDocumentDialogProps = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultFile: string;
    withTrigger?: boolean;
    defaultValues: DocumentDetail;
};

export default function EditDocumentDialog(props: EditDocumentDialogProps) {
    const { open, onOpenChange, defaultFile } = props;
    const closeRef = useRef<HTMLButtonElement>(null);
    const handleSubmited = ()=>{
        onOpenChange?.(false);
        closeRef.current?.click();
    }
    const handleClose = () => {
        onOpenChange?.(false);
        closeRef.current?.click();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {
                props.withTrigger && (
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Pencil />
                        </Button>
                    </DialogTrigger>
                )
            }
            <DialogContent
                className="p-0 overflow-clip"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                onDoubleClick={(e) => e.stopPropagation()}
            >
                <div className="h-[calc(100vh-2rem)] px-5 pb-5 w-full overflow-y-scroll">
                    <DialogHeader className="pb-4 pt-5 border-b-2 border-gray-200 border-dashed sticky top-0 bg-white z-10">
                        <DialogTitle>Edit Dokumen</DialogTitle>
                        <DialogDescription>
                            Silakan ubah data dokumen yang ingin diedit.
                        </DialogDescription>
                    </DialogHeader>
                    <FormEditDocument
                        className="mt-4"
                        onCancel={handleClose}
                        defaultFile={defaultFile}
                        onSubmited={handleSubmited}
                        documentId={props.defaultValues.id}
                        defaultValues={{
                            file: null,
                            directoryId: props.defaultValues.directory?.id || "",
                            documentTypeId: props.defaultValues.documentTypeId || "",
                            title: props.defaultValues.title || "",
                            description: props.defaultValues.description || "",
                            documentNum: props.defaultValues.documentNum || "",
                            visibility: props.defaultValues.isPrivate ? "private" : "public",
                        }}
                    />
                </div>
                <DialogClose hidden asChild>
                    <button ref={closeRef}>Close</button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}
