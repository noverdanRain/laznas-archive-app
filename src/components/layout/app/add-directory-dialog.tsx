"use client";

import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { queryKey } from "@/constants";
import { DirectoryTypes } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef } from "react";
import { toast } from "sonner";

export default function AddDirectoryDialog({
    children,
}: {
    children?: React.ReactNode;
}) {
    const queryClient = useQueryClient();
    const closeRef = useRef<HTMLButtonElement>(null);

    const addDirectories = useMutation({
        mutationFn: (data: DirectoryTypes) => axios.post("/api/directories", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKey.GET_ALL_DIRECTORIES });
            closeRef.current?.click();
            toast.success("Direktori berhasil dibuat", { id: "add-directory" });
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.message || "Gagal membuat direktori", { id: "add-directory" });
            } else {
                toast.error("Terjadi kesalahan saat membuat direktori", { id: "add-directory" });
            }
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const isPrivate = formData.get("isPrivate") === "on";

        if (!name) {
            toast.error("Nama direktori harus diisi");
            return;
        }

        addDirectories.mutate({
            name,
            description: description || "",
            isPrivate,
        })
        toast.loading("Membuat direktori...", { id: "add-directory" });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children || (
                    <Button className="rounded-full">
                        Buat Direktori Baru
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                className=""
            >
                <AlertDialogHeader>
                    <DialogTitle>Buat Direktori Baru</DialogTitle>
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
                                disabled={addDirectories.isPending}
                            />
                        </div>
                        <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-emerald-600 has-[[aria-checked=true]]:bg-emerald-50">
                            <Checkbox
                                id="toggle-private"
                                name="isPrivate"
                                className="data-[state=checked]:border-emerald-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white"
                                disabled={addDirectories.isPending}
                            />
                            <div className="grid gap-1.5 font-normal">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm leading-none font-medium">
                                        Buat Direktori Privat
                                    </p>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                    Jika tidak dicentang, direktori ini akan bersifat publik dan dapat diakses oleh semua orang.
                                </p>
                            </div>
                        </Label>
                        <div className="grid gap-3">
                            <Label htmlFor="folder-description">Deskripsi <span className="text-sm text-neutral-400">(optional)</span></Label>
                            <Textarea
                                id="folder-description"
                                name="description"
                                placeholder="Deskripsi Direktori"
                                className="min-h-24"
                                disabled={addDirectories.isPending}
                            />
                        </div>

                    </div>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button ref={closeRef} variant="outline">Batal</Button>
                        </DialogClose>
                        <Button disabled={addDirectories.isPending} type="submit">Buat Direktori</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
