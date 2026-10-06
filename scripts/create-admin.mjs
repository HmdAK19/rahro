import { randomBytes, scrypt as callback } from "node:crypto";
import { promisify } from "node:util";
import pg from "pg";

const [email, password, name = "Rahro Admin"] = process.argv.slice(2);

if (!process.env.DATABASE_URL || !email || !password || password.length < 8)
  throw new Error("Usage: npm run db:create-admin -- email password [name]");

const salt = randomBytes(16).toString("hex"),
  key = await promisify(callback)(password, salt, 64),
  hash = `scrypt:${salt}:${key.toString("hex")}`,
  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: true } : false,
  });

try {
  await pool.query(
    "INSERT INTO users(id,email,display_name,password_hash,role) VALUES($1,$2,$3,$4,'admin') ON CONFLICT(email) DO UPDATE SET display_name=excluded.display_name,password_hash=excluded.password_hash,role='admin',is_active=true",
    [crypto.randomUUID(), email.toLowerCase(), name, hash],
  );
  process.stdout.write(`Admin ${email} is ready\n`);
} finally {
  await pool.end();
}
