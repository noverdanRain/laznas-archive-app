import { clsx, type ClassValue } from "clsx";
import moment from "moment-timezone";
import { twMerge } from "tailwind-merge";

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

export const urlToFile = async (url: string, filename: string, mimeType: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: mimeType });
};