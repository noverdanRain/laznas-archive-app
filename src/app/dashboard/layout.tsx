import HeaderNav from "@/components/layout/header-nav";
import Sidebar from "@/components/layout/sidebar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen  max-w-[1248px] mx-4 px-4 xl:mx-12 xl:max-w-full  border-x-2 border-gray-200 border-dashed transition-all duration-300">
            <Sidebar />
            <main className="w-full">
                <HeaderNav />
                {children}
            </main>
        </div>
    );
}