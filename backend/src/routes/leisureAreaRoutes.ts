import { Router } from "express";
import { leisureAreaController } from "../controllers/leisureAreaController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { Role } from "../generated/prisma/client";

const leisureAreaRoutes = Router();

leisureAreaRoutes.use(authMiddleware);

leisureAreaRoutes.get("/", roleMiddleware(Role.ADMIN, Role.RESIDENT), leisureAreaController.findAll);
leisureAreaRoutes.get("/:id", roleMiddleware(Role.ADMIN, Role.RESIDENT), leisureAreaController.findById);
leisureAreaRoutes.post("/", roleMiddleware(Role.ADMIN), leisureAreaController.create);
leisureAreaRoutes.put("/:id", roleMiddleware(Role.ADMIN), leisureAreaController.update);
leisureAreaRoutes.delete("/:id", roleMiddleware(Role.ADMIN), leisureAreaController.delete);

export default leisureAreaRoutes;