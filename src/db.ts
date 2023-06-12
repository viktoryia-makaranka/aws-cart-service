import { Pool, QueryResult } from 'pg';

const {
    DB_PASSWORD,
    DB_USERNAME,
    DB_NAME,
    DB_PORT,
    DB_HOST,
} = process.env;

const options = {
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_NAME,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 10000,
};

let pool: Pool;

if (!pool) {
    pool = new Pool(options);
}

export const query = async <T>(query: string, values: any[] = []): Promise<QueryResult<T>> => {
    const poolClient = await pool.connect();

    let result: QueryResult;

    try {
        result = await pool.query<T>(query, values);
    } catch (err) {
        console.log(err);
        return err;
    } finally {
        poolClient.release();
    }
    return result;
};
