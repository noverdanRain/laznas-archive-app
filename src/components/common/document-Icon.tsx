import { cn } from "@/lib/utils";
import { Icon } from "@iconify-icon/react";

export type FileType = "pdf" | "doc" | "xls" | "ppt" | "img" | "other";

type DocumentIconProps = {
    type: FileType;
    size?: number;
    className?: string;
};

export default function DocumentIcon(props: DocumentIconProps) {
    const icon =
        props.type === "pdf" ? "mdi:file" :
            props.type === "doc" ? "mdi:file-document" :
                props.type === "xls" ? "mdi:file-table" :
                    props.type === "ppt" ? "mdi:file-powerpoint" :
                        props.type === "img" ? "mdi:image" :
                            "mdi:file-question";
    const twColor =
        props.type === "pdf" ? "text-rose-600" :
            props.type === "doc" ? "text-blue-600" :
                props.type === "xls" ? "text-green-600" :
                    props.type === "ppt" ? "text-orange-600" :
                        props.type === "img" ? "text-gray-600" :
                            "text-gray-500";
    return (
        <Icon
            icon={icon}
            width={props.size || 22}
            height={props.size || 22}
            className={cn(twColor, props.className)}
        />
    );
}
