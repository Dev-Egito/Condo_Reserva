import { Router } from "express";
import { leisureAreaController } from "../controllers/leisureAreaController";

const leisureAreaRoutes = Router();

leisureAreaRoutes.post("/", leisureAreaController.create);
leisureAreaRoutes.get("/", leisureAreaController.findAll);
leisureAreaRoutes.get("/:id", leisureAreaController.findById);
leisureAreaRoutes.put("/:id", leisureAreaController.update);
leisureAreaRoutes.delete("/:id", leisureAreaController.delete);

export default leisureAreaRoutes;