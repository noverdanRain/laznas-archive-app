import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Provider from "./provider";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Arsip Publik - Laznas Al Irsyad Purwokerto",
    description: "Portal arsip publik Laznas Al Irsyad Purwokerto. Akses dokumen, laporan keuangan, program sosial, dan informasi transparansi lembaga amil zakat nasional Al Irsyad Purwokerto.",
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistMono.variable} ${inter.variable} antialiased`}>
                <NextTopLoader
                color="var(--color-emerald-500)"
                    showSpinner={false}
                />
                <Provider>
                    {children}
                </Provider>
                <Toaster />
            </body>
        </html>
    );
}
