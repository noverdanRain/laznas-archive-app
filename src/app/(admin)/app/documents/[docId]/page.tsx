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
import FileSection from "./_components/file-section";

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

                <p className="text-neutral-500">Jenis Dokumen</p>
                <p className="line-clamp-1">
                    {documentData?.documentType}
                </p>

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
