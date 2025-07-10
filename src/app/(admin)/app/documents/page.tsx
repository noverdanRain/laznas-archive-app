'use client';
import { useAtom } from "jotai";
import { userSessionAtom } from "@/atom";
import axios, { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { DivisionTypes } from "@/types";
import { fetchGet } from "@/lib/fetch-function";
import { useEffect } from "react";

export default function DocumentsPage() {
    const [userSession] = useAtom(userSessionAtom);

    const hellYeah = useQuery({
        queryKey: ["getassdsdg"],
        queryFn: () => axios.get("/api/thestaffsus").then(res => res.data),
    });

    return (
        <div className="m-4">
            <h1>Documents</h1>
        </div>
    )
}