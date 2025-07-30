'use client';

import { TooltipText } from "@/components/common/tooltip-text";
import { Input } from "@/components/ui/input";
import { ListFilter } from "lucide-react";
import { useState } from "react";
import { Icon } from "@iconify-icon/react";

export default function TableHeader() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    return (
        <header className="grid grid-cols-[6fr_3.2fr_2fr_3fr_1fr_1fr] gap-x-4 bg-white rounded-t-2xl border border-gray-200 text-sm sticky top-[164px] z-30 transition-all duration-300">
            <div className="col-span-6 grid items-center grid-cols-subgrid gap-2 px-6 py-5 cursor-default sticky top-0 z-50">
                <p className="font-medium text-neutral-500">Dokumen</p>
                <p className="font-medium text-neutral-500">Direktori</p>
                <p className="font-medium text-neutral-500">
                    Jenis Dokumen
                </p>
                <p className="font-medium text-neutral-500">
                    Ditambahkan pada
                </p>
                <p className="font-medium text-neutral-500">Dilihat</p>
                <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="font-medium  flex items-center justify-center cursor-pointer hover:text-neutral-500"
                >
                    <TooltipText
                        delay={300}
                        text="Urutkan"
                        bgColorTw="bg-gray-200 text-black"
                    >
                        <ListFilter size={15} strokeWidth={2} />
                    </TooltipText>
                </button>
            </div>
        </header>
    );
}