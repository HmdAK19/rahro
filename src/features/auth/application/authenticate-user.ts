import { toSessionUser } from "../domain/user";
import type { UserRepository } from "../domain/user-repository";

import type { PasswordVerifier } from "./password-verifier";

export class InvalidCredentialsError extends Error {
  constructor() {
    super("INVALID_CREDENTIALS");
  }
}

export class AuthenticateUser {
  constructor(
    private readonly users: UserRepository,
    private readonly passwords: PasswordVerifier,
  ) {}
  async execute(email: string, password: string) {
    const user = await this.users.findByEmail(email.trim().toLowerCase());

    if (!user?.isActive || !(await this.passwords.verify(password, user.passwordHash)))
      throw new InvalidCredentialsError();

    return toSessionUser(user);
  }
}
