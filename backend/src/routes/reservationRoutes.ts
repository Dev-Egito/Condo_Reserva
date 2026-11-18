import { Router } from "express";
import { reservationController } from "../controllers/reservationController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { Role } from "../generated/prisma/client";

const reservationRoutes = Router();

reservationRoutes.use(authMiddleware);

reservationRoutes.post("/", roleMiddleware(Role.ADMIN, Role.RESIDENT), reservationController.create);
reservationRoutes.get("/", roleMiddleware(Role.ADMIN), reservationController.findAll);
reservationRoutes.get("/:id", roleMiddleware(Role.ADMIN, Role.RESIDENT), reservationController.findById);
reservationRoutes.put("/:id", roleMiddleware(Role.ADMIN), reservationController.update);
reservationRoutes.patch("/:id/cancel", roleMiddleware(Role.ADMIN, Role.RESIDENT), reservationController.cancel);

export default reservationRoutes;
