import { UnauthorizedError } from "../../domain/errors/app-error.js";
import type { IPasswordHasher } from "../../domain/interfaces/password-hasher.interface.js";
import type { ITokenService } from "../../domain/interfaces/token-service.interface.js";
import type { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";
import type { AuthResult } from "./register.usecase.js";

export interface LoginInput {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: LoginInput): Promise<AuthResult> {
    const normalizedEmail = input.email.trim().toLowerCase();
    const user = await this.userRepo.findByEmail(normalizedEmail);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isMatch = await this.passwordHasher.compare(
      input.password,
      user.passwordHash,
    );
    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const tokens = this.tokenService.generateTokens({
      userId: user.id,
      role: user.role,
    });
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      tokens,
    };
  }
}
