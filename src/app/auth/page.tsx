"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { useTransition } from "react";

export default function AuthPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const login = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await fetch("/api/auth", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed");
            }
            return response.json();
        },
        onError: (error: Error) => {
            toast.error(error.message || "Terjadi kesalahan saat login");
        },
        onSuccess: () => {
            toast.success("Login berhasil");
            startTransition(() => {
                router.replace("/dashboard");
            });
        }
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        if (!username || !password) {
            toast.error("Mohon masukkan username dan password");
            return;
        }

        login.mutate(formData)
    }

    return (
        <div className="w-sm border-2 border-gray-200 rounded-2xl mx-auto p-10 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Image src={"/vrdn-laznas.svg"} alt="logo" width={88} height={50} className="mx-auto" />
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-10">
                <div className="grid w-full max-w-sm items-center gap-3">
                    <Label htmlFor="username">Username</Label>
                    <Input type="text" id="username" name="username" placeholder="Masukan Username" disabled={login.isPending || isPending} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" id="password" name="password" placeholder="Masukan Password" disabled={login.isPending || isPending} />
                </div>
                <Button type="submit" className="mt-4" disabled={login.isPending || isPending}>
                    {
                        login.isPending || isPending ?
                            <Loader className="animate-spin text-gray-200" /> :
                            "Masuk"
                    }
                </Button>
            </form>
        </div>
    )
}