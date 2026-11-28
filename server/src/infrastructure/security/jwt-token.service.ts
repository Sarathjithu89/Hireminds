import jwt, { type SignOptions } from "jsonwebtoken";
import { UnauthorizedError } from "../../domain/errors/app-error.js";
import type {
  AuthTokens,
  ITokenService,
  TokenPayload,
} from "../../domain/interfaces/token-service.interface.js";
import { env } from "../config/env.js";

export class JwtTokenService implements ITokenService {
  generateTokens(payload: TokenPayload): AuthTokens {
    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as NonNullable<
        SignOptions["expiresIn"]
      >,
    });
    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as NonNullable<
        SignOptions["expiresIn"]
      >,
    });
    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): TokenPayload {
    return this.verify(token, env.JWT_ACCESS_SECRET);
  }

  verifyRefreshToken(token: string): TokenPayload {
    return this.verify(token, env.JWT_REFRESH_SECRET);
  }

  private verify(token: string, secret: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, secret) as TokenPayload;
      return { userId: decoded.userId, role: decoded.role };
    } catch {
      throw new UnauthorizedError("Invalid or expired token");
    }
  }
}
