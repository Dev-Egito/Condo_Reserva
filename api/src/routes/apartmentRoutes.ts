import { Router } from "express";
import { Role } from "../generated/prisma/client";
import { apartmentController } from "../controllers/apartmentController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const apartmentRoutes = Router();

apartmentRoutes.use(authMiddleware);

apartmentRoutes.get("/", roleMiddleware(Role.ADMIN, Role.RESIDENT),apartmentController.findAll);
apartmentRoutes.get("/:id", roleMiddleware(Role.ADMIN, Role.RESIDENT), apartmentController.findById);
apartmentRoutes.post("/", roleMiddleware(Role.ADMIN), apartmentController.create);
apartmentRoutes.put("/:id", roleMiddleware(Role.ADMIN), apartmentController.update);
apartmentRoutes.delete("/:id", roleMiddleware(Role.ADMIN), apartmentController.delete);

export default apartmentRoutes;