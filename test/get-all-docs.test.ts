import { getDirectories } from "@/lib/actions";

test("Revalidate Tags Docs Count", async () => {
    const dirs = await getDirectories({
        token: "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InZhcmlvbiIsInJvbGUiOiJzdGFmZiIsImlkIjoiNDI0OTZmZDctNmIxMC0xMWYwLWE0MjAtODYyY2NmYjA0MDcxIiwiZXhwIjoxNzUzOTc2MDE3LCJpYXQiOjE3NTM5MzI4MTd9.Rf7i7HPmJXI1Vok9Kp1FFCOeb-MD0XenaNWQnNnDS6c",
    });

    console.log("Directories:", dirs);
});
