import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository";
import { AppError } from "../utils/appError";

interface LoginData {
  email: string;
  password: string;
}

export const userService = {
  async login(data: LoginData) {
    if (
      typeof data.email !== "string" ||
      !data.email.trim() ||
      typeof data.password !== "string" ||
      !data.password
    ) {
      throw new AppError(
        "E-mail e senha são obrigatórios.",
        400
      );
    }

    const email = data.email.trim().toLowerCase();

    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    const passwordMatch = await bcrypt.compare(
      data.password,
      user.passwordHash
    );

    if (!passwordMatch) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET não foi definida.");
    }

    const token = jwt.sign(
      { role: user.role },
      secret,
      {
        subject: user.id,
        expiresIn: "1d",
      }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  },

  async findMe(userId: string) {
    const user = await userRepository.findById(userId);
    
    if (!user) {
        throw new AppError("Usuário não encontrado.", 404);
    }

    return user;
  },

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    if (
        typeof currentPassword !== "string" ||
        !currentPassword ||
        typeof newPassword !== "string" ||
        !newPassword
    ) {
        throw new AppError(
        "Informe a senha atual e a nova senha.",
        400
        );
    }

    if (newPassword.length < 8) {
        throw new AppError(
        "A nova senha deve ter pelo menos 8 caracteres.",
        400
        );
    }

    if (currentPassword === newPassword) {
        throw new AppError(
        "A nova senha deve ser diferente da atual.",
        400
        );
    }

    const user = await userRepository.findByIdWithPassword(userId);

    if (!user) {
        throw new AppError("Usuário não encontrado.", 404);
    }

    const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.passwordHash
    );

    if (!passwordMatch) {
        throw new AppError("Senha atual incorreta.", 401);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await userRepository.updatePassword(userId, passwordHash);
  },
};
