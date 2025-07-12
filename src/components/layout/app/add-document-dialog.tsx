import DocumentIcon from "@/components/common/document-Icon";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { bytesToMB } from "@/lib/utils";
import { FileWithPath } from "react-dropzone";


export default function AddDocumentDialog({
    children,
    file,
    ...props
}: {
    children?: React.ReactNode;
    file?: FileWithPath;
} & React.ComponentProps<typeof Dialog>
) {

    console.log("AddDocumentDialog file", file);

    return (
        <Dialog {...props}>
            {
                children && (
                    <DialogTrigger asChild>
                        {children}
                    </DialogTrigger>
                )
            }
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onOpenAutoFocus={(e) => e.preventDefault()}
                className=""
            >
                <AlertDialogHeader className="border-b-2 border-gray-200 pb-4 border-dashed">
                    <DialogTitle>Tambah Dokumen ke Arsip</DialogTitle>
                    <DialogDescription>
                        Lengkapi informasi berikut untuk menambahkan dokumen ke arsip.
                    </DialogDescription>
                </AlertDialogHeader>
                <div>
                    <p className="font-medium">File</p>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl py-3 px-4">
                        <DocumentIcon size={28} type="pdf" />
                        <div>
                            <p className="font-medium">{file?.name}</p>
                            <p className="text-gray-500 text-sm">{bytesToMB(file?.size)} MB</p>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Batal</Button>
                    </DialogClose>
                    <Button type="submit">Simpan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}