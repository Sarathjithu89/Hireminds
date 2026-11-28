import type { UserEntity, UserRole } from "../entities/user.entity.js";

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  create(data: CreateUserInput): Promise<UserEntity>;
}
