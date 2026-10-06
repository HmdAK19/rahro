import type { User } from "../domain/user";
import type { UserRepository } from "../domain/user-repository";

import { ScryptPasswordService } from "./scrypt-password-service";

export class InMemoryUserRepository implements UserRepository {
  private user?: User;
  async findByEmail(email: string) {
    const adminEmail = (process.env.DEV_ADMIN_EMAIL ?? "admin@rahro.local").toLowerCase();

    if (email !== adminEmail) return undefined;
    if (!this.user)
      this.user = {
        id: "dev-admin",
        email: adminEmail,
        displayName: "Rahro Admin",
        passwordHash: await new ScryptPasswordService().hash(
          process.env.DEV_ADMIN_PASSWORD ?? "Rahro123!",
        ),
        role: "admin",
        isActive: true,
      };

    return this.user;
  }
}
