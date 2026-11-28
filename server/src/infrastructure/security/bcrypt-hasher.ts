import bcrypt from "bcryptjs";
import type { IPasswordHasher } from "../../domain/interfaces/password-hasher.interface.js";

export class BcryptPasswordHasher implements IPasswordHasher {
  private readonly saltRounds = 12;
  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds);
  }
  compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
