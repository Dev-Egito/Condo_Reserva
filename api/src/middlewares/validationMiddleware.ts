import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "../utils/appError";

function getValidationError(error: z.ZodError): string {
  return error.issues
    .map((issue) => issue.message)
    .join("; ");
}

// Validação do corpo da requisição
export function validateBody(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new AppError(getValidationError(result.error), 400);
    }

    req.body = result.data;

    return next();
  };
}

// Validação dos parâmetros da URL
export function validateParams(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      throw new AppError(getValidationError(result.error), 400);
    }

    Object.assign(req.params, result.data);

    return next();
  };
}
