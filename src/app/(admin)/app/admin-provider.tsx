'use client';

import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserSession } from "@/hooks/useUserSession";
import { removeUserSession } from "@/lib/actions";

export default function AppProvider({ children }: { children: React.ReactNode }) {
    const { userSession } = useUserSession();
    console.log("userSession => ", userSession);

    const router = useRouter();

    useEffect(() => {
        if (userSession?.isDisabled) {
            removeUserSession().then(() => {
                router.replace("/auth");
            });
            toast.error("Akun Anda telah dinonaktifkan. Silakan hubungi administrator untuk informasi lebih lanjut.");
        }
    }, [userSession?.isDisabled]);

    return (
        <>
            {children}
        </>
    )

}