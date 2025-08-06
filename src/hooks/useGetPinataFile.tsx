"use client";
import { pinataPrivateFile, pinataPublicFile } from "@/lib/actions";
import { pinata } from "@/lib/pinata-config";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

type UseGetPinataFileParams = {
    cid: string;
    visibility?: "public" | "private";
}

export default function useGetPinataFile(params: UseGetPinataFileParams) {
    const { cid, visibility = "public" } = params;
    const { data: url, ...others } = useQuery({
        queryKey: ["get-pinata-file", cid, visibility],
        queryFn: async () => {
            if (visibility === "private") {
                return await pinataPrivateFile(cid);
            } else {
                return await pinataPublicFile(cid);
            }
        },
        refetchOnWindowFocus: false,
    })
    useEffect(() => {
        if (others.isError) {
            toast.error("Gagal mengambil file dari server");
        }
    }, [others.isError])

    return {
        url,
        ...others,
    };
}