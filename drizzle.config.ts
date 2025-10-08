import { defineConfig } from "drizzle-kit";

const uri = process.env.DB_URI;

if(!uri){
    throw new Error("Database URI is undefined")
}

export default defineConfig({
    schema: "./src/lib/db/schema.ts",
    dialect: "mysql",
    dbCredentials: {
        url: uri,
    },
});
