'use client';
import { usePathname } from "next/navigation";

export default function HeaderTitle() {
    const pathname = usePathname();
    const isDocumentsPage = pathname === "/app/documents";
    const isDirectoriesPage = pathname === "/app/directories";
    const isAccountsPage = pathname === "/app/accounts";

    return (
        <h1 className="text-xl font-bold">{
            isDocumentsPage && "Dokumen" ||
            isDirectoriesPage && "Direktori" ||
            isAccountsPage && "Daftar Akun Staf"||
            "Sistem Arsip Digital Laznas"
        }</h1>
    )
}