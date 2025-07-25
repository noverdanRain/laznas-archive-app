import { DirectoryTypes } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { errorHandler500, notOkResponse } from "../helpers";
import db from "@/lib/db";
import { directories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { isJwtValid } from "@/lib/jwt";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        const isTokenValid = await isJwtValid(token);

        if (!token || !isTokenValid) {
            const publicDirectories = await db.select({
                id: directories.id,
                name: directories.name,
                description: directories.description,
                isPrivate: directories.isPrivate,
            }).from(directories).where(eq(directories.isPrivate, false));
            return NextResponse.json(publicDirectories, { status: 200 });
        }
        const allDirectories = await db.select({
            id: directories.id,
            name: directories.name,
            description: directories.description,
            isPrivate: directories.isPrivate,
        }).from(directories);
        return NextResponse.json(allDirectories, { status: 200 });
    } catch (error) {
        console.error("Error fetching directories:", error);
        return errorHandler500(error);
    }
}

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        const isTokenValid = await isJwtValid(token);

        if (!token || !isTokenValid) {
            return notOkResponse(
                "Unauthorized",
                "Anda harus login untuk membuat direktori",
                401
            );
        }
        const directory: DirectoryTypes = await req.json();
        if (!directory.name || !directory.isPrivate === undefined) {
            return notOkResponse(
                "Bad Request",
                "Nama dan visibilitas direktori harus diisi",
                400
            );
        }

        const sameDirectory = await db
            .select()
            .from(directories)
            .where(eq(directories.name, directory.name));

        if (sameDirectory.length > 0) {
            return notOkResponse(
                "Conflict",
                `Direktori dengan nama "${directory.name}" sudah ada`,
                409
            );
        }
        const newDirectory: DirectoryTypes = {
            name: directory.name,
            description: directory.description || "",
            isPrivate: directory.isPrivate,
        };
    
        await db.insert(directories).values(newDirectory);
        return NextResponse.json(
            { message: "Direktori berhasil dibuat" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating directory:", error);
        return errorHandler500(error);
    }
}
