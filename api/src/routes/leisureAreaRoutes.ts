import { Router } from "express";
import { Role } from "../generated/prisma/client";
import { leisureAreaController } from "../controllers/leisureAreaController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import {
  validateBody,
  validateParams,
} from "../middlewares/validationMiddleware";
import {
  createLeisureAreaSchema,
  updateLeisureAreaSchema,
  idParamSchema,
} from "shared";

const leisureAreaRoutes = Router();

leisureAreaRoutes.use(authMiddleware);

leisureAreaRoutes.get(
  "/",
  roleMiddleware(Role.ADMIN, Role.RESIDENT),
  leisureAreaController.findAll
);

leisureAreaRoutes.get(
  "/:id",
  roleMiddleware(Role.ADMIN, Role.RESIDENT),
  validateParams(idParamSchema),
  leisureAreaController.findById
);

leisureAreaRoutes.post(
  "/",
  roleMiddleware(Role.ADMIN),
  validateBody(createLeisureAreaSchema),
  leisureAreaController.create
);

leisureAreaRoutes.put(
  "/:id",
  roleMiddleware(Role.ADMIN),
  validateParams(idParamSchema),
  validateBody(updateLeisureAreaSchema),
  leisureAreaController.update
);

leisureAreaRoutes.delete(
  "/:id",
  roleMiddleware(Role.ADMIN),
  validateParams(idParamSchema),
  leisureAreaController.delete
);

export default leisureAreaRoutes;