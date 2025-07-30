import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TableFooter() {
    return (
        <div className="flex items-center justify-between gap-6 px-6 bg-white border-t border-gray-200 w-full h-16 col-span-6">
            <Button variant={"outline"} disabled>
                <ChevronLeft />
                Sebelumnya
            </Button>
            <p className="text-sm font-medium text-neutral-400">Halaman 1 dari 12</p>
            <Button variant={"outline"}>
                Selanjutnya
                <ChevronRight />
            </Button>
        </div>
    );
}
