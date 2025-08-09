"use client";

import { ArrowUpRightFromSquare, EllipsisVertical, Lock, Pencil, Trash2 } from "lucide-react";
import { MdiFolder } from "../ui/icon";
import { TooltipText } from "./tooltip-text";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import { set } from "zod";
import { Button } from "../ui/button";
import { deleteDirectoryById } from "@/lib/actions";
import { toast } from "sonner";

export default function DirectoryCard({
    id,
    name,
    isPrivate,
    docsCount,
    isPublicPage = false,
    ...props
}: {
    id: string;
    name: string;
    isPrivate?: boolean;
    docsCount: number;
    isPublicPage?: boolean;
} & React.HTMLAttributes<HTMLDivElement>
) {

    const [popOverOpen, setPopoverOpen] = useState(false);

    const handleEipsis = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setPopoverOpen(!popOverOpen);
    }

    return (
        <>
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
                            <Lock size={14} className="absolute top-2 right-2 text-gray-300" />
                        )
                    }
                    {
                        !isPublicPage && (
                            <MyPopOver
                                open={popOverOpen}
                                onOpenChange={setPopoverOpen}
                                name={name}
                                id={id}
                            >
                                <button onClick={handleEipsis} className="p-1 cursor-pointer">
                                    <EllipsisVertical size={16} className="text-gray-500" />
                                </button>
                            </MyPopOver>
                        )
                    }
                </div>
            </TooltipText>

        </>
    );
}

function MyPopOver(
    { open, onOpenChange, children, name, id }: {
        open: boolean;
        onOpenChange: (open: boolean) => void;
        children: React.ReactNode;
        name: string;
        id: string;
    }
) {
const handleDelete = async ()=>{
    try {
        toast.loading("Menghapus direktori...", {id: "delete-directory" });
        const deleted = await deleteDirectoryById(id)
        if(deleted.isSuccess) {
            toast.success("Direktori berhasil dihapus", {id: "delete-directory" });
        } else {
            toast.error("Gagal menghapus direktori", {id: "delete-directory" });
        }
        onOpenChange(false);

    } catch (error) {   
        console.error("Failed to delete directory:", error);
        toast.error("Gagal menghapus direktori", {id: "delete-directory" });
    }
}

    return (
        <Popover open={open} onOpenChange={onOpenChange} modal={true}>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent onClick={(e) => e.stopPropagation()} className="w-48 p-2">
                <div className="flex items-start justify-between gap-2">
                    <h1>{name}</h1>
                    <Button variant={"outline"}>
                        <ArrowUpRightFromSquare />
                    </Button>
                </div>
                <Button onClick={handleDelete} variant={"outline"}>
                    <Trash2 />
                </Button>
                <Button className="ml-2" variant={"outline"}>
                    <Pencil />
                </Button>
            </PopoverContent>
        </Popover>
    );
}