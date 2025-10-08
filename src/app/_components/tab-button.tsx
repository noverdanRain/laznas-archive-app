"use client";

import { TooltipText } from "@/components/common/tooltip-text";
import { activePublicTabAtom } from "@/lib/atom";
import { cn } from "@/lib/utils";
import { atom, useAtom } from "jotai";

type TabName = "last-added" | "last-modified" | "directory";

export default function PublicHomeTabButton() {
    const [activeTab, setActiveTab] = useAtom(activePublicTabAtom);
    const handleTabChange = (tab: TabName) => {
        setActiveTab(tab);
    };

    return (
        <div className="flex items-center gap-1">
            <TooltipText text="Semua dokumen yang baru ditambahkan ke arsip">
                <ButtonTab
                    onClick={() => handleTabChange("last-added")}
                    isActive={activeTab === "last-added"}
                >
                    Terakhir ditambahkan
                </ButtonTab>
            </TooltipText>
            <TooltipText text="Dokumen yang terakhis kali diubah (file-nya)">
                <ButtonTab
                    onClick={() => handleTabChange("last-modified")}
                    isActive={activeTab === "last-modified"}
                >
                    Terakhir diubah
                </ButtonTab>
            </TooltipText>
            <TooltipText text="Dokumen yang ditambahkan oleh akun ini">
                <ButtonTab
                    onClick={() => handleTabChange("directory")}
                    isActive={activeTab === "directory"}
                >
                    Direktori
                </ButtonTab>
            </TooltipText>
        </div>
    );
}

function ButtonTab({
    children,
    isActive,
    ...props
}: {
    children: React.ReactNode;
    isActive?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={cn(
                "text-nowrap px-4 h-8 rounded-full cursor-pointer text-sm  transition-all duration-200",
                isActive ? "bg-gray-100 font-medium" : "text-gray-500 hover:bg-gray-100"
            )}
            {...props}
        >
            {children}
        </button>
    );
}
