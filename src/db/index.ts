import { drizzle } from "drizzle-orm/mysql2";
const db = drizzle({
    connection: {
        host: 'mysql-laznas-archive-app-laznas-archive-app.c.aivencloud.com',
        port: 20735,
        user: 'next-app',
        password: 'AVNS_D_Fk5KSqEYeOyu1U3LT',
        database: 'laznas_archive_app',
    }
});

export default db;