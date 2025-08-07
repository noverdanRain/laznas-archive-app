import DocumentIcon from "@/components/common/document-Icon";
import { TooltipText } from "@/components/common/tooltip-text";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cidElipsis, cn, downloadFileFromURI, formatDate } from "@/lib/utils";
import { ArrowDownToLine, Ellipsis, Eye, EyeOff, Folder, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { deleteDocumentById, getAllDocuments, pinataPrivateFile, pinataPublicFile } from "@/lib/actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "nextjs-toploader/app";
import EditDocumentDialog from "../edit-document-dialog";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { lastAddedTabHome_queryKey } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";
import { documentsPage_useGetDocumentsKey } from "@/lib/constants";

type PropsType = Awaited<ReturnType<typeof getAllDocuments>>["list"][0];

export default function TableItem(props: PropsType) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [elipsisOpen, setEllipsisOpen] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);

    const handleDownload = async () => {
        const uri = props.isPrivate ? await pinataPrivateFile(props.cid) : await pinataPublicFile(props.cid);
        await downloadFileFromURI(uri, props.title);
    }

    const handleDelete = async () => {
        setEllipsisOpen(false);
        try {
            toast.loading("Menghapus dokumen...", { id: "delete-doc" });
            const result = await deleteDocumentById({ id: props.id });
            if (result.isRejected) {
                toast.error(result.reject?.message, { id: "delete-doc" });
                return;
            }
            queryClient.invalidateQueries({ queryKey: documentsPage_useGetDocumentsKey });
            queryClient.invalidateQueries({ queryKey: lastAddedTabHome_queryKey });
            toast.success("Dokumen berhasil dihapus.", { id: "delete-doc" });
        } catch (error) {
            toast.error("Gagal menghapus dokumen.", { id: "delete-doc" });
            return;
        }
    }

    const handleDoubleClick = () => {
        router.push(`/app/documents/${props.id}`);
    };
    return (
        <div
            className={cn(
                "col-span-6 grid items-center grid-cols-subgrid gap-2 px-6 py-1 border-t bg-white h-[72px] border-gray-200 cursor-default hover:bg-gray-50 transition duration-300 focus:bg-gray-200 select-none",
                elipsisOpen && "bg-gray-200"
            )}
            tabIndex={0}
            onDoubleClick={handleDoubleClick}
        >
            {/* Dokumen */}
            <div className="flex items-center gap-2">
                <DocumentIcon type={props.fileExt} />
                <div>
                    <TooltipText
                        delay={200}
                        text={props.title}
                        bgColorTw="bg-gray-200 text-black"
                    >
                        <p className="text-sm font-medium line-clamp-1 hover:text-neutral-600">
                            {props.title}
                        </p>
                    </TooltipText>
                    <p className="text-xs text-neutral-500">{`${cidElipsis(
                        props.cid
                    )}.${props.fileExt}`}</p>
                </div>
            </div>
            {/* Direktori */}
            <div className="flex items-center gap-2">
                <Folder size={18} className="text-amber-600 min-w-fit" />
                <Link href={`/app/directories/${props.directory?.id}`} className="line-clamp-1 hover:underline">
                    {props.directory?.name || "Tidak ada direktori"}
                </Link>
            </div>
            {/* Jenis Dokumen */}
            <p className="line-clamp-1">
                {props.documentType || "Tidak ada jenis dokumen"}
            </p>
            {/* Ditambahkan pada */}
            <p className="line-clamp-1 text-xs">
                {formatDate(props.createdAt)}
            </p>
            {/* Dilihat */}
            {props.isPrivate ? (
                <div className="w-full flex items-center gap-1">
                    <EyeOff size={16} />
                    <p className="text-xs font-medium">Private</p>
                </div>
            ) : (
                <div className="w-full flex items-center gap-1">
                    <Eye size={16} />
                    <p>{props.viewsCount}</p>
                </div>
            )}
            {/* Elipsis */}
            <OthersInfo
                open={elipsisOpen}
                onOpenChange={setEllipsisOpen}
                onEdit={() => setOpenEditDialog(true)}
                onDownload={handleDownload}
                onDelete={() => setOpenAlert(true)}
                {...props}
            >
                <div
                    onClick={() => setEllipsisOpen(!elipsisOpen)}
                    className="w-fit p-1 flex items-center justify-center rounded-full mx-auto hover:bg-gray-200 cursor-pointer transition"
                >
                    <Ellipsis size={18} />
                </div>
            </OthersInfo>
            <EditDocumentDialog
                defaultFile={`${props.cid}.${props.fileExt}`}
                open={openEditDialog}
                onOpenChange={setOpenEditDialog}
                defaultValues={props}
            />
            <AlertDialogComponent
                open={openAlert}
                onOpenChange={setOpenAlert}
                title="Hapus Dokumen"
                description={`Apakah Anda yakin ingin menghapus dokumen "${props.title}"?`}
                onConfirm={handleDelete}
            />
        </div>
    );
}


function OthersInfo({
    open,
    onOpenChange,
    children,
    onEdit,
    onDelete,
    onDownload,
    ...props
}: {
    open?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onDownload?: () => void;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
} & PropsType) {
    return (
        <Popover open={open} onOpenChange={onOpenChange} modal={true}>
            <TooltipText text="Lainnya" bgColorTw="bg-gray-200 text-black">
                <PopoverTrigger asChild>
                    {children}
                </PopoverTrigger>
            </TooltipText>
            <PopoverContent
                side="left"
                className="max-w-lg w-fit grid grid-cols-[140px_1fr] gap-4 text-sm py-4 bg-gray-50"
            >
                <div className="col-span-2">
                    <p className="font-medium">{props.title}</p>
                    {props.description && (
                        <p className="text-xs text-neutral-500 mt-2">
                            {props.description}
                        </p>
                    )}
                </div>
                <p className="text-neutral-500">No. Dokumen</p>
                <p>{props.documentNum || "-"}</p>
                <p className="text-neutral-500">Ditambahkan Oleh</p>
                <p>
                    Div.{props.createdBy.divisions}{" "}
                    <span className="text-neutral-500">
                        ({props.createdBy.username})
                    </span>
                </p>
                <p className="text-neutral-500">Dimodifikasi pada</p>
                <p>{formatDate(props.updatedAt)}</p>
                <p className="text-neutral-500">Dimodifikasi oleh</p>
                <p>
                    Div.{props.updatedBy?.divisions}{" "}
                    <span className="text-neutral-500">
                        ({props.updatedBy?.username})
                    </span>
                </p>
                <div className="col-span-2 flex items-center gap-2 justify-end">

                    <Button onClick={onDownload} variant={"outline"} size={"icon"} className="bg-transparent">
                        <ArrowDownToLine />
                    </Button>
                    <Separator orientation="vertical" />
                    <TooltipText text="Edit">
                        <Button onClick={() => {
                            onEdit?.();
                            onOpenChange?.(false);
                        }}
                            variant={"outline"} size={"icon"} className="bg-transparent" >
                            <Pencil />
                        </Button>
                    </TooltipText>
                    <TooltipText text="Hapus Dokumen">
                        <Button onClick={onDelete} variant={"outline"} size={"icon"} className="bg-transparent text-red-600 hover:bg-red-50 hover:text-red-600">
                            <Trash />
                        </Button>
                    </TooltipText>
                </div>
            </PopoverContent>
        </Popover>
    );
}