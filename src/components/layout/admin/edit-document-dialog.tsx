"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import FormEditDocument from "./form-edit-document";
import { getAllDocuments } from "@/lib/actions";
type PropsType = Awaited<ReturnType<typeof getAllDocuments>>["list"][0];

type EditDocumentDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultFile: string;
} & PropsType;

export default function EditDocumentDialog(props: EditDocumentDialogProps) {
    const { open, onOpenChange, defaultFile } = props;
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
                        <DialogTitle>Edit Dokumen</DialogTitle>
                        <DialogDescription>
                            Silakan ubah data dokumen yang ingin diedit.
                        </DialogDescription>
                    </DialogHeader>
                    <FormEditDocument
                        className="mt-4"
                        onCancel={() => onOpenChange(false)}
                        defaultFile={defaultFile}
                        onSubmited={() => onOpenChange(false)}
                        defaultValues={{
                            file: null,
                            directoryId: props.directory?.id || "",
                            documentTypeId: props.documentTypeId || "",
                            title: props.title || "",
                            description: props.description || "",
                            documentNum: props.documentNum || "",
                            visibility: props.isPrivate ? "private" : "public",
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
