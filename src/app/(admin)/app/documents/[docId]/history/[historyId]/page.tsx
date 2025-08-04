import DocumentIcon from "@/components/common/document-Icon";
import { TooltipText } from "@/components/common/tooltip-text";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getDocumentHistoryById } from "@/lib/actions";
import { cidElipsis, formatDate } from "@/lib/utils";
import { ArrowDownToLine, Copy, Folder, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type Params = Promise<{ historyId: string }>;
type HistoryType = Awaited<ReturnType<typeof getDocumentHistoryById>>;

export default async function DetailsHistoryPage(props: { params: Params }) {
    const { historyId } = await props.params;
    let historyData: HistoryType = null;
    try {
        historyData = await getDocumentHistoryById({ id: historyId });
    } catch (error) {
        toast.error("Gagal mengambil data histori dokumen");
    }

    if (!historyData) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] gap-2">
                <Folder className="text-gray-400" size={30} />
                <h3 className="text-gray-400 font-medium">
                    Histori tidak ditemukan
                </h3>
            </div>
        );
    }

    return (
        <div className="p-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/app">Beranda</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/app/documents">
                            Dokumen
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/app/documents/${historyData.documentId}`}>
                            Detail Dokumen
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>Histori</BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem className="max-w-lg">
                        <BreadcrumbPage className="line-clamp-1">
                            {historyData.changeNotes}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="grid grid-cols-[1.1fr_2fr] gap-6 mt-6">
                <FileSection historyData={historyData} />
                <div className="w-full">
                    <h1 className="font-semibold text-xl">
                        {historyData.title}
                    </h1>
                    <p className="mt-2 text-neutral-600">
                        {historyData.description}
                    </p>
                    <div className="grid grid-cols-[1fr_2.5fr] gap-4 mt-4 border p-4 border-gray-200 rounded-xl text-sm">
                        <p className="text-neutral-500">No. Dokumen</p>
                        <p>{historyData.documentNum || "-"}</p>

                        <p className="text-neutral-500">CID</p>
                        <div className="flex items-center gap-2">
                            <button>
                                <Copy size={12} />
                            </button>
                            <p className="line-clamp-1 text-ellipsis">{historyData.cid}</p>
                        </div>

                        <p className="text-neutral-500">Direktori</p>
                        <Link
                            href={`/app/directories/${historyData.directoryId}`}
                            className="flex items-center gap-2 hover:underline"
                        >
                            <Folder
                                className="fill-amber-500 text-transparent"
                                size={16}
                            />
                            <p className="line-clamp-1">
                                {historyData.directoryName}
                            </p>
                        </Link>

                        <p className="text-neutral-500">Diubah pada</p>
                        <p>{formatDate(historyData.dateChanged)}</p>

                        <p className="text-neutral-500">Diubah oleh</p>
                        <p className="line-clamp-1">
                            Div. {historyData.updatedBy.divisions}{" "}
                            <span className="text-xs text-neutral-500">
                                ({historyData.updatedBy.username})
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FileSection({ historyData }: { historyData: HistoryType }) {
    return (
        <section>
            <div className="w-full h-72 border border-gray-200 rounded-xl overflow-hidden relative">
                <div className="flex justify-between items-center p-4 gap-4">
                    <p className="text-sm">File</p>
                    <TooltipText text="Unduh Dokumen">
                        <button className="cursor-pointer hover:text-emerald-600 transition-colors ml-auto">
                            <ArrowDownToLine size={18} />
                        </button>
                    </TooltipText>
                    <TooltipText text="Buka dokumen di Tab Baru">
                        <button className="cursor-pointer hover:text-emerald-600 transition-colors">
                            <SquareArrowOutUpRight size={16} />
                        </button>
                    </TooltipText>
                </div>
                <div className="w-[calc(100%+2px)] h-[calc(100%-3rem)] border border-gray-200 rounded-t-[20px] absolute -left-[1px] -bottom-0.5 bg-white overflow-hidden">
                    <div className="h-[calc(100%-4.5rem)] w-full flex items-center justify-center text-gray-400 ">
                        <div className="flex flex-col items-center justify-center gap-1">
                            <DocumentIcon
                                size={30}
                                className="text-gray-300"
                                type={historyData?.fileExt || ""}
                            />
                            <p>Tidak ada preview</p>
                        </div>
                    </div>
                    <div className="flex items-center mt-auto p-4 gap-2 bg-white shadow-[0px_-26px_50px_-2px_rgba(0,_0,_0,_0.08)] border-t border-gray-200">
                        <DocumentIcon type="pdf" />
                        <div className="w-full flex flex-col">
                            <p className="text-sm line-clamp-1">
                                {historyData?.title || "Tidak ada judul"}
                            </p>
                            <Link
                                href={"#"}
                                className="text-xs text-gray-500 hover:underline"
                            >
                                {cidElipsis(historyData?.cid || "", 10, 10)}.
                                {historyData?.fileExt || ""}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
