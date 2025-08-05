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
import { Separator } from "@/components/ui/separator";
import {
    ArrowDownToLine,
    Copy,
    Eye,
    FileX,
    Folder,
    SquareArrowOutUpRight,
} from "lucide-react";
import Link from "next/link";
import { ButtonSeeHistory } from "./_components/button-see-history";
import { getDocumentById } from "@/lib/actions";
import { cidElipsis, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";
import { gatewayUrl } from "@/lib/constants";
import { ButtonDownload } from "./_components/button-download";

type Params = Promise<{ docId: string }>;

type DocumentType = Awaited<ReturnType<typeof getDocumentById>>;

export default async function DetailsDocumentPage(props: { params: Params }) {
    const { docId } = await props.params;
    let documentData: DocumentType = null;
    try {
        documentData = await getDocumentById({ id: docId });
    } catch (error) {
        toast.error("Gagal mengambil data dokumen");
    }

    if (!documentData) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] gap-2">
                <FileX className="text-gray-400" size={30} />
                <h3 className="text-gray-400 font-medium">
                    Dokumen tidak ditemukan
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
                    <BreadcrumbItem className="max-w-lg">
                        <BreadcrumbPage className="line-clamp-1">
                            Detail Dokumen
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="grid grid-cols-[1.1fr_2fr] gap-6 mt-6">
                <FileSection documentData={documentData} />
                <IdentitySection documentData={documentData} />
            </div>
        </div>
    );
}

function FileSection({ documentData }: { documentData: DocumentType }) {
    return (
        <section>
            <div className="w-full h-72 border border-gray-200 rounded-xl overflow-hidden relative">
                <div className="flex justify-between items-center p-4 gap-4">
                    <p className="text-sm">File</p>
                    <ButtonDownload
                        uri={`${gatewayUrl}/${documentData?.cid}`}
                        fileName={`${documentData?.title || "dokumen"}.${documentData?.fileExt || ""}`}
                    />
                    <TooltipText text="Buka dokumen di Tab Baru">
                        <Link
                            href={`${gatewayUrl}/${documentData?.cid}`}
                            target="_blank"
                        >
                            <button className="cursor-pointer hover:text-emerald-600 transition-colors">
                                <SquareArrowOutUpRight size={16} />
                            </button>
                        </Link>
                    </TooltipText>
                </div>
                <div className="w-[calc(100%+2px)] h-[calc(100%-3rem)] border border-gray-200 rounded-t-[20px] absolute -left-[1px] -bottom-0.5 bg-white overflow-hidden">
                    <div className="h-[calc(100%-4.5rem)] w-full flex items-center justify-center text-gray-400">
                        <div className="flex flex-col items-center justify-center gap-1 w-full h-full">
                            <Image
                                src={`${gatewayUrl}/${documentData?.cid}`}
                                alt="Preview Dokumen"
                                width={200}
                                height={200}
                                className="w-full h-full object-cover object-center"
                            />
                            {/* <DocumentIcon
                                size={30}
                                className="text-gray-300"
                                type={documentData?.fileExt || ""}
                            />
                            <p>Tidak ada preview</p> */}
                        </div>
                    </div>
                    <div className="flex items-center mt-auto p-4 gap-2 bg-white shadow-[0px_-26px_50px_-2px_rgba(0,_0,_0,_0.08)] border-t border-gray-200">
                        <DocumentIcon type={documentData?.fileExt || ""} />
                        <div className="w-full flex flex-col">
                            <p className="text-sm line-clamp-1">
                                {documentData?.title}
                            </p>
                            <Link
                                href={`${gatewayUrl}/${documentData?.cid}`}
                                target="_blank"
                                className="text-xs text-gray-500 hover:underline"
                            >
                                {cidElipsis(documentData?.cid || "", 10, 10)}.
                                {documentData?.fileExt || ""}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-200 px-2 py-1 rounded-full w-fit mt-4 flex items-center gap-1 text-xs">
                <Eye size={16} className="" />
                <p className="text-xs ">{documentData?.viewsCount} Dilihat</p>
            </div>
        </section>
    );
}

function IdentitySection({ documentData }: { documentData: DocumentType }) {
    return (
        <div className="w-full">
            <h1 className="font-semibold text-xl">{documentData?.title}</h1>
            <p className="mt-2 text-neutral-600">{documentData?.description}</p>
            <div className="grid grid-cols-[1fr_2.5fr] gap-4 mt-4 border p-4 border-gray-200 rounded-xl text-sm">
                <p className="text-neutral-500">No. Dokumen</p>
                <p>{documentData?.documentNum || "-"}</p>

                <p className="text-neutral-500">CID</p>
                <div className="flex items-center gap-2">
                    <button>
                        <Copy size={12} />
                    </button>
                    <p className="line-clamp-1 text-ellipsis">{documentData?.cid}</p>
                </div>

                <p className="text-neutral-500">Ditambahkan pada</p>
                <p className="line-clamp-1">
                    {formatDate(documentData?.createdAt || "")}
                </p>

                <p className="text-neutral-500">Ditambahkan oleh</p>
                <p className="line-clamp-1">
                    Div. {documentData?.createdBy.divisions}{" "}
                    <span className="text-xs text-neutral-500">({documentData?.createdBy.username})</span>
                </p>

                <p className="text-neutral-500">Direktori</p>
                <Link
                    href={`/app/directories/${documentData?.directory?.id}`}
                    className="flex items-center gap-2 hover:underline"
                >
                    <Folder
                        className="fill-amber-500 text-transparent"
                        size={16}
                    />
                    <p className="line-clamp-1">{documentData?.directory?.name}</p>
                </Link>

                <p className="text-neutral-500">Diubah pada</p>
                <div className="flex items-center gap-4">
                    <p>{formatDate(documentData?.updatedAt || "")}</p>
                    <Separator orientation="vertical" />
                    <TooltipText text="Lihat histori dokumen">
                        <ButtonSeeHistory
                            docId={documentData?.id || ""}
                            docName={documentData?.title || ""}
                        />
                    </TooltipText>
                </div>

                <p className="text-neutral-500">Diubah oleh</p>
                <p className="line-clamp-1">
                    Div. {documentData?.updatedBy?.divisions}{" "}
                    <span className="text-xs text-neutral-500">({documentData?.updatedBy?.username})</span>
                </p>
            </div>
        </div>
    );
}
