import { Router } from "express";
import { Role } from "../generated/prisma/client";
import { reservationController } from "../controllers/reservationController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import {
  validateBody,
  validateParams,
} from "../middlewares/validationMiddleware";
import {
  createReservationSchema,
  updateReservationSchema,
  idParamSchema,
} from "shared";

const reservationRoutes = Router();

reservationRoutes.use(authMiddleware);

reservationRoutes.post(
  "/",
  roleMiddleware(Role.ADMIN, Role.RESIDENT),
  validateBody(createReservationSchema),
  reservationController.create
);

reservationRoutes.get(
  "/",
  roleMiddleware(Role.ADMIN),
  reservationController.findAll
);

reservationRoutes.get(
  "/:id",
  roleMiddleware(Role.ADMIN, Role.RESIDENT),
  validateParams(idParamSchema),
  reservationController.findById
);

reservationRoutes.put(
  "/:id",
  roleMiddleware(Role.ADMIN),
  validateParams(idParamSchema),
  validateBody(updateReservationSchema),
  reservationController.update
);

reservationRoutes.patch(
  "/:id/cancel",
  roleMiddleware(Role.ADMIN, Role.RESIDENT),
  validateParams(idParamSchema),
  reservationController.cancel
);

export default reservationRoutes;