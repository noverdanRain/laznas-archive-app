'use client';
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { userSessionAtom } from "@/atom";
import { useEffect } from "react";

export default function Dashboard() {

    const [session, setSessionAtom] = useAtom(userSessionAtom)

    const query = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const response = await fetch("/api/auth");
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            return response.json();
        },
        // refetchOnWindowFocus: false,
    })
    useEffect(() => {
        if (query.isSuccess) {
            setSessionAtom({
                username: query.data?.user.username,
                role: query.data?.user.role,
                divisionName: query.data?.user.divisionName
            })
        }
    }, [query.isSuccess, query.data])

    return (
        <div className="">
            <div className="w-full h-40 border-b-2 border-gray-200 border-dashed">

            </div>
            <h1>Dashboard</h1>
        </div>
    )
}