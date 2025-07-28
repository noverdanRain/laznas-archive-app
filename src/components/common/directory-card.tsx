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
    ...props
}: {
    id: string;
    name: string;
    isPrivate?: boolean;
} & React.HTMLAttributes<HTMLDivElement>
) {

    const docsCount = useGetDocsCountInDirectory(id);

    return (
        <TooltipText text={name}>
            <div {...props} className="flex items-center w-full gap-4 p-5 bg-white rounded-2xl border border-gray-200 hover:bg-gray-100 transition cursor-pointer group relative">
                <MdiFolder
                    width={40}
                    height={40}
                    className="text-amber-400 group-hover:text-amber-500 transition"
                />
                <div className="grid grid-cols-1">
                    <h3 className="font-medium line-clamp-1">{name}</h3>
                    {
                        docsCount.isSuccess ? (
                            <p className="text-sm text-gray-500">{docsCount.data} Dokumen</p>
                        ) : (
                            <Skeleton className="h-[8px] w-[80px] rounded-full bg-gray-200 mt-1.5" />
                        )
                    }
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