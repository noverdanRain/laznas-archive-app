"use client";
import { FileCheck2, FilePlus2, Files, Folders, Search } from "lucide-react";
import HomepageTabButton from "@/components/layout/app/homepage-tab/button-tab";
import HomepageTabContent from "@/components/layout/app/homepage-tab/content-tab";
import { Badge } from "@/components/ui/badge";

export default function AppPage() {
    // const [session, setSessionAtom] = useAtom(userSessionAtom)

    // const query = useQuery({
    //     queryKey: ["user"],
    //     queryFn: async () => {
    //         const response = await fetch("/api/auth");
    //         if (!response.ok) {
    //             throw new Error("Failed to fetch user data");
    //         }
    //         return response.json();
    //     },
    //     // refetchOnWindowFocus: false,
    // })
    // useEffect(() => {
    //     if (query.isSuccess) {
    //         setSessionAtom({
    //             username: query.data?.user.username,
    //             role: query.data?.user.role,
    //             divisionName: query.data?.user.divisionName
    //         })
    //     }
    // }, [query.isSuccess, query.data])

    return (
        <>
            <section className="w-full p-4 flex gap-4 h-40 border-b-2 border-gray-200 border-dashed">
                <div className="h-full min-w-sm xl:min-w-lg col-span-1 flex flex-col items-center justify-center gap-4 border-2 border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-100 transition select-none">
                    <div className="flex items-center gap-1 font-medium text-gray-400">
                        <FilePlus2 />
                        <p>Tambahkan Dokumen</p>
                    </div>
                    <p className="text-sm text-gray-400">
                        Drag & drop or click here
                    </p>
                </div>
                <div className="h-full w-full flex flex-col p-8 gap-2 justify-center bg-gray-100 rounded-2xl">
                    <div className="flex items-center gap-1">
                        <Files />
                        <h6 className="text-xl font-semibold">104</h6>
                    </div>
                    <p className="font-medium">Dokumen diarsipkan</p>
                </div>
                <div className="h-full w-full flex flex-col p-8 gap-2 justify-center bg-gray-100 rounded-2xl">
                    <div className="flex items-center gap-1">
                        <Folders />
                        <h6 className="text-xl font-semibold">9</h6>
                    </div>
                    <p className="font-medium">Jumlah Direktori</p>
                </div>
                <div className="h-full w-full flex flex-col p-8 gap-2 justify-center bg-gray-100 rounded-2xl">
                    <div className="flex items-center gap-1">
                        <FileCheck2 />
                        <h6 className="text-xl font-semibold">14</h6>
                    </div>
                    <p className="font-medium">Ditambahkan saya</p>
                </div>
            </section>
            <section className="flex px-4 py-3 h-[72px] items-center justify-between w-full border-b-2 border-gray-200 border-dashed bg-white sticky top-20 z-40">
                <div className="relative w-sm h-10 bg-gray-100 rounded-full active:ring-1 ring-gray-300 flex items-center cursor-default select-none">
                    <Search
                        size={16}
                        strokeWidth={2}
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                    />
                    <p className="text-neutral-500 pl-11 text-sm">
                        Cari dokumen
                    </p>
                    <Badge
                        variant={"outline"}
                        className="absolute top-1/2 -translate-y-1/2 transform right-4 bg-gray-200 text-gray-500"
                    >
                        Ctrl K
                    </Badge>
                </div>
                <HomepageTabButton />
            </section>
            <HomepageTabContent />
        </>
    );
}
