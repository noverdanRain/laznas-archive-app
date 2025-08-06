import { pinata } from "@/lib/pinata-config";

export async function pinataPrivateFile(cid: string) {
    try {
        const url = await pinata.gateways.private.createAccessLink({
            cid: cid,
            expires: 120,
        });
        return url;
    } catch (error) {
        console.log("Error fetching private file:", error);
        throw error;
    }
}

export async function pinataPublicFile(cid: string) {
    try {
        const url = await pinata.gateways.public.convert(cid);
        return url;
    } catch (error) {
        console.log("Error fetching public file:", error);
        throw error;
    }
}
