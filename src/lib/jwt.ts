import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export interface IPayload extends JWTPayload {
    username: string;
    role: "administrator" | "staff";
    id: string;
}

type Payload = {
    username: string;
    role: "administrator" | "staff";
    id: string;
};

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function signJwt(payload: Payload): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("12h")
        .setIssuedAt()
        .sign(secret);
}

export async function verifyJwt(token: string): Promise<Payload> {
    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET!)
        );
        return payload as Payload;
    } catch (error) {
        console.error("JWT verification failed:", error);
        throw new Error("Invalid token");
    }
}

export async function signToken(payload: IPayload): Promise<string> {
    const token = new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("12h")
        .setIssuedAt()
        .sign(secret);
    return token;
}

export async function verifyToken(
    token: string
): Promise<{ isValid: boolean; payload: IPayload | null }> {
    try {
        const payload = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET!)
        );
        return { isValid: true, payload: payload.payload as IPayload };
    } catch (error) {
        return { isValid: false, payload: null };
    }
}

export async function isJwtValid(token: string | undefined): Promise<boolean> {
    if (!token) {
        return false;
    }
    try {
        await verifyJwt(token);
        return true;
    } catch {
        return false;
    }
}
