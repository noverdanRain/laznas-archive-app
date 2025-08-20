"use client";

import { TooltipText } from "@/components/common/tooltip-text";
import { ButtonDownload } from "./button-download";
import Link from "next/link";
import { getDocumentById, getDocumentHistoryById, pinataPrivateFile, pinataPublicFile } from "@/lib/actions";
import { Eye, Loader2, Lock, SquareArrowOutUpRight } from "lucide-react";
import Image from "next/image";
import DocumentIcon from "@/components/common/document-Icon";
import { cidElipsis } from "@/lib/utils";
import useGetPinataFile from "@/hooks/useGetPinataFile";
import { useEffect, useState } from "react";
import { incrementDocumentViews } from "@/lib/actions";
type DocumentType = Awaited<ReturnType<typeof getDocumentById>>;
type HistoryType = Awaited<ReturnType<typeof getDocumentHistoryById>>;

export default function FileSection({ document, documentHist }: { document?: DocumentType, documentHist?: HistoryType }) {
    const documentData = document ? document : documentHist;

    useEffect(() => {
        incrementDocumentViews({ id: documentData!.id })
            .then((res) => {
                console.log("Document views incremented:", res);
            })
            .catch((error) => {
                console.error("Error incrementing document views:", error);
            });
    }, [])

    const { url, isLoading } = useGetPinataFile({
        cid: documentData?.cid || "",
        visibility: documentData?.isPrivate ? "private" : "public",
    });

    const handleOpenInNewTab = async () => {
        const { url } = documentData?.isPrivate ? await pinataPrivateFile(documentData!.cid) : await pinataPublicFile(documentData!.cid);
        window.open(url, "_blank");
    }
    return (
        <section>
            <div className="w-full h-72 border border-gray-200 rounded-xl overflow-hidden relative">
                <div className="flex justify-between items-center p-4 gap-4">
                    <p className="text-sm">File</p>
                    <ButtonDownload
                        fileName={`${documentData?.title || "dokumen"}.${documentData?.fileExt || ""}`}
                        cid={documentData?.cid || ""}
                        isPrivate={documentData?.isPrivate}
                    />
                    <TooltipText text="Buka dokumen di Tab Baru">
                        <button onClick={handleOpenInNewTab} className="cursor-pointer hover:text-emerald-600 transition-colors">
                            <SquareArrowOutUpRight size={16} />
                        </button>
                    </TooltipText>
                </div>
                <div className="w-[calc(100%+2px)] h-[calc(100%-3rem)] border border-gray-200 rounded-t-[20px] absolute -left-[1px] -bottom-0.5 bg-white overflow-hidden">
                    <div className="h-[calc(100%-4.5rem)] w-full flex items-center justify-center text-gray-400">
                        <div className="flex flex-col items-center justify-center gap-1 w-full h-full">
                            {
                                isLoading ? (
                                    <Loader2 className="animate-spin" />
                                ) :
                                    url && (documentData?.fileExt == "png" || documentData?.fileExt == "jpg" || documentData?.fileExt == "jpeg") ? (
                                        <Image
                                            src={url}
                                            alt="Preview Dokumen"
                                            width={200}
                                            height={200}
                                            className="w-full h-full object-cover object-center"
                                        />
                                    ) : (
                                        <>
                                            <DocumentIcon
                                                size={30}
                                                className="text-gray-300"
                                                type={documentData?.fileExt || ""}
                                            />
                                            <p>Tidak ada preview</p>
                                        </>
                                    )
                            }
                        </div>
                    </div>
                    <div className="flex items-center mt-auto p-4 gap-2 bg-white shadow-[0px_-26px_50px_-2px_rgba(0,_0,_0,_0.08)] border-t border-gray-200">
                        <DocumentIcon type={documentData?.fileExt || ""} />
                        <div className="w-full">
                            <p className="text-sm line-clamp-1">
                                {documentData?.title}
                            </p>
                            <button
                                onClick={handleOpenInNewTab}
                                className="text-xs text-gray-500 hover:underline"
                            >
                                {cidElipsis(documentData?.cid || "", 10, 10)}.
                                {documentData?.fileExt || ""}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-200 px-2 py-1 rounded-full w-fit mt-4 flex items-center gap-1 text-xs">
                {documentData?.isPrivate ? (
                    <>
                        <Lock size={12} className="" />
                        <p className="text-xs ">Private</p>
                    </>

                ) : document && (
                    <>
                        <Eye size={16} />
                        <p className="text-xs">{document.viewsCount} Dilihat</p>
                    </>
                )
                }
            </div>
        </section>
    )
}