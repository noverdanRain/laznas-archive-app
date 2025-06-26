"use client"

import { FileText, Folder, House, LogOut, PanelLeftOpen, Users } from "lucide-react";
import Image from "next/image";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Sidebar() {
    const router = useRouter();

    return (
        <aside className="h-screen w-16 pr-4 flex flex-col justify-between border-r-2 border-gray-200 border-dashed">
            {/* <div className="absolute top-0 left-24 h-full border-r-2 border-gray-200 border-dashed" /> */}
            <div>
                <Image
                    src="/logo-icon.png"
                    alt="Logo Laznas Al Irsyad Purwokerto"
                    width={48}
                    height={48}
                    className="h-20 object-contain"
                />
                <ButtonSidebar
                    tooltipText="Buka Sidebar"
                    className="mt-3 bg-white hover:bg-gray-100 active:bg-gray-200"
                >
                    <PanelLeftOpen size={22} />
                </ButtonSidebar>
                <nav className="mt-6 flex flex-col gap-6">
                    <ButtonSidebar
                        tooltipText="Beranda"
                        className="bg-emerald-600 text-white hover:bg-emerald-600"
                        onClick={()=>router.push("/dashboard")}
                    >
                        <House size={22} />
                    </ButtonSidebar>
                    <ButtonSidebar
                        tooltipText="Semua Dokumen"
                        onClick={()=>router.push("/dashboard/documents")}
                    >
                        <FileText size={22} />
                    </ButtonSidebar>
                    <ButtonSidebar
                        tooltipText="Direktori"
                        onClick={()=>router.push("/dashboard/directory")}
                    >
                        <Folder size={22} />
                    </ButtonSidebar>
                    <ButtonSidebar
                        tooltipText="Akun Staff"
                        onClick={()=>router.push("/dashboard/accounts")}
                    >
                        <Users size={22} />
                    </ButtonSidebar>
                </nav>
            </div>
            <ButtonSidebar
                tooltipText="Logout"
                className="mb-6"
                onClick={()=>alert("Woy")}
            >
                <LogOut size={20} />
            </ButtonSidebar>
        </aside>
    )
}

function ButtonSidebar(
    {
        children, className, tooltipText, onClick
    }:
        {
            children: React.ReactNode,
            className?: string,
            tooltipText: string,
            onClick?: () => void
        }
) {
    return (
        <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
                <button
                    className={
                        cn(
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
    )
}