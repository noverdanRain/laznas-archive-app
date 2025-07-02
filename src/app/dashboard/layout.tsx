import HeaderNav from "@/components/layout/header-nav";
import Sidebar from "@/components/layout/sidebar";
import { getSession } from "../actions";
import { cookies } from "next/headers";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookie = await cookies()
    const user = await getSession(cookie.get("token")?.value);

    return (
        <div className="flex min-h-screen  max-w-[1248px] mx-4 xl:mx-12 xl:max-w-full  border-x-2 border-gray-200 border-dashed transition-all duration-300">
            <Sidebar />
            <main className="w-full">
                <HeaderNav />
                {children}
            </main>
        </div>
    );
}