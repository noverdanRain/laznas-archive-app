import FileSection from "../../_components/file-section";
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
            <h1 className="mb-4 font-medium">Histori {`"${historyData.changeNotes}"`}</h1>
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
                    <BreadcrumbItem>    
                        <BreadcrumbPage className="line-clamp-1">
                            Histori Dokumen
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="grid grid-cols-[1.1fr_2fr] gap-6 mt-6">
                <FileSection
                    documentHist={historyData}
                />
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
