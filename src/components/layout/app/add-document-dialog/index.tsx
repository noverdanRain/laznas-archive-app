'use client';

import DocumentIcon from "@/components/common/document-Icon";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SelectDirectory } from "@/components/layout/app/add-document-dialog/select-directory";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import getFileExt, { generateRandomCode } from "@/lib/utils";
import { filesize } from "filesize";
import VisibilityRadioGroup from "./radio-visibility";
import SelectDocType from "./select-doc-type";
import { type FileWithPath } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";

type DataInput = {
    directory: string;
    name: string;
    description: string;
    documentType: string;
    visibility: "public" | "private";
    docNum?: string;
}

export default function AddDocumentDialog({
    children,
    file,
    ...props
}: {
    children?: React.ReactNode;
    file?: FileWithPath;
} & React.ComponentProps<typeof Dialog>) {

    const [inputData, setInputData] = useState<DataInput>({
        directory: "",
        name: "",
        description: "",
        documentType: "",
        visibility: "public",
        docNum: "",
    });


    const uploadData = useMutation({

    })

    const uploadFile = useMutation({
        mutationFn: async ({ formData, presignedUrl }: { formData: FormData; presignedUrl: string }) => {
            return (await axios.post(presignedUrl, formData)).data;
        },
        onSuccess: (data) => {
            console.log("File uploaded successfully:", data);
            toast.success("Dokumen berhasil diunggah", { id: "doc-upload" });
        },
        onError: (error) => {
            console.error("Error uploading file:", error);
            toast.error("Terjadi Kesalahan Saat Upload Dokumen", { description: "Gagal mengunggah dokumen ke IPFS", id: "doc-upload" });
        },
    })


    const tesSubmit = () => {
        if (!validateInputData(inputData)) {
            return;
        }
        console.log(inputData);
        toast.loading("Mengunggah dokumen", { id: "doc-upload" });
        axios.get(`api/documents/presigned-url?name=${encodeURIComponent(inputData.name)}.${getFileExt(file?.name)}`)
            .then((res) => {
                const presignedUrl = res.data.url;
                if (file && presignedUrl) {
                    const formData = new FormData();
                    formData.append("file", file);
                    uploadFile.mutate({ formData, presignedUrl });
                }
            })
            .catch((error) => {
                console.error("Error fetching presigned URL:", error);
                toast.error("Terjadi Kesalahan Saat Upload Dokumen", { description: "Gagal mendapatkan url upload", id: "doc-upload" });
            });
    }

    const clearInputData = () => {
        setInputData({
            directory: "",
            name: "",
            description: "",
            documentType: "",
            visibility: "public",
            docNum: "",
        });
    };

    return (
        <Dialog
            {...props}
            onOpenChange={(open) => {
                props.onOpenChange?.(open);
                if (!open) {
                    clearInputData();
                }
            }}
        >
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                // onOpenAutoFocus={(e) => e.preventDefault()}
                className="p-0 "
            >
                <ScrollArea className="h-[calc(100vh-2rem)] p-5">
                    <AlertDialogHeader className="pb-4">
                        <DialogTitle>Tambah Dokumen ke Arsip</DialogTitle>
                        <DialogDescription>
                            Lengkapi informasi berikut untuk menambahkan dokumen
                            ke arsip.
                        </DialogDescription>
                    </AlertDialogHeader>
                    <div className="my-4 grid gap-4 m-1">
                        <div className="grid gap-1">
                            <p className="font-medium text-sm">File</p>
                            <div className="flex items-center gap-2 border border-gray-200 rounded-lg py-3 px-4">
                                <DocumentIcon
                                    size={24}
                                    type={getFileExt(file?.name)}
                                />
                                <div>
                                    <p className="line-clamp-1 text-sm">
                                        {file?.name}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {filesize(file?.size || 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="doc-dir">Direktori</Label>
                            <SelectDirectory
                                onValueChange={(dirId) => setInputData((prev) => ({ ...prev, directory: dirId }))}
                            />
                            {/* <p className="text-xs font-medium text-red-500">Mohon pilih direktori dimana dokumen akan disimpan</p> */}
                        </div>
                        <div className="my-2 border-b-2 border-gray-200 border-dashed" />
                        <div className="grid gap-2">
                            <Label htmlFor="doc-name">Nama</Label>
                            <Input
                                id="doc-name"
                                name="name"
                                placeholder="Nama Dokumen"
                                className="w-full h-10"
                                value={inputData.name}
                                onChange={(e) => setInputData((prev) => ({ ...prev, name: e.target.value }))}
                            />
                            {/* <p className="text-xs font-medium text-red-500">Mohon masukan nama dokumen</p> */}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="doc-desc">Deskripsi</Label>
                            <Textarea
                                id="doc-desc"
                                name="description"
                                placeholder="Deskripsi mengenai dokumen ini"
                                className="w-full min-h-24"
                                value={inputData.description}
                                onChange={(e) => setInputData((prev) => ({ ...prev, description: e.target.value }))}
                            />
                            {/* <p className="text-xs font-medium text-red-500">Mohon masukan deskripsi</p> */}
                        </div>
                        <div className="grid gap-2">
                            <p className="text-sm font-medium">Jenis Dokumen</p>
                            <SelectDocType onValueChange={(documentType) => setInputData((prev) => ({ ...prev, documentType }))} />
                            {/* <p className="text-xs font-medium text-red-500">Mohon pilih salah satu jenis dokumen</p> */}
                        </div>
                        <div className="grid gap-2">
                            <Label>Nomor Dokumen <span className="text-xs text-gray-500">(opsional)</span></Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="doc-num"
                                    name="docNum"
                                    placeholder="Masukan Nomor Dokumen"
                                    className="w-full h-10"
                                    value={inputData.docNum}
                                    onChange={(e) => setInputData((prev) => ({ ...prev, docNum: e.target.value }))}
                                />
                                <Button variant={"outline"} onClick={() => setInputData((prev) => ({ ...prev, docNum: generateRandomCode() }))}>Acak</Button>
                            </div>
                            {/* <p className="text-xs font-medium text-red-500">Nomor dokumen sudah ada</p> */}
                        </div>
                        <div className="grid gap-2">
                            <p className="text-sm font-medium">Visibilitas</p>
                            <VisibilityRadioGroup selected={(value) => setInputData((prev) => ({ ...prev, visibility: value }))} />
                        </div>
                    </div>
                    <DialogFooter className="sticky bottom-0 bg-white border-t-2 border-gray-200 border-dashed pt-4 ">
                        <DialogClose asChild>
                            <Button variant="outline">Batal</Button>
                        </DialogClose>
                        <Button onClick={tesSubmit}>Simpan</Button>
                    </DialogFooter>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

function validateInputData(data: DataInput): boolean {
    if (!data.directory) {
        toast.error("Mohon pilih direktori untuk dokumen");
        return false;
    }
    if (!data.name) {
        toast.error("Mohon masukan nama dokumen");
        return false;
    }
    if (!data.description) {
        toast.error("Mohon masukan deskripsi dokumen");
        return false;
    }
    if (!data.documentType) {
        toast.error("Mohon pilih jenis dokumen");
        return false;
    }
    if (!data.visibility) {
        toast.error("Mohon pilih visibilitas dokumen");
        return false;
    }
    return true;
}