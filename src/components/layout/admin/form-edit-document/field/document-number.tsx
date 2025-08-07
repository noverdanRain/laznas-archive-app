import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { editDocumentFormSchema } from "@/types";
import { useForm } from "react-hook-form";
import z from "zod";
import { generateRandomCode } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function DocumentNumberField({ form }: { form: ReturnType<typeof useForm<z.infer<typeof editDocumentFormSchema>>> }) {
    return (
        <FormField
            control={form.control}
            name="documentNum"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Nomor Dokumen  <span className="text-xs text-gray-500">(opsional)</span></FormLabel>
                    <div className="flex items-center gap-2">
                        <FormControl>
                            <Input
                                {...field}
                                placeholder="Masukkan nomor dokumen"
                                // value={field.value || ""}
                            />
                        </FormControl>
                        <Button
                            type="button"
                            variant={"outline"}
                            onClick={() => form.setValue("documentNum", generateRandomCode())}
                        >
                            Nomor acak
                        </Button>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}