import { SignJWT } from "jose";
import { getDivisions } from "@/lib/actions";
import { getDirectories } from "@/lib/actions";


test("Sign JWT", async () => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const payload = {
        username: "testuser",
        role: "administrator",
        id: "12345"
    };
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("12h")
        .setIssuedAt()
        .sign(secret);
    console.log("JWT Token:", token);
});

test("Get Divisions", async () => {
    const divisions = await getDivisions();
    console.log("Divisions:", divisions);
});

test("Get Directories", async () => {
    const directories = await getDirectories({
        token: "test-token"
    });
    console.log("Directories:", directories);
});
