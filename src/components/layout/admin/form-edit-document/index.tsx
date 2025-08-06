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
import { Dialog, DialogContent, DialogDescription, DialogTitle, } from "@/components/ui/dialog";
import { CloudUpload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useAddDocument } from "@/hooks/useAddDocument";
import { cn } from "@/lib/utils";

export const editDocumentFormSchema = z.object({
    file: z.custom<File | FileWithPath | null>(),
    directoryId: z
        .string()
        .min(36, "Pilih direktori dimana dokumen akan disimpan"),
    title: z
        .string()
        .min(3, "Masukan nama atau judul dokumen minimal 3 karakter")
        .max(255, "Nama maksimal 255 karakter"),
    documentTypeId: z.string().min(1, "Pilih jenis dokumen"),
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

type FormEditDocumentProps = {
    defaultFile: string;
    className?: string;
    onCancel?: () => void;
    onSubmited?: () => void;
    defaultValues: z.infer<typeof editDocumentFormSchema>;
};
export default function FormEditDocument(props: FormEditDocumentProps) {
    const form = useForm<z.infer<typeof editDocumentFormSchema>>({
        resolver: zodResolver(editDocumentFormSchema),
        defaultValues: props.defaultValues,
    });

    const addDocument = useAddDocument({
        onSuccess: (data) => {
            form.reset();
            toast.success("Dokumen berhasil ditambahkan.", {
                description: `Dokumen telah berhasil ditambahkan.`,
                duration: 5000,
            });
            console.log("Document added successfully:", data);
            if (props?.onSubmited) {
                props.onSubmited();
            }
        },
    });

    function onSubmit(values: z.infer<typeof editDocumentFormSchema>) {
        console.log("Submitting form with values:", values);
        // addDocument.mutate({
        //     file: values.file!,
        //     directoryId: values.directoryId,
        //     documentTypeId: values.documentTypeId,
        //     title: values.title,
        //     description: values.description || null,
        //     fileExt: values.file?.name.split(".").pop() || "",
        //     documentNum: values.documentNum || null,
        //     isPrivate: values.visibility === "private",
        // });
    }

    const handleCancel = () => {
        form.reset();
        if (props?.onCancel) {
            props.onCancel();
        }
    };



    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={cn(
                        "space-y-6",
                        props?.className,
                    )}
                >
                    <FileField defaultFile={props.defaultFile} form={form} />
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
            <Dialog open={addDocument.isLoading}>
                <DialogContent className="w-lg flex p-6 bg-white rounded-2xl shadow-lg transition-all duration-300 [&>button:last-child]:hidden">
                    <DialogTitle hidden>Proses Upload Dokumen</DialogTitle>
                    <DialogDescription hidden>
                        Proses upload dokumen sedang berlangsung
                    </DialogDescription>
                    <div className="bg-emerald-50 flex items-center justify-center rounded-full size-14 text-emerald-600">
                        <CloudUpload strokeWidth={2.2} />
                    </div>
                    <div className="grid w-full">
                        <p className="font-medium ">
                            Mengunggah{" "}
                            <span className="font-semibold">
                                "{addDocument.variables?.title}"
                            </span>
                        </p>
                        <p className="text-sm text-neutral-500">
                            {addDocument.progress.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <Progress
                                progressClassName="bg-emerald-600 animate-[pulse_1s_ease-in-out_infinite]"
                                value={addDocument.progress.value}
                            />
                            <p className="text-neutral-500 text-sm">
                                {addDocument.progress.value}%
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
