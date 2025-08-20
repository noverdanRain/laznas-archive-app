import { pinata } from "@/lib/pinata-config";
import { throwActionError } from "../helpers";

export async function pinataPrivateFile(cid: string) {
    try {
        const url = await pinata.gateways.private.createAccessLink({
            cid: cid,
            expires: 120,
        });
        const files = await pinata.files.private.list().cid(cid);
        const file = files?.files[0];
        return { ...file, url };
    } catch (error) {
        console.log("Error fetching private file:", error);
        throw error;
    }
}

export async function pinataPublicFile(cid: string) {
    try {
        const url = await pinata.gateways.public.convert(cid);
        const files = await pinata.files.public.list().cid(cid);
        const file = files?.files[0];
        return { ...file, url };
    } catch (error) {
        console.log("Error fetching public file:", error);
        throw error;
    }
}

export async function isCidExsist(cid: string): Promise<boolean> {
    try {
        const filesPublicPromise = pinata.files.public.list().cid(cid);
        const filesPrivatePromise = pinata.files.private.list().cid(cid);

        const [filesPublic, filesPrivate] = await Promise.all([
            filesPublicPromise,
            filesPrivatePromise,
        ]);

        const isFileExist =
            !!filesPublic.files.length || !!filesPrivate.files.length;
        return isFileExist;
    } catch (error) {
        console.log("Error checking CID existence:", error);
        throwActionError(error);
    }
}
