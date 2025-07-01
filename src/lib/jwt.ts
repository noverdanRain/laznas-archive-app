import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import jwt from "jsonwebtoken";

type Payload = {
    username: string;
    role: string;
};

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function signJwt(payload: Payload): Promise<string> {
    // const payloads = jwt.sign(payload, process.env.JWT_SECRET!, {
    //     expiresIn: "12h",
    // });
    // return payloads;

    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("12h")
        .setIssuedAt()
        .sign(secret);
}

export async function verifyJwt(token: string): Promise<JWTPayload> {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // return decoded as JWTPayload;

    const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    return payload;
}
