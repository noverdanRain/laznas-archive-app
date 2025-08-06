import { useForm } from "react-hook-form";
import z from "zod";
import { editDocumentFormSchema } from "..";
import { useRef } from "react";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import DocumentIcon from "@/components/common/document-Icon";
import getFileExt, { cn } from "@/lib/utils";
import { filesize } from "filesize";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TooltipText } from "@/components/common/tooltip-text";
import { TrashIcon } from "lucide-react";

export default function FileField({
    form,
    defaultFile,
}: {
    form: ReturnType<typeof useForm<z.infer<typeof editDocumentFormSchema>>>;
    defaultFile: string;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <FormField
            control={form.control}
            name="file"
            render={({
                field: { value, onChange, ...fieldProps },
                fieldState,
            }) => (
                <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                        <div
                            className={cn(
                                "flex items-center gap-2 border border-gray-200 rounded-lg py-3 px-4 relative",
                                fieldState.error && "border-red-500",
                                value && "border-emerald-400"
                            )}
                        >

                            <DocumentIcon
                                size={24}
                                type={getFileExt(value?.name || defaultFile)}
                            />

                            <div className="w-full">
                                <TooltipText
                                    text={
                                        value?.name || defaultFile
                                    }
                                >
                                    <p className="line-clamp-1 max-w-sm text-sm text-ellipsis">
                                        {value?.name || defaultFile}
                                    </p>
                                </TooltipText>
                                {value ? (
                                    <p className="text-gray-500 text-sm">
                                        {filesize(value?.size || 0)}
                                    </p>
                                ) : null}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => inputRef.current?.click()}
                            >
                                Ubah File
                            </Button>
                            {
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
                            }
                            <Input
                                type="file"
                                onChange={(e) =>
                                    onChange(e.target.files?.[0] || null)
                                }
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
    );
}
