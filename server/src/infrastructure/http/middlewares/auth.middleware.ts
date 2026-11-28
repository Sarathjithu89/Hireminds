import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../../../domain/entities/user.entity.js";
import {
  ForbiddenError,
  UnauthorizedError,
} from "../../../domain/errors/app-error.js";
import type {
  ITokenService,
  TokenPayload,
} from "../../../domain/interfaces/token-service.interface.js";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function createAuthMiddleware(tokenService: ITokenService) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : undefined;

    if (!token) {
      next(new UnauthorizedError("Missing Bearer acces token"));
      return;
    }
    req.user = tokenService.verifyAccessToken(token);
    next();
  };
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      next(new ForbiddenError("Insufficient permissions"));
      return;
    }
    next();
  };
}
