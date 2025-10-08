import { FileCheck2, Files, Folders } from "lucide-react";
import HomepageTabButton from "@/app/(admin)/app/_components/tab-button";
import HomepageTabContent from "@/app/(admin)/app/_components/tab-container";
import HomepageDragZone from "./_components/drag-zone";
import { getDirectoriesCount, getDocumentsCount, getDocumentsCountByUserId, getUserSession } from "@/lib/actions";
import { cookies } from "next/headers";
import InputSearchDashboard from "./_components/input-search";

export default async function AppPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const userSession = await getUserSession({ token });
    const documentsCount = await getDocumentsCount();
    const documentsCountByUser = await getDocumentsCountByUserId({ userId: userSession?.id || "" });
    const directoriesCount = await getDirectoriesCount();

    return (
        <>
            <section className="w-full p-4 grid grid-cols-[2fr_1.4fr_1.4fr_1.4fr] gap-4 h-40 border-b-2 border-gray-200 border-dashed">
                <HomepageDragZone />
                <div className="h-full w-full flex flex-col p-8 gap-2 justify-center bg-gray-100 rounded-2xl">
                    <div className="flex items-center gap-1">
                        <Files />
                        <h6 className="text-xl font-semibold">{documentsCount}</h6>
                    </div>
                    <p className="font-medium">Dokumen diarsipkan</p>
                </div>
                <div className="h-full w-full flex flex-col p-8 gap-2 justify-center bg-gray-100 rounded-2xl">
                    <div className="flex items-center gap-1">
                        <Folders />
                        <h6 className="text-xl font-semibold">{directoriesCount}</h6>
                    </div>
                    <p className="font-medium">Jumlah Direktori</p>
                </div>
                <div className="h-full w-full flex flex-col p-8 gap-2 justify-center bg-gray-100 rounded-2xl">
                    <div className="flex items-center gap-1">
                        <FileCheck2 />
                        <h6 className="text-xl font-semibold">{documentsCountByUser}</h6>
                    </div>
                    <p className="font-medium">Ditambahkan saya</p>
                </div>
            </section>
            <section className="flex px-4 py-3 h-[72px] items-center justify-between w-full border-b-2 border-gray-200 border-dashed bg-white sticky top-20 z-40">
                <InputSearchDashboard />
                <HomepageTabButton />
            </section>
            <HomepageTabContent />
        </>
    );
}
