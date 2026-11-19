import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../generated/prisma/client";
import { AppError } from "../utils/appError";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    throw new AppError("Token não informado.", 401);
  }

  const tokenMatch = authorization.match(/^Bearer\s+(\S+)$/i);

  if (!tokenMatch) {
    throw new AppError("Token inválido.", 401);
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não foi definida.");
  }

  try {
    const decoded = jwt.verify(tokenMatch[1], secret);

    if (
      typeof decoded === "string" ||
      typeof decoded.sub !== "string" ||
      (decoded.role !== Role.ADMIN &&
        decoded.role !== Role.RESIDENT)
    ) {
      throw new AppError("Token inválido.", 401);
    }

    req.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    return next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Token inválido ou expirado.", 401);
  }
}
