"use client";

import { ArrowUpRightFromSquare, EllipsisVertical, EyeClosed, EyeOff, Lock, Pencil, Trash2 } from "lucide-react";
import { MdiFolder } from "../ui/icon";
import { TooltipText } from "./tooltip-text";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import { set } from "zod";
import { Button } from "../ui/button";
import { deleteDirectoryById } from "@/lib/actions";
import { toast } from "sonner";
import { useGetDirectories } from "@/hooks/useGetDirectories";
import { AlertDialogComponent } from "../ui/alert-dialog";
import EditDirectoryDialog from "@/app/(admin)/app/directories/_components/dialog-edit-directory";
import { useUserSession } from "@/hooks/useUserSession";

export default function DirectoryCard({
    id,
    name,
    isPrivate,
    docsCount,
    isPublicPage = false,
    divisionId,
    divisionName,
    ...props
}: {
    id: string;
    name: string;
    description?: string;
    isPrivate?: boolean;
    docsCount: number;
    isPublicPage?: boolean;
    divisionId?: string | null;
    divisionName?: string | null;
} & React.HTMLAttributes<HTMLDivElement>
) {

    const [popOverOpen, setPopoverOpen] = useState(false);
    const { userSession, ...getUserSession } = useUserSession();

    const isHavePermission = userSession?.divisionId === divisionId || userSession?.role === "administrator";
    const handleEipsis = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setPopoverOpen(!popOverOpen);
    }

    return (
        <>
            <TooltipText text={name}>
                <div {...props} className="flex items-center w-full gap-4 py-3 px-5 bg-white rounded-2xl border border-gray-200 hover:bg-gray-100 transition cursor-pointer group relative">
                    <div className="relative flex items-center justify-center">
                        <MdiFolder
                            width={40}
                            height={40}
                            className="text-amber-400 group-hover:text-amber-500 transition "
                        />
                        {
                            isPrivate && (
                                <EyeOff strokeWidth={2.5} size={14} className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 text-white" />
                            )
                        }
                    </div>
                    <div className="grid grid-cols-1 w-full">
                        <h3 className="font-medium line-clamp-1">{name}</h3>
                        <p className="text-sm text-gray-500">{docsCount} Dokumen</p>
                    </div>
                    {
                        !isHavePermission && (
                            <Lock size={14} className="absolute top-2 right-2 text-red-400" />
                        )
                    }
                    {
                        !isPublicPage && (
                            <MyPopOver
                                open={popOverOpen}
                                onOpenChange={setPopoverOpen}
                                name={name}
                                description={props.description}
                                isPrivate={isPrivate}
                                id={id}
                                divisionName={divisionName}
                                isHavePermission={isHavePermission}
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
    { open, onOpenChange, children, name, id, description, isPrivate, divisionName, isHavePermission }: {
        open: boolean;
        onOpenChange: (open: boolean) => void;
        children: React.ReactNode;
        name: string;
        description?: string;
        id: string;
        isPrivate?: boolean;
        divisionName?: string | null;
        isHavePermission?: boolean;
    }
) {
    const { invalidate } = useGetDirectories();
    const [alertDelete, setAlertDelete] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const handleOpenEditDialog = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        if (!isHavePermission) {
            toast.error("Anda tidak memiliki izin untuk mengedit direktori ini. (berbeda divisi)");
            return;
        }
        setOpenEditDialog(true);
    };

    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        if (!isHavePermission) {
            toast.error("Anda tidak memiliki izin untuk menghapus direktori ini. (berbeda divisi)");
            return;
        }
        setAlertDelete(true);
    }
    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        try {
            toast.loading("Menghapus direktori...", { id: "delete-directory" });
            const deleted = await deleteDirectoryById(id)
            if (deleted.isSuccess) {
                toast.success("Direktori berhasil dihapus", { id: "delete-directory" });
                invalidate();
            } else {
                toast.error("Gagal menghapus direktori", { id: "delete-directory" });
            }
            setAlertDelete(false);
            onOpenChange(false);

        } catch (error) {
            console.error("Failed to delete directory:", error);
            toast.error("Gagal menghapus direktori", { id: "delete-directory" });
        }
    }

    return (
        <>
            <Popover open={open} onOpenChange={onOpenChange} modal={true}>
                <PopoverTrigger asChild>
                    {children}
                </PopoverTrigger>
                <PopoverContent onClick={(e) => e.stopPropagation()} className="min-w-48 max-w-sm p-2">
                    <div className="flex items-center justify-between gap-2">
                        <h1>{name} <span className="text-gray-500 text-sm">(Div. {divisionName})</span></h1>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3 mt-2">{description}</p>
                    <Button onClick={handleDeleteClick} variant={"outline"}>
                        <Trash2 />
                    </Button>
                    <Button onClick={handleOpenEditDialog} className="ml-2" variant={"outline"}>
                        <Pencil />
                    </Button>
                </PopoverContent>
            </Popover>
            <EditDirectoryDialog
                open={openEditDialog}
                onOpenChange={setOpenEditDialog}
                defName={name}
                defIsPrivate={isPrivate || false}
                defDescription={description || ""}
                id={id}
            />
            <AlertDialogComponent
                open={alertDelete}
                onOpenChange={setAlertDelete}
                title={`Hapus Direktori "${name}"`}
                description="Apakah Anda yakin ingin menghapus direktori ini?, semua dokumen di dalamnya akan ikut terhapus."
                onConfirm={(e) => handleDelete(e)}
                danger
            />
        </>
    );
}