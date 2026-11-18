import { Router } from "express";
import { userController } from "../controllers/userController";

const authRoutes = Router();

authRoutes.post("/login", userController.login);

export default authRoutes;