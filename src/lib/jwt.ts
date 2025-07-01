import { SignJWT, jwtVerify, type JWTPayload } from "jose";

type Payload = {
    username: string;
    role: string;
};

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function signJwt(payload: Payload): Promise<string> {

    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("12h")
        .setIssuedAt()
        .sign(secret);
}

export async function verifyJwt(token: string): Promise<JWTPayload> {

    const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    return payload;
}
