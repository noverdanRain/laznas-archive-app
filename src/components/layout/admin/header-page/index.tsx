import { UserRound } from "lucide-react";
import { cookies } from "next/headers";
import HeaderTitle from "./header-title";
import { getUserSession } from "@/lib/actions/user-session";

export default async function HeaderPage() {
    const cookieStorage = await cookies()
    const user = await getUserSession({ token: cookieStorage.get("token")?.value });
    return (
        <header className="h-20 w-full px-4 flex justify-between items-center bg-white sticky top-0 z-50">
            <div className="w-full border-b-2 border-gray-200 border-dashed absolute left-0 top-20" />
            <HeaderTitle />
            <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                    <p className="font-medium">{user?.divisionName ? `Div. ${user.divisionName}` : "Administrator"}</p>
                    <p className="text-sm text-gray-500">{user?.username}</p>
                </div>
                <div className="flex items-center justify-center bg-gray-200 size-10 rounded-full">
                    <UserRound size={17} className="text-gray-500" />
                </div>
            </div>
        </header>
    )
}