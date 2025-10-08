import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { addDocumentFormSchema } from "@/types";
import { useForm } from "react-hook-form";
import z from "zod";
import { Textarea } from "@/components/ui/textarea";

export default function DescriptionField({ form }: { form: ReturnType<typeof useForm<z.infer<typeof addDocumentFormSchema>>> }) {
    return (
        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Deskripsi <span className="text-xs text-gray-500">(opsional)</span></FormLabel>
                    <FormControl>
                        <Textarea
                            className="w-full min-h-24"
                            placeholder="Deskripsikan dokumen yang ingin diunggah"
                            {...field}
                            value={field.value || ""}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}