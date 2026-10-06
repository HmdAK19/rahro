import "server-only";

import { Pool } from "pg";

const globalDatabase = globalThis as typeof globalThis & { __rahroPool?: Pool };

export function getDatabasePool(): Pool {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) throw new Error("DATABASE_URL is not configured");
  if (!globalDatabase.__rahroPool)
    globalDatabase.__rahroPool = new Pool({
      connectionString,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: true } : false,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });

  return globalDatabase.__rahroPool;
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await getDatabasePool().query("SELECT 1");

    return true;
  } catch {
    return false;
  }
}
