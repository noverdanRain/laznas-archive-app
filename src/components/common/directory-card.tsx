"use client";

import { Lock } from "lucide-react";
import { MdiFolder } from "../ui/icon";
import { TooltipText } from "./tooltip-text";
import { useGetDocsCountInDirectory } from "@/hooks/useGetDocsCountAtDirectory";
import { Skeleton } from "../ui/skeleton";

export default function DirectoryCard({
    id,
    name,
    isPrivate,
    docsCount,
    ...props
}: {
    id: string;
    name: string;
    isPrivate?: boolean;
    docsCount: number;
} & React.HTMLAttributes<HTMLDivElement>
) {

    return (
        <TooltipText text={name}>
            <div {...props} className="flex items-center w-full gap-4 p-5 bg-white rounded-2xl border border-gray-200 hover:bg-gray-100 transition cursor-pointer group relative">
                <MdiFolder
                    width={48}
                    height={48}
                    className="text-amber-400 group-hover:text-amber-500 transition "
                />
                <div className="grid grid-cols-1 w-full">
                    <h3 className="font-medium line-clamp-1">{name}</h3>
                    <p className="text-sm text-gray-500">{docsCount} Dokumen</p>
                </div>
                {
                    isPrivate && (
                        <Lock size={16} className="absolute bottom-4 right-4 text-gray-400" />
                    )
                }
            </div>
        </TooltipText>
    );
}