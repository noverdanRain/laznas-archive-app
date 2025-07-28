"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { InputWithIcon } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectComponent } from "@/components/ui/select";
import { queryKey } from "@/constants";
import { useAddStaff } from "@/hooks/useAddStaff";
import { useGetDivisions } from "@/hooks/useGetDivisions";
import { useQueryClient } from "@tanstack/react-query";
import { AtSign, KeyRound, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type InputValue = {
    username: string;
    divisionId: string;
    password: string;
    passwordConfirm?: string;
}

export default function AddAccountDialog({ children, }: { children?: React.ReactNode }) {

    const queryClient = useQueryClient();
    const closeRef = useRef<HTMLButtonElement>(null);
    const [inputValue, setInputValue] = useState<InputValue>({
        username: "",
        divisionId: "",
        password: "",
        passwordConfirm: "",
    })

    const { data: divisions } = useGetDivisions();

    const addStaff = useAddStaff({
        onSuccess: () => {
            closeRef.current?.click();
            queryClient.invalidateQueries({ queryKey: [queryKey.GET_ALL_STAFF] });
            toast.success("Berhasil Menambahkan Akun");
            handleReset();
        }
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "username") {
            if (value.length > 32) return;
            if (!/^[a-zA-Z0-9_]*$/.test(value)) return;
        }
        setInputValue((prev) => {
            return { ...prev, [name]: value } as InputValue;
        })
    };

    const handleSelectChange = (value: string) => {
        setInputValue((prev) => {
            return { ...prev, divisionId: value } as InputValue;
        });
    }

    const handleSubmit = () => {
        if (validateInput(inputValue).validateMessage !== true) {
            toast.error(validateInput(inputValue).validateMessage as string);
            return;
        }
        addStaff.mutate({
            username: inputValue.username,
            password: inputValue.password,
            divisionId: inputValue.divisionId,
        });
    }

    const handleReset = () => {
        setInputValue({
            username: "",
            divisionId: "",
            password: "",
            passwordConfirm: "",
        });
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onInteractOutside={(e) => e.preventDefault()}
                    className="w-lg"
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
                            onChange={handleInputChange}
                            value={inputValue?.username}
                            disabled={addStaff.isPending}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="add-account-division">Divisi</Label>
                        <SelectComponent
                            id="add-account-division"
                            className="w-full rounded-md border border-input shadow-xs bg-white"
                            placeholder="Pilih Divisi"
                            name="divisionId"
                            onValueChange={handleSelectChange}
                            value={inputValue?.divisionId}
                            items={divisions?.map((division) => ({
                                value: division.id,
                                label: division.name,
                            }))}
                            disabled={addStaff.isPending}
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
                            onChange={handleInputChange}
                            value={inputValue?.password}
                            disabled={addStaff.isPending}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="add-account-password-confirm">
                            Konfirmasi Password
                        </Label>
                        <InputWithIcon
                            id="add-account-password-confirm"
                            name="passwordConfirm"
                            type="password"
                            iconSize={14}
                            lucideIcon={KeyRound}
                            iconColor="#6a7282"
                            placeholder="Masukan kembali password"
                            className="pl-8"
                            onChange={handleInputChange}
                            value={inputValue?.passwordConfirm}
                            disabled={addStaff.isPending}
                        />
                    </div>
                    <DialogFooter className="flex gap-2">
                        <Button onClick={handleReset} variant={"ghost"} className="mr-auto">Reset</Button>
                        <DialogClose asChild>
                            <Button ref={closeRef} onClick={handleReset} variant="outline">
                                Batal
                            </Button>
                        </DialogClose>
                        <Button onClick={handleSubmit}>Simpan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {
                addStaff.isPending &&
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[10000]">
                    <div className="flex flex-col gap-2 items-center justify-center p-10 bg-white rounded-2xl shadow-lg">
                        <Loader2 size={40} className="text-emerald-500 animate-spin" />
                        <p>Menyimpan data...</p>
                    </div>
                </div>
            }
        </>

    );
}

function validateInput(input: InputValue): { validateMessage?: string | boolean } {
    if (!input.username) return { validateMessage: "Lengkapi username" };
    if (input.username.length < 3) return { validateMessage: "Username minimal adalah 3 karakter." };
    if (input.username.length > 32) return { validateMessage: "Username tidak boleh lebih dari 32 karakter." };
    if (!input.divisionId) return { validateMessage: "Pilih divisi" };
    if (!input.password) return { validateMessage: "Lengkapi password" };
    if (input.password.length < 6) return { validateMessage: "Password harus lebih dari 6 karakter." };
    if (!input.passwordConfirm) return { validateMessage: "Lengkapi konfirmasi password" };
    if (input.password !== input.passwordConfirm) return { validateMessage: "Password dan konfirmasi password tidak cocok." };

    return { validateMessage: true };
}