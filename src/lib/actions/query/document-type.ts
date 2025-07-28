import db from "@/lib/db";
import { documentTypes } from "@/lib/db/schema";
import { unstable_cache } from "next/cache";
import { throwActionError } from "../helpers";

async function getDocumentTypes() {
    const cache = unstable_cache(
        async () => {
            try {
                const docTypes = await db.select().from(documentTypes);
                return docTypes;
            } catch (error) {
                console.log("Error fetching document types:", error);
                throwActionError(error);
            }
        },
        ["documentTypes"],
        {
            tags: ["documentTypes"],
        }
    );
    return await cache();
}

export { getDocumentTypes };
