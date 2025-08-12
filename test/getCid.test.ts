import { pinata } from "@/lib/pinata-config";

test("Coba ambil file dari cid", async () => {
    const filesPublicPromise = pinata.files.public
        .list()
        .cid("bafybeicxlyddqqxbjps6ai26gxzplbszfrpotfju3ntfog4tbdvnn2iz5u");
    const filesPrivatePromise = pinata.files.private
        .list()
        .cid("bafybeicxlyddqqxbjps6ai26gxzplbszfrpotfju3ntfog4tbdvnn2iz5u");

    const [filesPublic, filesPrivate] = await Promise.all([filesPublicPromise, filesPrivatePromise]);

    const isFileExist = !!filesPublic.files.length || !!filesPrivate.files.length;

    console.log("Is File Exist:", isFileExist);

    console.log("Files Public:", filesPublic);
    console.log("Files Private:", filesPrivate);
});
