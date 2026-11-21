import { Router } from "express";
import { Role } from "../generated/prisma/client";
import { residentController } from "../controllers/residentController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { validateBody, validateParams } from "../middlewares/validationMiddleware";
import {
  createResidentSchema,
  updateResidentSchema,
  idParamSchema,
} from "shared";

const residentRoutes = Router();

residentRoutes.use(authMiddleware);
residentRoutes.use(roleMiddleware(Role.ADMIN));

residentRoutes.post(
  "/",
  validateBody(createResidentSchema),
  residentController.create
);

residentRoutes.get("/", residentController.findAll);

residentRoutes.get(
  "/:id",
  validateParams(idParamSchema),
  residentController.findById
);

residentRoutes.put(
  "/:id",
  validateParams(idParamSchema),
  validateBody(updateResidentSchema),
  residentController.update
);

residentRoutes.delete(
  "/:id",
  validateParams(idParamSchema),
  residentController.delete
);

export default residentRoutes;