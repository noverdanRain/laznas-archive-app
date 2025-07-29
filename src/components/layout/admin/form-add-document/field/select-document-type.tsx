import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addDocumentFormSchema } from "..";
import { useForm } from "react-hook-form";
import z from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetDocType } from "@/hooks/useGetDocType";

export default function SelectDocumentTypeField({ form }: { form: ReturnType<typeof useForm<z.infer<typeof addDocumentFormSchema>>> }) {
    const { data: documentType, isLoading, isError, isSuccess } = useGetDocType();

    return (
        <FormField
            control={form.control}
            name="documentTypeId"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Jenis Dokumen</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih jenis dokumen" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {
                                isLoading && (
                                    <p className="text-sm p-2">Memuat ...</p>
                                )
                            }
                            {
                                isError && (
                                    <p className="text-sm p-2">Error saat mengambil data, coba refresh halaman.</p>
                                )
                            }
                            {
                                isSuccess && (
                                    documentType.map((docType) => (
                                        <SelectItem key={docType.id} value={docType.id}>
                                            {docType.name}
                                        </SelectItem>
                                    ))
                                )
                            }
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}