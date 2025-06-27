import { defineConfig } from "drizzle-kit";
export default defineConfig({
    schema: "./src/db/schema.ts",
    dialect: "mysql",
    dbCredentials: {
        host: "mysql-laznas-archive-app-laznas-archive-app.c.aivencloud.com",
        port: 20735,
        user: "next-app",
        password: "AVNS_D_Fk5KSqEYeOyu1U3LT",
        database: "laznas_archive_app",
    },
});
