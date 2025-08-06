import { InputWithIcon } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";

export default function HeaderPage() {
    return (
        <header className="flex items-center justify-between px-4 h-20 border-b-2 border-gray-200 border-dashed w-full sticky top-0 z-10 bg-white">
            <Image
                src="/logo-with-text.png"
                alt="Logo"
                width={100}
                height={100}
            />
            <InputWithIcon
                lucideIcon={Search}
                placeholder="Cari Dokumen"
                name="search-public"
                iconSize={14}
                iconColor="#6a7282"
                className="pl-8 rounded-full w-sm bg-gray-100"
                type="search"
            />
        </header>
    )
}