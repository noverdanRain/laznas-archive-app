"use client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useState } from "react";

export default function SelectClearable({
    lucideIcon: Icon,
    className,
    placeholder,
    items,
    onValueChange,
    ...props
}: React.ComponentProps<typeof Select> & {
    lucideIcon?: React.ElementType;
    placeholder?: string;
    className?: string;
    items?: { value: string; label: string }[];
    onValueChange?: (value: string) => void;
}) {
    const [value, setValue] = useState<string>("");

    const handleValueChange = (value: string) => {
        setValue(value);
        if (onValueChange) {
            onValueChange(value);
        }
    }

    const handleClear = () => {
        setValue("");
        if (onValueChange) {
            onValueChange("");
        }
    };

    return (
        <Select value={value} onValueChange={handleValueChange} {...props}>
            <div className="flex items-center">
                <SelectTrigger
                    className={cn(
                        "rounded-l-full rounded-r-full border-0 bg-gray-100 h-8 shadow-none pl-4 pr-4 cursor-pointer",
                        value && "rounded-r-none pr-1"
                    )}
                >
                    {Icon && (
                        <Icon
                            size={16}
                            strokeWidth={2}
                            className="text-neural-800"
                        />
                    )}
                    <SelectValue placeholder={placeholder || "Pilih Opsi"} />
                </SelectTrigger>
                {value && (
                    <div className="size-9 bg-gray-100 rounded-r-full p-1 ">
                        <button
                            onClick={handleClear}
                            className="flex items-center justify-center w-full h-full bg-gray-200 rounded-full cursor-pointer text-gray-600 hover:bg-gray-200/70 transition"
                        >
                            <X size={12} strokeWidth={2.8} />
                        </button>
                    </div>
                )}
            </div>
            <SelectContent>
                {items?.map((item) => (
                    <SelectItem
                        key={item.value}
                        value={item.value}
                    >
                        {item.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
