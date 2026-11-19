import { Request, Response } from "express";
import { userService } from "../services/userService";

export const userController = {
  async login(req: Request, res: Response) {
    const result = await userService.login(req.body);

    return res.status(200).json(result);
  },

  async findMe(req: Request, res: Response) {
    const user = await userService.findMe(req.user!.id);
    return res.status(200).json(user);
  },

  async changePassword(req: Request, res: Response) {
        const { currentPassword, newPassword } = req.body;

    await userService.changePassword(
        req.user!.id,
        currentPassword,
        newPassword
    );

    return res.status(200).json({
        message: "Senha alterada com sucesso.",
    });
  },
};
