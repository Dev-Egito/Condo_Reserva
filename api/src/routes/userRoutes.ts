import { Router } from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";

const userRoutes = Router();

userRoutes.get("/me", authMiddleware, userController.findMe);
userRoutes.patch("/change-password", authMiddleware, userController.changePassword);

export default userRoutes;