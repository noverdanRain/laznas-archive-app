"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader, LogOut } from "lucide-react";
import { useTransition } from "react";
import ButtonSidebar from "./button-sidebar";
import { useLogout } from "@/hooks/useLogout";

export default function AlertLogout() {
    const [isPending, startTransition] = useTransition();

    const { logout } = useLogout();

    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        startTransition(() => {
            logout();
        });
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <ButtonSidebar
                    tooltipText="Logout"
                    className="mb-6"
                >
                    <LogOut size={20} />
                </ButtonSidebar>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-96">
                <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi</AlertDialogTitle>
                    <AlertDialogDescription>Apakah yakin untuk logout?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout} className="bg-rose-600 hover:bg-rose-700 w-20" disabled={isPending}>
                        {
                            isPending ? <Loader className="animate-spin" /> : "Logout"
                        }
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}