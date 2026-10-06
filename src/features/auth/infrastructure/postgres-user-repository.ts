import type { Pool } from "pg";

import type { User, UserRole } from "../domain/user";
import type { UserRepository } from "../domain/user-repository";

type Row = {
  id: string;
  email: string;
  display_name: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
};

export class PostgresUserRepository implements UserRepository {
  constructor(private readonly pool: Pool) {}
  async findByEmail(email: string) {
    const result = await this.pool.query<Row>(
      "SELECT id,email,display_name,password_hash,role,is_active FROM users WHERE lower(email)=lower($1)",
      [email],
    );
    const row = result.rows[0];

    return row
      ? ({
          id: row.id,
          email: row.email,
          displayName: row.display_name,
          passwordHash: row.password_hash,
          role: row.role,
          isActive: row.is_active,
        } satisfies User)
      : undefined;
  }
}
