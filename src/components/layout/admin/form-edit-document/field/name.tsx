import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { editDocumentFormSchema } from "@/types";
import { useForm } from "react-hook-form";
import z from "zod";

export default function NameFileld({ form }: { form: ReturnType<typeof useForm<z.infer<typeof editDocumentFormSchema>>> }) {
    return (
        <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="Masukkan nama dokumen" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}