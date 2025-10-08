'use client';

import { useEffect } from "react";
import { toast } from "sonner";
import { useUserSession } from "@/hooks/useUserSession";
import { useLogout } from "@/hooks/useLogout";

export default function AppProvider({ children }: { children: React.ReactNode }) {
    const { userSession } = useUserSession();

    const { logout } = useLogout()

    useEffect(() => {
        if (userSession?.isDisabled) {
            logout();
            toast.error("Akun Anda telah dinonaktifkan. Silakan hubungi administrator untuk informasi lebih lanjut.");
        }
    }, [userSession?.isDisabled]);

    return (
        <>
            {children}
        </>
    )

}