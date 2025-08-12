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
import { addDocumentFormSchema } from "@/types";

type FormAddDocumentProps = {
    defaultFile?: File | FileWithPath;
    className?: string;
    onCancel?: () => void;
    onSubmited?: () => void;
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

    const addDocument = useAddDocument({
        onSuccess: (data) => {
            form.reset();
            toast.success("Dokumen berhasil ditambahkan.", {
                description: `Dokumen telah berhasil ditambahkan.`,
                duration: 5000,
            });
            if (props?.onSubmited) {
                props.onSubmited();
            }
        },
        onReject: (reject) => {
            toast.error(reject.message || "Ada kesalahan saat menambahkan dokumen, silakan coba lagi.");
            if (reject?.data.cid) {
                form.setError("file", {
                    message: "File sudah pernah disimpan sebelumnya, silakan gunakan file lain.",
                });
            }
        }
    });

    function onSubmit(values: z.infer<typeof addDocumentFormSchema>) {
        addDocument.mutate({
            file: values.file!,
            directoryId: values.directoryId,
            documentTypeId: values.documentTypeId,
            title: values.title,
            description: values.description || null,
            fileExt: values.file?.name.split(".").pop() || "",
            documentNum: values.documentNum || null,
            isPrivate: values.visibility === "private",
        });
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
                                {addDocument.variables?.title}
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
