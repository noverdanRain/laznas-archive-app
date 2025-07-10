"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { InputWithIcon } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectComponent } from "@/components/ui/select";
import { fetchGet } from "@/lib/fetch-function";
import { DivisionTypes } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { AtSign, KeyRound } from "lucide-react";

export default function AddAccountDialog({
    children,
}: {
    children?: React.ReactNode;
}) {
    const getDivisions = useQuery({
        queryKey: ["getDivisions"],
        queryFn: () => fetchGet<DivisionTypes[]>("/api/divisions"),
    });

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Tambah Akun Staff</DialogTitle>
                    <DialogDescription>
                        Silakan isi form berikut untuk menambahkan akun staff
                        baru.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="add-account-username">Username</Label>
                    <InputWithIcon
                        id="add-account-username"
                        name="username"
                        iconSize={14}
                        lucideIcon={AtSign}
                        iconColor="#6a7282"
                        placeholder="Username Staff"
                        className="pl-8"
                    />
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="add-account-division">Divisi</Label>
                    <SelectComponent
                        id="add-account-division"
                        className="w-full rounded-md border border-input shadow-xs bg-white"
                        placeholder="Pilih Divisi"
                        name="division"
                        items={getDivisions.data?.map((division) => ({
                            value: division.id,
                            label: division.name,
                        }))}
                    />
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="add-account-password">Password</Label>
                    <InputWithIcon
                        id="add-account-password"
                        name="password"
                        type="password"
                        iconSize={14}
                        lucideIcon={KeyRound}
                        iconColor="#6a7282"
                        placeholder="Masukan password"
                        className="pl-8"
                    />
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="add-account-password-confirm">
                        Konfirmasi Password
                    </Label>
                    <InputWithIcon
                        id="add-account-password-confirm"
                        name="password"
                        type="password"
                        iconSize={14}
                        lucideIcon={KeyRound}
                        iconColor="#6a7282"
                        placeholder="Masukan kembali password"
                        className="pl-8"
                    />
                </div>
                <DialogFooter className="flex gap-2">
                    <DialogClose asChild>
                        <Button data-slot="dialog-close" variant="outline">
                            Batal
                        </Button>
                    </DialogClose>
                    <Button>Simpan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
