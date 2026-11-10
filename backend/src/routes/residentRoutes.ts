import { Router } from "express";
import { residentController } from "../controllers/residentController";

const residentRoutes = Router();

residentRoutes.post("/", residentController.create);
residentRoutes.get("/", residentController.findAll);
residentRoutes.get("/:id", residentController.findById);
residentRoutes.put("/:id", residentController.update);
residentRoutes.delete("/:id", residentController.delete);

export default residentRoutes;
