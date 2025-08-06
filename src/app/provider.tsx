"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from 'jotai'
import { usePathname } from "next/navigation";
import ContainerPublicPage from "./container";

const queryClient = new QueryClient();

export default function Provider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isAdminPath = pathname.startsWith('/app') || pathname.startsWith('/auth');

    return (
        <QueryClientProvider client={queryClient}>
            <JotaiProvider>
                {
                    isAdminPath ?
                        (
                            <>
                                {children}
                            </>
                        ) : (
                            <ContainerPublicPage>
                                {children}
                            </ContainerPublicPage>
                        )
                }
            </JotaiProvider>
        </QueryClientProvider>
    );
}