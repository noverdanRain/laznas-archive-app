'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useRouter } from 'nextjs-toploader/app';

export default function ButtonSidebar({
    children,
    className,
    tooltipText,
    to,
    onClick,
}: {
    children: React.ReactNode;
    className?: string;
    tooltipText: string;
    hiddenAble?: boolean;
    to?: string;
    onClick?: () => void;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const handleClick = () => {
        if (to) {
            router.push(to);
        }
    }

    return (

        <Tooltip delayDuration={700}>
            <TooltipTrigger asChild>

                <button
                    className={cn(
                        `w-11 h-11 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition cursor-pointer`,
                        `${pathname === to ? 'bg-emerald-600 text-white hover:bg-emerald-600' : ''}`,
                        className
                    )}
                    onClick={to? handleClick : onClick}
                >
                    {children}
                </button>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>{tooltipText}</p>
            </TooltipContent>
        </Tooltip>
    );
}