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
import { queryKey } from "@/lib/constants";
import { useGetDivisions } from "@/hooks/useGetDivisions";
import { useQueryClient } from "@tanstack/react-query";
import { AtSign, KeyRound, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { updateStaffById } from "@/lib/actions";

type InputValue = {
    username: string;
    divisionId: string;
    password: string;
    passwordConfirm?: string;
};
type DefaulValuesType = {
    username: string;
    divisionId: string;
};

export default function EditAccountDialog({
    children,
    defaultValues,
    id
}: {
    children?: React.ReactNode;
    defaultValues: DefaulValuesType;
    id: string;
}) {
    const queryClient = useQueryClient();
    const closeRef = useRef<HTMLButtonElement>(null);
    const [inputValue, setInputValue] = useState<InputValue>({
        username: defaultValues.username,
        divisionId: defaultValues.divisionId,
        password: "",
        passwordConfirm: "",
    });
    const [togglePassword, setTogglePassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { data: divisions } = useGetDivisions();


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "username") {
            if (value.length > 32) return;
            if (!/^[a-zA-Z0-9_]*$/.test(value)) return;
        }
        setInputValue((prev) => {
            return { ...prev, [name]: value } as InputValue;
        });
    };

    const handleSelectChange = (value: string) => {
        setInputValue((prev) => {
            return { ...prev, divisionId: value } as InputValue;
        });
    };

    const handleSubmit = async () => {
        if (validateInput(inputValue).validateMessage !== true) {
            toast.error(validateInput(inputValue).validateMessage as string);
            return;
        }
        try {
            setIsLoading(true);
            const result = await updateStaffById({
                id,
                username: inputValue.username,
                divisionId: inputValue.divisionId,
                password: inputValue.password ? inputValue.password : undefined
            });
            if (result.isSuccess) {
                toast.success("Berhasil mengubah akun staff");
                closeRef.current?.click();
                handleReset();
                queryClient.invalidateQueries({ queryKey: [queryKey.GET_ALL_STAFF] });
            }
            if (result.isRejected) {
                toast.error(result.reject?.message);
            }
        } catch (error) {
            toast.error("Gagal mengubah akun staff");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setInputValue({
            username: defaultValues.username,
            divisionId: defaultValues.divisionId,
            password: "",
            passwordConfirm: "",
        });
    };

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
                        <DialogTitle>Ubah Akun Staff</DialogTitle>
                        <DialogDescription>
                            Silakan isi form berikut untuk mengubah akun staff
                            yang sudah ada.
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
                            disabled={isLoading}
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
                            disabled={isLoading}
                        />
                    </div>
                    {
                        togglePassword && (
                            <>
                                <div className="grid grid-cols-1 gap-2">
                                    <Label htmlFor="add-account-password">
                                        Password Baru
                                    </Label>
                                    <InputWithIcon
                                        id="add-account-password"
                                        name="password"
                                        type="password"
                                        iconSize={14}
                                        lucideIcon={KeyRound}
                                        iconColor="#6a7282"
                                        placeholder="Masukan password baru"
                                        className="pl-8"
                                        onChange={handleInputChange}
                                        value={inputValue?.password}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    <Label htmlFor="add-account-password-confirm">
                                        Konfirmasi Password Baru
                                    </Label>
                                    <InputWithIcon
                                        id="add-account-password-confirm"
                                        name="passwordConfirm"
                                        type="password"
                                        iconSize={14}
                                        lucideIcon={KeyRound}
                                        iconColor="#6a7282"
                                        placeholder="Masukan kembali password baru"
                                        className="pl-8"
                                        onChange={handleInputChange}
                                        value={inputValue?.passwordConfirm}
                                        disabled={isLoading}
                                    />
                                </div>
                            </>
                        )
                    }
                    <Button
                        type="button"
                        variant={"ghost"}
                        size={"sm"}
                        className="text-red-500 w-fit text-xs"
                        onClick={() => {
                            setTogglePassword(!togglePassword)
                            setInputValue((prev) => ({
                                ...prev,
                                password: "",
                                passwordConfirm: "",
                            }))
                        }}
                    >
                        {togglePassword ? "Batalkan Ubah Password" : "Ubah Password"}
                    </Button>
                    <DialogFooter className="flex gap-2">
                        <DialogClose asChild>
                            <Button
                                ref={closeRef}
                                onClick={handleReset}
                                variant="outline"
                            >
                                Batal
                            </Button>
                        </DialogClose>
                        <Button onClick={handleSubmit}>Simpan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[10000]">
                    <div className="flex flex-col gap-2 items-center justify-center p-10 bg-white rounded-2xl shadow-lg">
                        <Loader2
                            size={40}
                            className="text-emerald-500 animate-spin"
                        />
                        <p>Menyimpan data...</p>
                    </div>
                </div>
            )}
        </>
    );
}

function validateInput(input: InputValue): {
    validateMessage?: string | boolean;
} {
    if (!input.username) return { validateMessage: "Lengkapi username" };
    if (input.username.length < 3)
        return { validateMessage: "Username minimal adalah 3 karakter." };
    if (input.username.length > 32)
        return {
            validateMessage: "Username tidak boleh lebih dari 32 karakter.",
        };
    if (!input.divisionId) return { validateMessage: "Pilih divisi" };

    if (input.password) {
        if (input.password.length < 6)
            return { validateMessage: "Password harus lebih dari 6 karakter." };
        if (!input.passwordConfirm)
            return { validateMessage: "Lengkapi konfirmasi password" };
        if (input.password !== input.passwordConfirm)
            return {
                validateMessage: "Password dan konfirmasi password tidak cocok.",
            };
    }


    return { validateMessage: true };
}
