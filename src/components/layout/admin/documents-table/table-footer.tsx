"use client";
import { Button } from "@/components/ui/button";
import { useGetDocuments, UseGetDocumentsReturnType } from "@/hooks/useGetDocuments";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { documentsPage_useGetDocumentsParams } from "@/app/(admin)/app/documents/page";
import { useEffect } from "react";
import { useTopLoader } from "nextjs-toploader";
import { useQueryClient } from "@tanstack/react-query";

export default function TableFooter() {
    const topLoader = useTopLoader();
    const queryClient = useQueryClient();
    const documentsPageData = queryClient.getQueryData<UseGetDocumentsReturnType>(documentsPage_useGetDocumentsParams.key);


    const {
        isLoading,
        setQuery,
        currentPaginate,
        totalPage
    } = useGetDocuments(documentsPage_useGetDocumentsParams);

    useEffect(() => {
        if (isLoading) {
            topLoader.start();
        } else {
            topLoader.done();
        }
    }, [isLoading]);

    const handleNextPage = () => {
        setQuery({ paginate: { page: (currentPaginate?.page || 1) + 1, pageSize: currentPaginate?.pageSize } });
    };
    const handlePrevPage = () => {
        if (currentPaginate?.page && currentPaginate.page > 1) {
            setQuery({ paginate: { page: currentPaginate.page - 1, pageSize: currentPaginate?.pageSize } });
        }
        if (currentPaginate?.page && currentPaginate.page <= 1) {
            return;
        }
    };


    return (
        <div className="flex items-center justify-between gap-6 px-6 bg-white border-t border-gray-200 w-full h-16 col-span-6">
            <Button
                onClick={() => handlePrevPage()}
                variant={"outline"}
                disabled={!currentPaginate?.page || currentPaginate.page <= 1}
            >
                <ChevronLeft />
                Sebelumnya
            </Button>
            <p
                className={`text-sm font-medium text-neutral-400 transition-opacity`}
            >
                Halaman {currentPaginate?.page || 1} dari {totalPage || "..."}
            </p>
            <Button
                onClick={() => handleNextPage()}
                variant={"outline"}
                disabled={!currentPaginate?.page || currentPaginate.page >= totalPage}
            >
                Selanjutnya
                <ChevronRight />
            </Button>
        </div>
    );
}
