import { getSession } from "@/lib/actions";
import { cookies } from "next/headers";

export default async function DirectoryPage() {
    const cookie = await cookies()
    const user = await getSession(cookie.get("token")?.value);
    return (
        <div className="m-4">
            <h1>Directory</h1>
        </div>
    )
}