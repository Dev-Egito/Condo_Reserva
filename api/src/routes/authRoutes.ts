import { Router } from "express";
import { userController } from "../controllers/userController";
import { validateBody } from "../middlewares/validationMiddleware";
import { loginSchema } from "shared";

const authRoutes = Router();

authRoutes.post(
  "/login",
  validateBody(loginSchema),
  userController.login
);

export default authRoutes;