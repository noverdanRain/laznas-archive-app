import { FileText, Folder, House, Loader, LogOut, PanelLeftClose, PanelLeftOpen, Users } from "lucide-react";
import Image from "next/image";
import ButtonSidebar from "./button-sidebar";
import AlertLogout from "./alert-logout";
import SidebarSheet from "./sidebar-sheet";
import { cookies } from "next/headers";
import { getUserSession } from "@/lib/actions/user-session";

export default async function Sidebar() {
    const cookieStorage = await cookies()
    const user = await getUserSession({ token: cookieStorage.get("token")?.value });

    return (
        <aside className="h-screen px-4 flex flex-col justify-between border-r-2 border-gray-200 border-dashed sticky top-0">
            <div>
                <div className="flex items-center justify-center h-20">
                    <Image
                        src="/logo-icon.png"
                        alt="Logo Laznas Al Irsyad Purwokerto"
                        width={48}
                        height={48}
                    />
                </div>
                <SidebarSheet />

                <nav className="mt-6 flex flex-col gap-6">
                    <ButtonSidebar
                        tooltipText="Beranda"
                        to={"/app"}
                    >
                        <House size={22} />
                    </ButtonSidebar>
                    <ButtonSidebar
                        tooltipText="Semua Dokumen"
                        to={"/app/documents"}
                    >
                        <FileText size={22} />
                    </ButtonSidebar>
                    <ButtonSidebar
                        tooltipText="Direktori"
                        to={"/app/directories"}
                    >
                        <Folder size={22} />
                    </ButtonSidebar>
                    {
                        user?.role === "administrator" && (
                            <ButtonSidebar
                                tooltipText="Akun Staff"
                                to={"/app/accounts"}
                            >
                                <Users size={22} />
                            </ButtonSidebar>
                        )
                    }
                </nav>
            </div>
            <AlertLogout />
        </aside>
    );
}


