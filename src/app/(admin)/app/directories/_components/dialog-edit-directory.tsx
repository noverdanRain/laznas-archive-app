"use client";

import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import useEditDirectory from "@/hooks/useEditDirectory";
import { Eye, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type DialogProps = {
    defName: string;
    defDescription?: string;
    defIsPrivate: boolean;
    id: string;
}

export default function EditDirectoryDialog({
    children,
    ...props
}: {
    children?: React.ReactNode;
} & DialogProps) {
    const { defName, defDescription, defIsPrivate } = props;

    const [visibility, setVisibility] = useState<"private" | "public">(defIsPrivate ? "private" : "public");
    const [name, setName] = useState(defName || "")
    const [description, setDescription] = useState(defDescription || "");
    const [isOpen, setIsOpen] = useState(false);

    const isChanged = name !== defName || description !== defDescription || visibility !== (defIsPrivate ? "private" : "public");


    const editDirectory = useEditDirectory({
        onSuccess: () => {
            toast.success("Berhasil memperbarui direktori", { id: "edit-directory" });
            setIsOpen(false);
        },
        onReject: (message) => {
            toast.error(message, { id: "edit-directory" });
        },
        onError: (error) => {
            toast.error(error.message || "Ada kesalahan saat mengedit direktori, silakan coba lagi.", { id: "edit-directory" });
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const isPrivate = visibility === "private";

        if (!name) {
            toast.error("Nama direktori harus diisi");
            return;
        }

        editDirectory.mutate({
            id: props.id,
            name,
            description,
            isPrivate,
        })
        toast.loading("Memperbarui direktori...", { id: "edit-directory" });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button className="rounded-full">
                        Edit Direktori
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                className=""
            >
                <AlertDialogHeader>
                    <DialogTitle>Ubah Direktori</DialogTitle>
                    <DialogDescription>
                        Masukkan nama direktori yang diinginkan dan jika diperlukan, tambahkan deskripsi untuk direktori tersebut.
                    </DialogDescription>
                </AlertDialogHeader>
                <form onSubmit={handleSubmit} >
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="dir-name">Nama</Label>
                            <Input
                                id="dir-name"
                                name="name"
                                placeholder="Nama Direktori"
                                disabled={editDirectory.isPending}
                                defaultValue={defName} 
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="folder-description">Deskripsi <span className="text-sm text-neutral-400">(optional)</span></Label>
                            <Textarea
                                id="folder-description"
                                name="description"
                                placeholder="Deskripsi Direktori"
                                className="min-h-24"
                                disabled={editDirectory.isPending}
                                defaultValue={defDescription || ""} 
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="visibility-options">Visibilitas</Label>
                            <RadioGroup
                                defaultValue={visibility}
                                onValueChange={(value) => setVisibility(value as "private" | "public")}
                                className="flex w-full"
                                value={visibility}
                                id="visibility-options"
                                disabled={editDirectory.isPending}
                            >
                                <div className="flex items-center space-x-2 w-full">
                                    <RadioGroupItem value={"private"} id="option-private" hidden />
                                    <Label
                                        htmlFor="option-private"
                                        className={
                                            `h-full space-x-1 p-4 rounded-xl border-2 border-gray-200 w-full cursor-pointer ${visibility === "private" &&
                                            "bg-emerald-50 border-emerald-500"}`

                                        }
                                    >
                                        <Lock size={20} className={`${visibility === "private" && "text-emerald-600"}`} />
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium">Private</p>
                                            <p className="text-sm text-gray-500">
                                                Hanya dapat diakses oleh akun staff
                                            </p>
                                        </div>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 w-full">
                                    <RadioGroupItem value={"public"} id="option-public" hidden />
                                    <Label
                                        htmlFor="option-public"
                                        className={
                                            `h-full space-x-1 p-4 rounded-xl border-2 border-gray-200 w-full cursor-pointer ${visibility === "public" && "bg-emerald-50 border-emerald-500"}`
                                        }
                                    >
                                        <Eye size={20} className={`${visibility === "public" && "text-emerald-600"}`} />
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium">Public</p>
                                            <p className="text-sm text-gray-500">
                                                Dapat diakses oleh semua orang di internet
                                            </p>
                                        </div>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                    <DialogFooter className="mt-4 bg-amber">
                        <DialogClose asChild>
                            <Button variant="outline" disabled={editDirectory.isPending}>Batal</Button>
                        </DialogClose>
                        <Button disabled={editDirectory.isPending || !isChanged} type="submit">Buat Direktori</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
