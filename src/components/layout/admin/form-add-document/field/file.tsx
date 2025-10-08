import { useForm } from "react-hook-form";
import z from "zod";
import { addDocumentFormSchema } from "@/types";
import { useRef } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import DocumentIcon from "@/components/common/document-Icon";
import getFileExt, { cn } from "@/lib/utils";
import { filesize } from "filesize";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TooltipText } from "@/components/common/tooltip-text";

export default function FileField({ form }: { form: ReturnType<typeof useForm<z.infer<typeof addDocumentFormSchema>>> }) {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <FormField
            control={form.control}
            name="file"
            render={({ field: { value, onChange, ...fieldProps }, fieldState }) => (
                <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                        <div className={cn(
                            "flex items-center gap-2 border border-gray-200 rounded-lg py-3 px-4 relative",
                            fieldState.error && "border-red-500",
                            // value && "border-emerald-500"
                        )}>
                            {
                                value && (
                                    <DocumentIcon
                                        size={24}
                                        type={getFileExt(value?.name)}
                                    />
                                )
                            }
                            <div className="w-full">
                                <TooltipText text={value?.name || "Tidak ada file yang dipilih"}>
                                    <p className="line-clamp-1 max-w-sm text-sm text-ellipsis">
                                        {value?.name}
                                    </p>
                                </TooltipText>
                                {
                                    value ? (
                                        <p className="text-gray-500 text-sm">
                                            {filesize(value?.size || 0)}
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 font-medium text-sm">
                                            Pilih file dokumen yang ingin diunggah
                                        </p>
                                    )
                                }
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => inputRef.current?.click()}
                            >
                                {
                                    value ? "Ubah File" : "Pilih File"
                                }
                            </Button>
                            {/* {
                                value && (
                                    <Button
                                        type="button"
                                        variant={"outline"}
                                        size={"icon"}
                                        className="size-6 absolute -top-2 -right-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                                        onClick={() => {
                                            onChange(null);
                                        }}
                                    >
                                        <TrashIcon strokeWidth={3} className="size-3" />
                                    </Button>
                                )
                            } */}
                            <Input
                                type="file"
                                onChange={(e) => onChange(e.target.files?.[0] || null)}
                                hidden
                                {...fieldProps}
                                ref={inputRef}
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}