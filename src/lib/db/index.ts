"server only";

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const uri = process.env.DB_URI;

if(!uri){
    throw new Error("Database URI is undefined")
}

const poolConnection = mysql.createPool({
    uri: uri,
    connectionLimit: 10,
});

const db = drizzle({ client: poolConnection });

export default db;