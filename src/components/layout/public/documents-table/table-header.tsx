'use client';

import { TooltipText } from "@/components/common/tooltip-text";
import { ListFilter } from "lucide-react";
import { useState } from "react";

export default function TableHeader() {
    return (
        <header className="grid grid-cols-[5fr_3fr_2.5fr_2fr_0.9fr_0.6fr] gap-x-4 bg-white rounded-t-2xl border border-gray-200 text-sm transition-all duration-300">
            <div className="col-span-6 grid items-center grid-cols-subgrid gap-2 px-6 py-5 cursor-default">
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
                    className="font-medium invisible flex items-center justify-center cursor-pointer hover:text-neutral-500"
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