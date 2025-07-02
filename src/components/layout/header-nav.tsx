import { getSession } from "@/app/actions";
import { UserRound } from "lucide-react";
import { cookies } from "next/headers";

export default async function HeaderNav() {
    const cookie = await cookies()
    const user = await getSession(cookie.get("token")?.value);
    return (
        <header className="h-20 w-full px-4 flex justify-between items-center bg-white ">
            <div
                className="w-full border-b-2 border-gray-200 border-dashed absolute left-0 top-20"
            />
            <h1 className="text-2xl font-bold">Arsip Digital Laznas</h1>
            <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                    <p className="font-medium">{user?.divisionName ? user.divisionName : "Administrator"}</p>
                    <p className="text-sm text-gray-500">{user?.username}</p>
                </div>
                <div className="flex items-center justify-center bg-gray-200 size-10 rounded-full">
                    <UserRound className="text-gray-00" />
                </div>
            </div>
        </header>
    )
}