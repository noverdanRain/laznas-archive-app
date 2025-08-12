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
import { cn } from "@/lib/utils";
import { useEditDocument } from "@/hooks/useEditDocuments";
import { editDocumentFormSchema } from "@/types";
import { useQueryClient } from "@tanstack/react-query";


type FormEditDocumentProps = {
    defaultFile: string;
    className?: string;
    onCancel?: () => void;
    onSubmited?: () => void;
    defaultValues: z.infer<typeof editDocumentFormSchema>;
    documentId: string;
};
export default function FormEditDocument(props: FormEditDocumentProps) {
    const form = useForm<z.infer<typeof editDocumentFormSchema>>({
        resolver: zodResolver(editDocumentFormSchema),
        defaultValues: props.defaultValues,
    });

    const isValueChanged = (field: keyof z.infer<typeof editDocumentFormSchema>) => {
        return form.watch(field) !== props.defaultValues[field];
    };

    const isChanged = Object.keys(editDocumentFormSchema.shape).some((key) => {
        const field = key as keyof z.infer<typeof editDocumentFormSchema>;
        return isValueChanged(field);
    });

    const queryClient = useQueryClient();

    const editDocument = useEditDocument({
        onSuccess: () => {
            form.reset();
            toast.success("Dokumen berhasil diedit.", {
                duration: 5000,
            });
            queryClient.invalidateQueries({ queryKey: ["document", props.documentId] });
            queryClient.invalidateQueries({ queryKey: ["histories", props.documentId] });
            if (props?.onSubmited) {
                props.onSubmited();
            }
        },
        onReject: (reject) => {
            toast.error(reject?.message || "Ada kesalahan saat mengedit dokumen, silakan coba lagi.")
            if (reject?.data.cid) {
                form.setError("file", {
                    message: "File sudah pernah disimpan sebelumnya, silakan gunakan file lain.",
                });
            }
        }
    });

    function onSubmit(values: z.infer<typeof editDocumentFormSchema>) {

        editDocument.mutate({
            documentId: props.documentId,
            data: {
                isPrivate: values.visibility !== props.defaultValues?.visibility ? values.visibility === "private" : undefined,
                title: values.title !== props.defaultValues?.title ? values.title : undefined,
                description: values.description !== props.defaultValues?.description ? values.description : undefined,
                documentNum: values.documentNum !== props.defaultValues?.documentNum ? values.documentNum : undefined,
                directoryId: values.directoryId !== props.defaultValues?.directoryId ? values.directoryId : undefined,
                documentTypeId: values.documentTypeId !== props.defaultValues?.documentTypeId ? values.documentTypeId : undefined,
                file: values.file
            },
        })
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
                        <Button disabled={!isChanged} type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
            <Dialog open={editDocument.isLoading}>
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
                                {editDocument.variables?.data.title || "dokumen"}
                            </span>
                        </p>
                        <p className="text-sm text-neutral-500">
                            {editDocument.progress.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <Progress
                                progressClassName="bg-emerald-600 animate-[pulse_1s_ease-in-out_infinite]"
                                value={editDocument.progress.value}
                            />
                            <p className="text-neutral-500 text-sm">
                                {editDocument.progress.value}%
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
