import { Router } from "express";
import { residentController } from "../controllers/residentController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { Role } from "../generated/prisma/client";

const residentRoutes = Router();

residentRoutes.use(authMiddleware);
residentRoutes.use(roleMiddleware(Role.ADMIN));

residentRoutes.post("/", residentController.create);
residentRoutes.get("/", residentController.findAll);
residentRoutes.get("/:id", residentController.findById);
residentRoutes.put("/:id", residentController.update);
residentRoutes.delete("/:id", residentController.delete);

export default residentRoutes;
