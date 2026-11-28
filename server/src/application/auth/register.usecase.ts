import type { SafeUser } from "../../domain/entities/user.entity.js";
import { ConflictError } from "../../domain/errors/app-error.js";
import type { IPasswordHasher } from "../../domain/interfaces/password-hasher.interface.js";
import type {
  AuthTokens,
  ITokenService,
} from "../../domain/interfaces/token-service.interface.js";
import type { IUserRepository } from "../../domain/interfaces/user-repository.interface.js";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface AuthResult {
  user: SafeUser;
  tokens: AuthTokens;
}

export class RegisterUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: RegisterInput): Promise<AuthResult> {
    const normalizedEmail = input.email.trim().toLowerCase();
    const existing = await this.userRepo.findByEmail(normalizedEmail);

    if (existing) {
      throw new ConflictError("An account with this email already exists");
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const created = await this.userRepo.create({
      name: input.name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: "recruiter", //because public signup supplied by client
    });

    const tokens = this.tokenService.generateTokens({
      userId: created.id,
      role: created.role,
    });

    return {
      user: {
        id: created.id,
        name: created.name,
        email: created.email,
        role: created.role,
        createdAt: created.createdAt,
      },
      tokens,
    };
  }
}
