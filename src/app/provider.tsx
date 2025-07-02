"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from 'jotai'

const queryClient = new QueryClient();

export default function Provider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <JotaiProvider>
                {children}
            </JotaiProvider>
        </QueryClientProvider>
    );
}