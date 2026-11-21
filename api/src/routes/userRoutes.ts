import { Router } from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validationMiddleware";
import { changePasswordSchema } from "shared";

const userRoutes = Router();

userRoutes.get(
  "/me",
  authMiddleware,
  userController.findMe
);

userRoutes.patch(
  "/change-password",
  authMiddleware,
  validateBody(changePasswordSchema),
  userController.changePassword
);

export default userRoutes;