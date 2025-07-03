import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function TooltipText({
    children,
    text,
    delay,
    side,
    ...props
}: {
    children: React.ReactNode;
    text: string;
    delay?: number;
} & React.ComponentProps<typeof TooltipContent>

) {
    return (
        <Tooltip delayDuration={delay || 700} >
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent  bgColorTw="bg-emerald-500 text-white" {...props}>
                <p>{text}</p>
            </TooltipContent>
        </Tooltip>
    );
}
