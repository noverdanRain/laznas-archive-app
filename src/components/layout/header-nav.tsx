import Image from "next/image"
import { UserRound } from "lucide-react"

export default function HeaderNav() {
    return (
        <header className="h-20 flex justify-between items-center w-full bg-white ">
            <div
                className="w-full border-b-2 border-gray-200 border-dashed absolute left-0 top-20"
            />
            <h1 className="text-2xl font-bold ml-4">Arsip Digital Laznas</h1>
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <p className="font-medium">Staf Keuangan</p>
                    <p className="text-sm text-gray-500">Akun</p>
                </div>
                {/* <div>
                    <UserRound />
                </div> */}
            </div>
        </header>
    )
}