"use client";

import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useAddDirectory } from "@/hooks/useAddDirectory";
import { useUserSession } from "@/hooks/useUserSession";
import { Eye, Lock } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function AddDirectoryDialog({
    children,
}: {
    children?: React.ReactNode;
}) {
    const [visibility, setVisibility] = useState<"private" | "public">("private");
    const { userSession } = useUserSession();
    const [isOpen, setIsOpen] = useState(false);

    const addDirectory = useAddDirectory({
        onSuccess: () => {
            setIsOpen(false);
            setVisibility("private");
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const isPrivate = visibility === "private"

        if (!userSession) {
            toast.error("Anda harus masuk sebagai staff untuk membuat direktori.");
            return;
        }

        if (!name) {
            toast.error("Nama direktori harus diisi");
            return;
        }

        addDirectory.mutate({
            name,
            description: description || null,
            isPrivate,
            divisionId: userSession?.divisionId,
        })
        toast.loading("Membuat direktori...", { id: "add-directory" });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                                disabled={addDirectory.isPending}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="folder-description">Deskripsi <span className="text-sm text-neutral-400">(optional)</span></Label>
                            <Textarea
                                id="folder-description"
                                name="description"
                                placeholder="Deskripsi Direktori"
                                className="min-h-24"
                                disabled={addDirectory.isPending}
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
                                disabled={addDirectory.isPending}
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
                            <Button variant="outline" disabled={addDirectory.isPending}>Batal</Button>
                        </DialogClose>
                        <Button disabled={addDirectory.isPending} type="submit">Buat Direktori</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
