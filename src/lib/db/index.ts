import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
// const db = drizzle({
//     connection: {
//         host: 'mysql-laznas-archive-app-laznas-archive-app.c.aivencloud.com',
//         port: 20735,
//         user: 'next-app',
//         password: 'AVNS_D_Fk5KSqEYeOyu1U3LT',
//         database: 'laznas_archive_app',
//     }
// });

// export default db;

const poolConnection = mysql.createPool({
    host: "mysql-laznas-archive-app-laznas-archive-app.c.aivencloud.com",
    port: 20735,
    user: "next-app",
    password: "AVNS_D_Fk5KSqEYeOyu1U3LT",
    database: "laznas_archive_app",
    connectionLimit: 10,
});

const db = drizzle({ client: poolConnection });

export default db;