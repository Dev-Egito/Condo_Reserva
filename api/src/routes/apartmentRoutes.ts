import { Router } from "express";
import { Role } from "../generated/prisma/client";
import { apartmentController } from "../controllers/apartmentController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { validateBody, validateParams } from "../middlewares/validationMiddleware";
import {
  createApartmentSchema,
  updateApartmentSchema,
  idParamSchema,
} from "shared";

const apartmentRoutes = Router();

apartmentRoutes.use(authMiddleware);

apartmentRoutes.get(
  "/",
  roleMiddleware(Role.ADMIN, Role.RESIDENT),
  apartmentController.findAll
);

apartmentRoutes.get(
  "/:id",
  roleMiddleware(Role.ADMIN, Role.RESIDENT),
  validateParams(idParamSchema),
  apartmentController.findById
);

apartmentRoutes.post(
  "/",
  roleMiddleware(Role.ADMIN),
  validateBody(createApartmentSchema),
  apartmentController.create
);

apartmentRoutes.put(
  "/:id",
  roleMiddleware(Role.ADMIN),
  validateParams(idParamSchema),
  validateBody(updateApartmentSchema),
  apartmentController.update
);

apartmentRoutes.delete(
  "/:id",
  roleMiddleware(Role.ADMIN),
  validateParams(idParamSchema),
  apartmentController.delete
);

export default apartmentRoutes;