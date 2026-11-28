import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../../domain/errors/app-error.js";
import { env } from "../../config/env.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: { message: err.message },
      requestId: req.id,
    });
    return;
  }

  req.log?.error({ err }, "Unhandled server error");

  res.status(500).json({
    success: false,
    error: {
      message:
        env.NODE_ENV === "production" ? "Internal server error" : err.message,
    },
    requestId: req.id,
  });
}
