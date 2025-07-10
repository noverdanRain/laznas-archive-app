import Sidebar from "@/components/layout/app/sidebar";
import HeaderPage from "@/components/layout/app/header-page";
import AppProvider from "./provider";

export default async function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <AppProvider>
            <div className="flex min-h-screen min-w-3xl max-w-[1248px] mx-4 xl:mx-12 xl:max-w-full  border-x-2 border-gray-200 border-dashed transition-all duration-300 relative">
                <Sidebar />
                <main className="w-full">
                    <HeaderPage />
                    {children}
                </main>
            </div>
        </AppProvider>
    );
}