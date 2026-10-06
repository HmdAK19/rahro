import type { User } from "./user";

export interface UserRepository {
  findByEmail(email: string): Promise<User | undefined>;
}
