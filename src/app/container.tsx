import HeaderPage from "@/components/layout/public/header-page";
import { ReactNode } from "react";

export default function ContainerPublicPage({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen min-w-3xl max-w-[1248px] mx-4 xl:mx-12 xl:max-w-full  border-x-2 border-gray-200 border-dashed transition-all duration-300 relative">
            <HeaderPage />
            <main className="w-full">
                {children}
            </main>
        </div>
    );
}
