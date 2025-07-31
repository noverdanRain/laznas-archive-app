import DocumentIcon from "@/components/common/document-Icon";
import { TooltipText } from "@/components/common/tooltip-text";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cidElipsis, formatDate } from "@/lib/utils";
import { Ellipsis, Eye, EyeOff, Folder } from "lucide-react";
import Link from "next/link";
import { getAllDocuments } from "@/lib/actions";

type PropsType = Awaited<ReturnType<typeof getAllDocuments>>[0];

export default function TableItem(props: PropsType) {
    const handleDoubleClick = () => {
        // Handle double click event, e.g., navigate to document details
        console.log("Document item double clicked");
    };
    return (
        <div
            className="col-span-6 grid items-center grid-cols-subgrid gap-2 px-6 py-1 border-t bg-white h-[72px] border-gray-200 cursor-default hover:bg-gray-50 transition duration-300 focus:bg-gray-200 select-none"
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
                    <p className="text-xs text-neutral-500">{`${cidElipsis(props.cid)}.${props.fileExt}`}</p>
                </div>
            </div>
            {/* Direktori */}
            <div className="flex items-center gap-2">
                <Folder size={18} className="text-amber-600 min-w-fit" />
                <Link href={"/"} className="line-clamp-1 hover:underline">
                    {props.directory?.name || "Tidak ada direktori"}
                </Link>
            </div>
            {/* Jenis Dokumen */}
            <p className="line-clamp-1">{props.documentType || "Tidak ada jenis dokumen"}</p>
            {/* Ditambahkan pada */}
            <p className="line-clamp-1 text-xs">{formatDate(props.createdAt)}</p>
            {/* Dilihat */}
            {
                props.isPrivate ? (
                    <div className="w-full flex items-center gap-1">
                        <EyeOff size={16} />
                        <p className="text-xs font-medium">Private</p>
                    </div>
                ) : (
                    <div className="w-full flex items-center gap-1">
                        <Eye size={16} />
                        <p>{props.viewsCount}</p>
                    </div>
                )
            }
            {/* Elipsis */}
            <OthersInfo {...props}>
                {/* <TooltipText text="Lainnya" bgColorTw="bg-gray-200 text-black"> */}
                <div className="w-fit p-1 flex items-center justify-center rounded-full mx-auto hover:bg-gray-200 cursor-pointer transition">
                    <Ellipsis size={18} />
                </div>
                {/* </TooltipText> */}
            </OthersInfo>
        </div>
    );
}

function OthersInfo({
    children,
    ...props
}: {
    children?: React.ReactNode;
} & PropsType) {
    return (
        <Popover modal={true}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                side="left"
                className="max-w-lg w-fit grid grid-cols-[140px_1fr] gap-4 text-sm py-4 bg-gray-50"
            >
                <div className="col-span-2">
                    <p className="font-medium">{props.title}</p>
                    {
                        props.description && (
                            <p className="text-xs text-neutral-500 mt-2">
                                {props.description}
                            </p>
                        )
                    }
                </div>
                <p className="text-neutral-500">No. Dokumen</p>
                <p>{props.documentNum || "-"}</p>
                <p className="text-neutral-500">Ditambahkan Oleh</p>
                <p>
                    Div.{props.createdBy.divisions}{" "}
                    <span className="text-neutral-500">({props.createdBy.username})</span>
                </p>
                <p className="text-neutral-500">Dimodifikasi pada</p>
                <p>{formatDate(props.updatedAt)}</p>
                <p className="text-neutral-500">Dimodifikasi oleh</p>
                <p>
                    Div.{props.updatedBy?.divisions}{" "}
                    <span className="text-neutral-500">({props.updatedBy?.username})</span>
                </p>
            </PopoverContent>
        </Popover>
    );
}