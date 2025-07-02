'use client';
import { useAtom } from "jotai";
import { userSessionAtom } from "@/atom";

export default function DocumentsPage() {
    const [userSession] = useAtom(userSessionAtom);
    return (
        <div className="m-4">
            <h1>Documents</h1>
        </div>
    )
}