import { getDatabasePool } from "@/core/database/pool";

import { AuthenticateUser } from "../application/authenticate-user";
import type { UserRepository } from "../domain/user-repository";
import { InMemoryUserRepository } from "../infrastructure/in-memory-user-repository";
import { PostgresUserRepository } from "../infrastructure/postgres-user-repository";
import { ScryptPasswordService } from "../infrastructure/scrypt-password-service";

let cached: { mode: "memory" | "postgres"; authenticate: AuthenticateUser } | undefined;

export function getAuthContainer() {
  const mode = process.env.DATABASE_URL ? "postgres" : "memory";

  if (!cached || cached.mode !== mode) {
    const users: UserRepository =
      mode === "postgres"
        ? new PostgresUserRepository(getDatabasePool())
        : new InMemoryUserRepository();
    cached = { mode, authenticate: new AuthenticateUser(users, new ScryptPasswordService()) };
  }

  return cached;
}
