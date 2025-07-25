import { JOSEError, JWTInvalid } from "jose/errors";
import { NextResponse } from "next/server";

export function errorHandler500(error: unknown) {
    return NextResponse.json(
        {
            error: "Internal Server Error",
            message: `An error occurred while processing your request: ${
                error instanceof Error ? error.message : "Unknown error"
            }`,
        },
        { status: 500 }
    );
}

export function notOkResponse(error: string, message: string, status: number) {
    return NextResponse.json(
        {
            error: error,
            message: message
        },
        { status: status }
    );
}