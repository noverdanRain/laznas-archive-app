'use client';

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ButtonSidebar from "./button-sidebar";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import Image from "next/image";

export default function SidebarSheet() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <ButtonSidebar
                    tooltipText="Buka Sidebar"
                    className=" mt-3 bg-white hover:bg-gray-100 active:bg-gray-200"
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
    )
}