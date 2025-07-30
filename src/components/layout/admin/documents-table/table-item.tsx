import DocumentIcon from "@/components/common/document-Icon";
import { TooltipText } from "@/components/common/tooltip-text";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Ellipsis, Eye, Folder } from "lucide-react";
import Link from "next/link";

export default function TableItem() {
    const handleDoubleClick = () => {
        // Handle double click event, e.g., navigate to document details
        console.log("Document item double clicked");
    };
    return (
        <div
            className="col-span-6 grid items-center grid-cols-subgrid gap-2 px-6 py-4 border-t border-gray-200 cursor-default hover:bg-gray-50 transition duration-300 focus:bg-gray-200 select-none"
            tabIndex={0}
            onDoubleClick={handleDoubleClick}
        >
            {/* Dokumen */}
            <div className="flex items-center gap-2">
                <DocumentIcon type={"pdf"} />
                <div>
                    <TooltipText
                        delay={200}
                        text={"Dokumen Zakat Fitrah 2023"}
                        bgColorTw="bg-gray-200 text-black"
                    >
                        <p className="text-sm font-medium line-clamp-1 hover:text-neutral-600">
                            {"Dokumen Zakat Fitrah 2023"}
                        </p>
                    </TooltipText>
                    <p className="text-xs text-neutral-500">{"bafkr....uapjm.pdf"}</p>
                </div>
            </div>
            {/* Direktori */}
            <div className="flex items-center gap-2">
                <Folder size={18} className="text-amber-600 min-w-fit" />
                <Link href={"/"} className="line-clamp-1 hover:underline">
                    {"Surat Masuk"}
                </Link>
            </div>
            {/* Jenis Dokumen */}
            <p className="line-clamp-1">{"Surat"}</p>
            {/* Ditambahkan pada */}
            <p className="line-clamp-1 text-xs">{"12 Jun 2025, 10:23 WIB"}</p>
            {/* Dilihat */}
            <div className="flex items-center gap-1">
                <Eye size={16} />
                <p>{"131"}</p>
            </div>
            {/* Elipsis */}
            <OthersInfo title={"Informasi Dokumen"}>
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
    title,
}: {
    children?: React.ReactNode;
    title: string;
}) {
    return (
        <Popover modal={true}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                side="left"
                className="max-w-lg w-fit grid grid-cols-[140px_1fr] gap-4 text-sm py-4 bg-gray-50"
            >
                <div className="col-span-2">
                    <p className="font-medium">{title}</p>
                    <p className="text-neutral-500 mt-1 line-clamp-3">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Fugit animi facere ex recusandae quidem modi
                        explicabo neque, voluptatem itaque, suscipit in quae hic
                        possimus qui dolore eaque amet officia expedita. Lorem
                        ipsum, dolor sit amet consectetur adipisicing elit.
                        Dignissimos consectetur cupiditate dolorem nam nostrum
                        possimus distinctio vel perspiciatis dolorum provident
                        enim natus nemo sequi eligendi nobis ipsum, itaque
                        quidem optio!
                    </p>
                </div>
                <p className="text-neutral-500">No. Dokumen</p>
                <p>090725-8401</p>
                <p className="text-neutral-500">Ditambahkan Oleh</p>
                <p>
                    Div. Kelembagaan{" "}
                    <span className="text-neutral-500">(nur)</span>
                </p>
                <p className="text-neutral-500">Berkas diubah pada</p>
                <p>24 Jun 2025, 10:31 WIB</p>
                <p className="text-neutral-500">Diubah oleh</p>
                <p>
                    Div. Fundraising{" "}
                    <span className="text-neutral-500">(budi)</span>
                </p>
            </PopoverContent>
        </Popover>
    );
}