import { Lock } from "lucide-react";
import { MdiFolder } from "../ui/icon";
import { TooltipText } from "./tooltip-text";

export default function DirectoryCard({
    name,
    documentsCount = 10,
    isPrivate,
    ...props
}: {
    name: string;
    documentsCount: number;
    isPrivate?: boolean;
} & React.HTMLAttributes<HTMLDivElement>
) {
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
                    <p className="text-sm text-gray-500">{documentsCount} Dokumen</p>
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