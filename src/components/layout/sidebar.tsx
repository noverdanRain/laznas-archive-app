"use client";

import { FileText, Folder, House, Loader, LogOut, PanelLeftClose, PanelLeftOpen, Users } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { deleteSession } from "@/app/actions";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { useTransition } from "react";

export default function Sidebar() {
    const router = useRouter();

    return (
        <aside className="h-screen px-4 flex flex-col justify-between border-r-2 border-gray-200 border-dashed">
            <div>
                <div className="flex items-center justify-center h-20">
                    <Image
                        src="/logo-icon.png"
                        alt="Logo Laznas Al Irsyad Purwokerto"
                        width={48}
                        height={48}
                    />
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <ButtonSidebar
                            tooltipText="Buka Sidebar"
                            className="mt-3 bg-white hover:bg-gray-100 active:bg-gray-200"
                        >
                            <PanelLeftOpen size={22} />
                        </ButtonSidebar>
                    </SheetTrigger>
                    <SheetContent className="w-72 [&>button:last-child]:hidden" side="left" onOpenAutoFocus={(e) => e.preventDefault()}>
                        <SheetHeader className="h-20 ml-4 flex flex-row items-center justify-between">
                            <SheetTitle className="hidden">Sidebar</SheetTitle>
                            <Image
                                src="/logo-icon.png"
                                alt="Logo Laznas Al Irsyad Purwokerto"
                                width={48}
                                height={48}
                                className="h-20 object-contain"
                            />
                            <SheetClose asChild>
                                <ButtonSidebar
                                    tooltipText="Tutup Sidebar"
                                    className="bg-white hover:bg-gray-100 active:bg-gray-200"
                                >
                                    <PanelLeftClose size={22} />
                                </ButtonSidebar>
                            </SheetClose>
                        </SheetHeader>
                        <div>

                        </div>
                    </SheetContent>
                </Sheet>

                <nav className="mt-6 flex flex-col gap-6">
                    <ButtonSidebar
                        tooltipText="Beranda"
                        className="bg-emerald-600 text-white hover:bg-emerald-600"
                        onClick={() => router.push("/dashboard")}
                    >
                        <House size={22} />
                    </ButtonSidebar>
                    <ButtonSidebar
                        tooltipText="Semua Dokumen"
                        onClick={() => router.push("/dashboard/documents")}
                    >
                        <FileText size={22} />
                    </ButtonSidebar>
                    <ButtonSidebar
                        tooltipText="Direktori"
                        onClick={() => router.push("/dashboard/directory")}
                    >
                        <Folder size={22} />
                    </ButtonSidebar>
                    <ButtonSidebar
                        tooltipText="Akun Staff"
                        onClick={() => router.push("/dashboard/accounts")}
                    >
                        <Users size={22} />
                    </ButtonSidebar>
                </nav>
            </div>
            <AlertLogout />
        </aside>
    );
}

function ButtonSidebar({
    children,
    className,
    tooltipText,
    onClick,
}: {
    children: React.ReactNode;
    className?: string;
    tooltipText: string;
    onClick?: () => void;
}) {
    return (
        <Tooltip delayDuration={700}>
            <TooltipTrigger asChild>
                <button
                    className={cn(
                        `w-11 h-11 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition cursor-pointer`,
                        className
                    )}
                    onClick={onClick}
                >
                    {children}
                </button>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>{tooltipText}</p>
            </TooltipContent>
        </Tooltip>
    );
}

function AlertLogout() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        startTransition(() => {
            deleteSession()
                .then(() => {
                    router.replace("/auth");
                })
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
                        isPending ? <Loader className="animate-spin"/> : "Logout"
                        }
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
