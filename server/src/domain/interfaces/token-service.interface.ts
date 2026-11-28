import type { UserRole } from "../entities/user.entity.js";

export interface TokenPayload {
  userId: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenService {
  generateTokens(payload: TokenPayload): AuthTokens;
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): TokenPayload;
}
