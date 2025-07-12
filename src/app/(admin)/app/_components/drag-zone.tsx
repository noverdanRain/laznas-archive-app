'use client';

import AddDocumentDialog from '@/components/layout/app/add-document-dialog';
import { cn } from '@/lib/utils';
import { FilePlus2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function HomepageDragZone() {
    const {
        getRootProps,
        getInputProps,
        acceptedFiles,
        isDragAccept,
        isDragReject,
    } = useDropzone({ maxFiles: 1 });

    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        if (acceptedFiles.length > 0) {
            setOpenDialog(true);
        }
    }, [acceptedFiles]);

    return (
        <>
            <div
                className={cn(
                    "h-full w-full col-span-1 flex flex-col items-center justify-center gap-4 border-2 border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-100 transition select-none relative",
                    isDragAccept && "border-green-500 bg-green-50",
                    isDragReject && "border-red-500 bg-red-50"
                )}
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                <div className="flex items-center gap-1 font-medium text-gray-400">
                    <FilePlus2 />
                    <p>Tambahkan Dokumen</p>
                </div>
                <p className="text-sm text-gray-400">
                    Drag & drop or click here
                </p>
                {
                    isDragReject && (
                        <p className='text-xs text-red-500 absolute bottom-2'>Maksimal upload 1 file</p>
                    )
                }
            </div>
            <AddDocumentDialog open={openDialog} onOpenChange={setOpenDialog} file={acceptedFiles[0]} />
        </>

    )
}