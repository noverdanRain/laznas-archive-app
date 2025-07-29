"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FileWithPath } from "react-dropzone";

import FileField from "./field/file";
import NameFileld from "./field/name";
import SelectDirectoryField from "./field/select-directory";
import SelectDocumentTypeField from "./field/select-document-type";
import DescriptionField from "./field/description";
import DocumentNumberField from "./field/document-number";
import VisibilityField from "./field/visibility";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CloudUpload, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const addDocumentFormSchema = z.object({
    file: z.custom<File | FileWithPath | null>().refine((file) => !!file, {
        message: "Mohon pilih file dokumen yang ingin diunggah",
    }),
    directoryId: z
        .string()
        .min(36, "Pilih direktori dimana dokumen akan disimpan"),
    title: z
        .string()
        .min(3, "Masukan nama atau judul dokumen minimal 3 karakter")
        .max(255, "Nama maksimal 255 karakter"),
    documentTypeId: z.string().min(36, "Pilih jenis dokumen"),
    description: z.string().optional(),
    documentNum: z
        .string()
        .max(32, "Nomor dokumen maksimal 32 karakter")
        .optional()
        .refine((value) => !value || value.length > 2, {
            message: "Nomor dokumen minimal 3 karakter",
        }),
    visibility: z.enum(["private", "public"]).default("private").optional(),
});

type FormAddDocumentProps = {
    defaultFile?: File | FileWithPath;
    onCancel?: () => void;
};
export default function FormAddDocument(props?: FormAddDocumentProps) {
    const form = useForm<z.infer<typeof addDocumentFormSchema>>({
        resolver: zodResolver(addDocumentFormSchema),
        defaultValues: {
            file: props?.defaultFile || null,
            directoryId: "",
            title: "",
            documentTypeId: "",
            description: "",
            documentNum: "",
            visibility: "private",
        },
    });

    function onSubmit(values: z.infer<typeof addDocumentFormSchema>) {
        // Handle form submission logic here
        console.log(values);
    }

    const handleCancel = () => {
        form.reset();
        if (props?.onCancel) {
            props.onCancel();
        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FileField form={form} />
                    <SelectDirectoryField form={form} />
                    <div className="w-full border-b-2 border-dashed border-gray-200" />
                    <NameFileld form={form} />
                    <SelectDocumentTypeField form={form} />
                    <DescriptionField form={form} />
                    <DocumentNumberField form={form} />
                    <VisibilityField form={form} />
                    <div className="flex gap-2 items-center justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                        >
                            Batal
                        </Button>
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
            <Dialog open={true} >
                <DialogContent
                    className="flex  p-6 bg-white rounded-2xl shadow-lg transition-all duration-300 w-fit [&>button:last-child]:hidden"
                >
                    <DialogTitle hidden>Proses Upload Dokumen</DialogTitle>
                    <DialogDescription hidden>Proses upload dokumen sedang berlangsung</DialogDescription>
                    <div className="bg-emerald-50 flex items-center justify-center rounded-full size-14 text-emerald-600">
                        <CloudUpload strokeWidth={2.2} />
                    </div>
                    <div className="grid">
                        <p className="font-medium ">Mengunggah <span className="font-semibold">"{form.getValues("title")}"</span></p>
                        <p className="text-sm text-neutral-500">Sedang berlangsung...</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Progress progressClassName="bg-emerald-600 animate-[pulse_1s_ease-in-out_infinite]" value={40} />
                            <p className="text-neutral-500 text-sm">10%</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
