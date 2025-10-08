import { cn } from "@/lib/utils";
import { Icon } from "@iconify-icon/react";

const imageExt = ["png", "jpg", "jpeg", "webp"];
const pdfExt = ["pdf"];
const docExt = ["doc", "docx"];
const xlsExt = ["xls", "xlsx", "csv"];
const pptExt = ["ppt"];
const videoExt = ["mp4"];



type DocumentIconProps = {
    type: string;
    size?: number;
    className?: string;
};

export default function DocumentIcon(props: DocumentIconProps) {
    const icon =
        pdfExt.includes(props.type) ? "mdi:file" :
            docExt.includes(props.type) ? "mdi:file-document" :
                xlsExt.includes(props.type) ? "mdi:file-table" :
                    pptExt.includes(props.type) ? "mdi:file-powerpoint" :
                        imageExt.includes(props.type) ? "mdi:file-image" :
                            videoExt.includes(props.type) ? "mdi:file-video" :
                                "mdi:file-question";
    const twColor =
        pdfExt.includes(props.type) ? "text-rose-600" :
            docExt.includes(props.type) ? "text-blue-600" :
                xlsExt.includes(props.type) ? "text-green-600" :
                    pptExt.includes(props.type) ? "text-orange-600" :
                        imageExt.includes(props.type) ? "text-gray-600" :
                            videoExt.includes(props.type) ? "text-gray-600" :
                                "text-amber-500";
    return (
        <Icon
            icon={icon}
            width={props.size || 22}
            height={props.size || 22}
            className={cn(twColor, props.className)}
        />
    );
}
