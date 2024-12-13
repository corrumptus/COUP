import { createPool } from "mysql2";
import type { Pool } from "mysql2/typings/mysql/lib/Pool";

let pool: Pool;

try {
    pool = createPool({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DATABASE
    });
} catch (error) {
    process.exit(1);
}

export default pool.promise();