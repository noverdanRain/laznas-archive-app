'use client';

import { deleteSession, getSessionFromClient } from "@/lib/actions-2";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AppProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();
    const router = useRouter();
    const user = useQuery({
        queryKey: ["user-session"],
        queryFn: () => getSessionFromClient(),
    })
    useEffect(() => {
        if (user.data?.isDisabled) {
            deleteSession().then(() => {
                router.replace("/auth");
            });
            toast.error("Akun Anda telah dinonaktifkan. Silakan hubungi administrator untuk informasi lebih lanjut.");
        }
    },[user.data?.isDisabled]);

    return (
        <>
            {children}
        </>
    )

}