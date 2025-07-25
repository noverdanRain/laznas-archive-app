'use client';

import DocumentIcon from "@/components/common/document-Icon";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SelectDirectory } from "@/components/layout/admin/add-document-dialog/select-directory";
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
import { type AddDocumentInputData } from "@/app/api/documents/route";
import { pinata } from "@/lib/pinata-config";
import { Loader2 } from "lucide-react";

export default function AddDocumentDialog({
    children,
    file,
    ...props
}: {
    children?: React.ReactNode;
    file: FileWithPath;
} & React.ComponentProps<typeof Dialog>) {

    const [inputData, setInputData] = useState<AddDocumentInputData>({
        cid: "",
        directoryId: "",
        title: "",
        description: "",
        documentTypeId: "",
        visibility: "public",
        documentNum: null,
        fileExt: "",
    });

    const [progress, setProgress] = useState({
        ongoing: false,
        step: 0,
        message: "",
    })


    const uploadData = useMutation({
        mutationFn: (data: AddDocumentInputData) => axios.post("/api/documents", data),
        onMutate: () => {
            setProgress({ ongoing: true, step: 3, message: "Menyimpan data dokumen..." });
        },
        onSuccess: (res) => {
            toast.success("Dokumen berhasil ditambahkan", { description: "Lihat dokumen", id: "doc-upload", duration: 5000 });
            setProgress({ ongoing: false, step: 0, message: "" });
            props.onOpenChange?.(false);
            clearInputData();
        },
        onError: (error) => {
            console.error("Error adding document:", error);
            setProgress({ ongoing: false, step: 0, message: "" });
            toast.error("Terjadi Kesalahan Saat Menambahkan Dokumen", { description: "Gagal menambahkan data dokumen ke arsip", id: "doc-upload" });
        }
    })

    const uploadFile = useMutation({
        mutationFn: async ({ presignedUrl }: { presignedUrl: string }) => {
            return await pinata.upload.private.file(file).url(presignedUrl);
        },
        onMutate: () => {
            setProgress({ ongoing: true, step: 2, message: "Mengunggah file dokumen..." });
        },
        onSuccess: (data) => {
            uploadData.mutate({
                ...inputData,
                cid: data.cid,
            });
        },
        onError: (error) => {
            console.error("Error uploading file:", error);
            setProgress({ ongoing: false, step: 0, message: "" });
            toast.error("Terjadi Kesalahan Saat Upload Dokumen", { description: "Gagal mengunggah dokumen ke IPFS", id: "doc-upload" });
        },
    })


    const handleSubmit = () => {
        setInputData((prev) => ({ ...prev, fileExt: getFileExt(file.name) }));
        if (!validateInputData(inputData)) {
            return;
        }
        // toast.loading("Mengunggah dokumen", { id: "doc-upload" });
        setProgress({ ongoing: true, step: 1, message: "Mendapatkan informasi..." });
        axios.get(`api/documents/presigned-url?name=${encodeURIComponent(inputData.title)}.${getFileExt(file?.name)}&visibility=${inputData.visibility}`)
            .then((res) => {
                const presignedUrl = res.data.url;
                if (file && presignedUrl) {
                    uploadFile.mutate({ presignedUrl });
                } else {
                    setProgress({ ongoing: false, step: 0, message: "" });
                    toast.error("Terjadi Kesalahan Saat Upload Dokumen", { description: "Gagal mendapatkan url upload atau file yang akan diunggah tidak ada", id: "doc-upload" });
                }
            })
            .catch((error) => {
                console.error("Error fetching presigned URL:", error);
                setProgress({ ongoing: false, step: 0, message: "" });
                toast.error("Terjadi Kesalahan Saat Upload Dokumen", { description: "Gagal mendapatkan url upload", id: "doc-upload" });
            });
    }

    const clearInputData = () => {
        setInputData({
            directoryId: "",
            title: "",
            description: "",
            documentTypeId: "",
            visibility: "public",
            documentNum: null,
            cid: "",
            fileExt: "",
        });
    };

    return (
        <>
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
                                    onValueChange={(directoryId) => setInputData((prev) => ({ ...prev, directoryId }))}
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
                                    value={inputData.title}
                                    onChange={(e) => setInputData((prev) => ({ ...prev, title: e.target.value }))}
                                />
                                {/* <p className="text-xs font-medium text-red-500">Mohon masukan nama dokumen</p> */}
                            </div>
                            <div className="grid gap-2">
                                <p className="text-sm font-medium">Jenis Dokumen</p>
                                <SelectDocType onValueChange={(documentTypeId) => setInputData((prev) => ({ ...prev, documentTypeId }))} />
                                {/* <p className="text-xs font-medium text-red-500">Mohon pilih salah satu jenis dokumen</p> */}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="doc-desc">Deskripsi <span className="text-xs text-gray-500">(opsional)</span></Label>
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
                                <Label>Nomor Dokumen <span className="text-xs text-gray-500">(opsional)</span></Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="doc-num"
                                        name="docNum"
                                        placeholder="Masukan Nomor Dokumen"
                                        className="w-full h-10"
                                        value={inputData.documentNum || ""}
                                        onChange={(e) => setInputData((prev) => ({ ...prev, documentNum: e.target.value }))}
                                    />
                                    <Button
                                        variant={"outline"}
                                        onClick={() => setInputData((prev) => ({ ...prev, documentNum: generateRandomCode() }))}
                                    >
                                        Acak
                                    </Button>
                                </div>
                                {/* <p className="text-xs font-medium text-red-500">Nomor dokumen sudah ada</p> */}
                            </div>
                            <div className="grid gap-2">
                                <p className="text-sm font-medium">Visibilitas</p>
                                <VisibilityRadioGroup
                                    selected={(value) => setInputData((prev) => ({ ...prev, visibility: value }))}
                                />
                            </div>
                        </div>
                        <DialogFooter className="sticky bottom-0 bg-white border-t-2 border-gray-200 border-dashed pb-1 pt-4 ">
                            <DialogClose asChild>
                                <Button variant="outline">Batal</Button>
                            </DialogClose>
                            <Button onClick={handleSubmit}>Simpan</Button>
                        </DialogFooter>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            <Dialog open={progress.ongoing} >
                <DialogContent className="flex flex-col gap-2 items-center justify-center p-10 bg-white rounded-2xl shadow-lg transition-all duration-300 w-fit [&>button:last-child]:hidden">
                    <DialogTitle hidden>Proses Upload Dokumen</DialogTitle>
                    <DialogDescription hidden>Proses upload dokumen sedang berlangsung</DialogDescription>
                    <p className="font-medium mb-4">Sedang Menyimpan Dokumen</p>
                    <Loader2 size={40} className="text-emerald-500 animate-spin" />
                    <p className="text-neutral-500 text-mt-">{`${progress.step}/3`}</p>
                    <p className="text-sm text-neutral-500">{progress.message}</p>
                </DialogContent>
            </Dialog>
        </>
    );
}

function validateInputData(data: AddDocumentInputData): boolean {
    if (!data.directoryId) {
        toast.error("Mohon pilih direktori untuk dokumen");
        return false;
    }
    if (!data.title) {
        toast.error("Mohon masukan nama dokumen");
        return false;
    }
    if (!data.documentTypeId) {
        toast.error("Mohon pilih jenis dokumen");
        return false;
    }
    if (!data.visibility) {
        toast.error("Mohon pilih visibilitas dokumen");
        return false;
    }
    return true;
}