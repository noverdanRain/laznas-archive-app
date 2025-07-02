import { FileText, Folder, House, Loader, LogOut, PanelLeftClose, PanelLeftOpen, Users } from "lucide-react";
import Image from "next/image";
import ButtonSidebar from "./button-sidebar";
import AlertLogout from "./alert-logout";
import SidebarSheet from "./sidebar-sheet";
import { cookies } from "next/headers";
import { getSession } from "@/app/actions";

export default async function Sidebar() {
    const cookie = await cookies()
    const user = await getSession(cookie.get("token")?.value);

    return (
        <aside className="h-screen px-4 flex flex-col justify-between border-r-2 border-gray-200 border-dashed">
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
                        to={"/dashboard"}
                    >
                        <House size={22} />
                    </ButtonSidebar>
                    <ButtonSidebar
                        tooltipText="Semua Dokumen"
                        to={"/dashboard/documents"}
                    >
                        <FileText size={22} />
                    </ButtonSidebar>
                    <ButtonSidebar
                        tooltipText="Direktori"
                        to={"/dashboard/directory"}
                    >
                        <Folder size={22} />
                    </ButtonSidebar>
                    {
                        user?.role === "administrator" && (
                            <ButtonSidebar
                                tooltipText="Akun Staff"
                                to={"/dashboard/accounts"}
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


