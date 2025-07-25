import db from "@/lib/db";
import { directories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { errorHandler500, notOkResponse } from "../../helpers";
import { isJwtValid, verifyJwt } from "@/lib/jwt";
import { DirectoryTypes } from "@/types";

export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
    try {
        const id = params.id;
        const token = req.cookies.get("token")?.value;
        const isTokenValid = await isJwtValid(token);

        const [directory] = await db.select({
            id: directories.id,
            name: directories.name,
            description: directories.description,
            isPrivate: directories.isPrivate,
        }).from(directories).where(eq(directories.id, id));

        if (!directory){
            return notOkResponse(
                "Not Found",
                `Direktori dengan ID ${id} tidak ditemukan`,
                404
            )
        }
        if(directory.isPrivate){
            if (!token || !isTokenValid) {
                return notOkResponse(
                    "Unauthorized",
                    "Anda harus login untuk mengakses direktori ini",
                    401
                );
            }
        }

        return NextResponse.json(directory, { status: 200 });

    } catch (error) {
        return errorHandler500(error);
    }

}

export async function PATCH(req: NextRequest, {params}: {params: {id: string}}) {
    try {
        const id = params.id;
        const token = req.cookies.get("token")?.value;
        const isTokenValid = await isJwtValid(token);
        if (!token || !isTokenValid) {
            return notOkResponse(
                "Unauthorized",
                "Anda harus login untuk memperbarui direktori",
                401
            );
        }
        if (!id) {
            return notOkResponse(
                "Bad Request",
                "ID direktori harus diisi",
                400
            );
        }

        const { name, description, isPrivate }: Partial<DirectoryTypes> = await req.json();

        const existingDirectory = await db
            .select()
            .from(directories)
            .where(eq(directories.id, id));

        if (existingDirectory.length === 0) {
            return notOkResponse(
                "Not Found",
                `Direktori dengan ID "${id}" tidak ditemukan`,
                404
            );
        }

        const updatedFields: Partial<DirectoryTypes> = {};
        if (name) updatedFields.name = name;
        if (description) updatedFields.description = description;
        if (isPrivate != undefined) updatedFields.isPrivate = isPrivate;

        if (Object.keys(updatedFields).length === 0) {
            return notOkResponse(
                "Bad Request",
                "Tidak ada data yang diperbarui, mohon berikan setidaknya satu field untuk diperbarui",
                400
            );
        }

        await db
            .update(directories)
            .set(updatedFields)
            .where(eq(directories.id, id));

        return NextResponse.json(
            { message: "Direktori berhasil diperbarui" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error partially updating directory:", error);
        return errorHandler500(error);
    }
}

export async function DELETE(req: NextRequest, {params}: {params: {id: string}}) {
    try {
        const id = params.id;
        const token = req.cookies.get("token")?.value;
        const isTokenValid = await isJwtValid(token);
        if (!token || !isTokenValid) {
            return notOkResponse(
                "Unauthorized",
                "Anda harus login untuk menghapus direktori",
                401
            );
        }

        if (!id) {
            return notOkResponse(
                "Bad Request",
                "ID direktori harus diisi",
                400
            );
        }

        const existingDirectory = await db
            .select()
            .from(directories)
            .where(eq(directories.id, id));

        if (existingDirectory.length === 0) {
            return notOkResponse(
                "Not Found",
                `Direktori dengan ID "${id}" tidak ditemukan`,
                404
            );
        }

        await db.delete(directories).where(eq(directories.id, id));

        return NextResponse.json(
            { message: "Direktori berhasil dihapus" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting directory:", error);
        return errorHandler500(error);
    }
}