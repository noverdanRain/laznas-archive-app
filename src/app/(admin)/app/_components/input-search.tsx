"use client";

import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";

export default function InputSearchDashboard() {

    const router = useRouter();

    const [searchInput, setSearchInput] = useState("");

    const handleSearchEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        if (event.key === 'Enter' && value.trim() !== '') {
            router.push(`/app/documents?search=${encodeURIComponent(value)}`);
            setSearchInput('');
        }
    }

    return (
        <div className="flex items-center gap-2">
            <InputWithIcon
                lucideIcon={Search}
                className="bg-gray-100 rounded-full w-96 shadow-none"
                placeholder="Cari dokumen..."
                onKeyDown={handleSearchEnter}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
            />
            {
                searchInput && searchInput.trim() !== '' ? (
                    <Button
                        variant="outline"
                        className="rounded-full bg-gray-100 size-6"
                        size={"icon"}
                        onClick={() => setSearchInput('')}
                    >
                        <X />
                    </Button>
                ) : null
            }
        </div>
    )
}