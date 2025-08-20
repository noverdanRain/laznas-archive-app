import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { editDocumentFormSchema } from "@/types";
import { useForm } from "react-hook-form";
import z from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Eye, Lock } from "lucide-react";
import { getDirectories } from "@/lib/actions";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

type directoriesType = Awaited<ReturnType<typeof getDirectories>>;
type directoryType = directoriesType[number];

type Visibility = "private" | "public";

export default function VisibilityField({ form, dirSelected }: {
    form: ReturnType<typeof useForm<z.infer<typeof editDocumentFormSchema>>>,
    dirSelected?: directoryType | null
}) {
    console.log("Directory Selected:", dirSelected);

    useEffect(() => {
        if (dirSelected?.isPrivate) {
            form.setValue("visibility", "private");
        } else {
            console.log("is Private", dirSelected?.isPrivate);
            const visibility = dirSelected?.isPrivate ? "private" : "public";
            form.setValue("visibility", visibility);
        }
    }, [dirSelected])

    return (
        <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Visibilitas</FormLabel>
                    <FormDescription>
                        Pilih visibilitas dokumen yang akan diunggah. <span className="text-xs text-gray-500">(default private)</span>
                    </FormDescription>
                    <RadioGroup
                        defaultValue={field.value}
                        onValueChange={(value) => field.onChange(value as Visibility)}
                        className="flex w-full"
                        value={field.value}
                    >
                        <div className="flex items-center space-x-2 w-full">
                            <RadioGroupItem value={"private"} id="option-private" hidden />
                            <Label
                                htmlFor="option-private"
                                className={
                                    `h-full space-x-1 p-4 rounded-xl border-2 border-gray-200 w-full cursor-pointer ${field.value === "private" &&
                                    "bg-emerald-50 border-emerald-500"}`

                                }
                            >
                                <Lock size={20} className={`${field.value === "private" && "text-emerald-600"}`} />
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium">Private</p>
                                    <p className="text-sm text-gray-500">
                                        Hanya dapat diakses oleh akun staff
                                    </p>
                                </div>
                            </Label>
                        </div>
                        <div className={cn(
                            "flex items-center space-x-2 w-full",
                            dirSelected?.isPrivate && "opacity-50"
                        )}>
                            <RadioGroupItem disabled={dirSelected?.isPrivate} value={"public"} id="option-public" hidden />
                            <Label
                                htmlFor="option-public"
                                className={
                                    `h-full space-x-1 p-4 rounded-xl border-2 border-gray-200 w-full cursor-pointer ${field.value === "public" && "bg-emerald-50 border-emerald-500"}`
                                }
                            >
                                <Eye size={20} className={`${field.value === "public" && "text-emerald-600"}`} />
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium">Public</p>
                                    <p className="text-sm text-gray-500">
                                        Dapat diakses oleh semua orang di internet
                                    </p>
                                </div>
                            </Label>
                        </div>
                    </RadioGroup>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}