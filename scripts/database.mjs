import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) throw new Error("DATABASE_URL is required");

const pool = new pg.Pool({
  connectionString,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: true } : false,
  max: 2,
});

async function migrate() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      "CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())",
    );
    const files = (await readdir(resolve("database/migrations")))
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const applied = await client.query("SELECT 1 FROM schema_migrations WHERE name = $1", [file]);

      if (applied.rowCount) continue;
      await client.query(await readFile(resolve("database/migrations", file), "utf8"));
      await client.query("INSERT INTO schema_migrations(name) VALUES($1)", [file]);
      process.stdout.write(`Applied ${file}\n`);
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
}

async function seed() {
  const files = (await readdir(resolve("database/seeds")))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    await pool.query(await readFile(resolve("database/seeds", file), "utf8"));
    process.stdout.write(`Seeded ${file}\n`);
  }
}

try {
  if (process.argv[2] === "migrate") await migrate();
  else if (process.argv[2] === "seed") await seed();
  else throw new Error("Use migrate or seed");
} finally {
  await pool.end();
}
