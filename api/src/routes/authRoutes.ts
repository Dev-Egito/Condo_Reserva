import { Router } from "express";
import { userController } from "../controllers/userController";
import { validateBody } from "../middlewares/validationMiddleware";
import { loginSchema } from "shared";

const authRoutes = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Realiza o login do usuário
 *     description: Autentica um usuário e retorna seus dados e um token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Dados enviados inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: E-mail ou senha inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRoutes.post(
  "/login",
  validateBody(loginSchema),
  userController.login
);

export default authRoutes;