import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/talentmatch';

export const pool = new Pool({
  connectionString,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
});

let isConnected = false;

pool.on('error', (err) => {
  console.error('[PostgreSQL] Unexpected error on idle client:', err.message);
  isConnected = false;
});

export async function checkDbConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    client.release();
    isConnected = true;
    console.log('[PostgreSQL] Connected successfully to database at:', res.rows[0].now);
    return true;
  } catch (error: any) {
    console.warn('[PostgreSQL] Database connection failed:', error.message);
    isConnected = false;
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected;
}

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}
