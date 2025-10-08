import { FileWithPath } from "react-dropzone";
import z from "zod";

export interface CustomMutateHooksProps<T = any> {
    onSuccess?: (data?: T) => void;
    onReject?: (data: string | any) => void;
    onError?: (error: Error) => void;
    onMutate?: (params: any) => void;
}
export interface DocumentsFilterType {
    addedBy: string;
    visibility: string;
}

export interface MutateActionsReturnType {
    isSuccess?: boolean;
    isRejected?: boolean;
    reject?: {
        message?: string;
    };
}

export interface DivisionTypes {
    id: string;
    name: string;
}
export interface TypeOfDocumentTypes {
    id: string;
    name: string;
}

export interface DirectoryTypes {
    id: string;
    name: string;
    description: string | null;
    isPrivate: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface StaffTypes {
    username: string;
    division: DivisionTypes;
    role: "administrator" | "staff";
    isDisabled: boolean;
}

export interface AddStaffParams {
    username: string;
    password: string;
    divisionId: string;
}

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
