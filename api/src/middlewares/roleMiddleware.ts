import { Request, Response, NextFunction } from "express";
import { Role } from "../generated/prisma/client";
import { AppError } from "../utils/appError";

export function roleMiddleware(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Usuário não autenticado.", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("Você não tem permissão para acessar este recurso.", 403);
    }

    return next();
  };
}
