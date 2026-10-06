export type UserRole = "admin" | "operations_manager" | "dispatcher" | "viewer";

export interface User {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
  readonly passwordHash: string;
  readonly role: UserRole;
  readonly isActive: boolean;
}

export interface SessionUser {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
  readonly role: UserRole;
}

export const toSessionUser = ({ id, email, displayName, role }: User): SessionUser => ({
  id,
  email,
  displayName,
  role,
});
