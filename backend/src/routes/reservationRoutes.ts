import { Router } from "express";
import { reservationController } from "../controllers/reservationController";

const reservationRoutes = Router();

reservationRoutes.post("/", reservationController.create);
reservationRoutes.get("/", reservationController.findAll);
reservationRoutes.get("/:id", reservationController.findById);
reservationRoutes.put("/:id", reservationController.update);
reservationRoutes.patch("/:id/cancel", reservationController.cancel);

export default reservationRoutes;
