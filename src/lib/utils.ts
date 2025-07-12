import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function bytesToMB(bytes: number = 0): number {
    if (bytes === 0) return 0;
    const k = 1024;
    const sizeInMB = bytes / k / k;
    return Math.round(sizeInMB * 100) / 100; // Round to 2 decimal places
}
