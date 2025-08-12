import { clsx, type ClassValue } from "clsx";
import moment from "moment-timezone";
import { twMerge } from "tailwind-merge";
import { importer } from "ipfs-unixfs-importer";
import { MemoryBlockstore } from "blockstore-core/memory";
import { FileWithPath } from "react-dropzone";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function getFileExt(filename: string = "") {
    const parts = filename.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

export function generateRandomCode() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomPart = "";

    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomPart += characters[randomIndex];
    }

    const formattedCode = `${day}${month}/${year}/${randomPart}`;
    return formattedCode;
}

export function cidElipsis(
    cid: string,
    startLength: number = 5,
    endLength: number = 5
): string {
    if (cid.length <= startLength + endLength) {
        return cid;
    }

    return `${cid.substring(0, startLength)}....${cid.substring(
        cid.length - endLength
    )}`;
}

export function formatDate(date: Date | string): string {
    const formattedDate = moment(date)
        .locale("id")
        .tz("Asia/Jakarta")
        .format("DD MMM YYYY, HH:mm");
    return `${formattedDate} WIB`;
}

export async function copyToClipboard(textToCopy: string) {
    try {
        await navigator.clipboard.writeText(textToCopy);
        console.log("Text copied to clipboard successfully!");
    } catch (err) {
        console.error("Failed to copy text: ", err);
    }
}

export async function downloadFileFromURI(uri: string, fileName: string) {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error("Download failed:", err);
    }
}

export const urlToFile = async (
    url: string,
    filename: string,
    mimeType: string
) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
};

export const predictCID = async (file: File | FileWithPath, version: 0 | 1 = 1): Promise<string | undefined> => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const blockstore = new MemoryBlockstore();

        let rootCid: string | undefined;

        for await (const result of importer([{ content: buffer }], blockstore, {
            cidVersion: version,
            rawLeaves: version === 1,
        })) {
            rootCid = result.cid.toString();
        }

        return rootCid;
    } catch (err) {
        throw new Error(`Failed to predict CID: ${err instanceof Error ? err.message : String(err)}`);
    }
};
