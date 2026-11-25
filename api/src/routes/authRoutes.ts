import { Router } from "express";
import { userController } from "../controllers/userController";
import { validateBody } from "../middlewares/validationMiddleware";
import { loginSchema, createResidentSchema } from "shared";
import { apartmentService } from "../services/apartmentService";
import { residentService } from "../services/residentService";

const authRoutes = Router();

/**
 * @openapi
 * /auth/apartments:
 *   get:
 *     tags:
 *       - Autenticação
 *     summary: Lista pública de apartamentos para seleção no cadastro
 *     description: Retorna os apartamentos disponíveis para que um novo morador selecione a unidade no formulário de auto-cadastro.
 *     responses:
 *       200:
 *         description: Lista de apartamentos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ApartmentResponse'
 */
authRoutes.get("/apartments", async (req, res, next) => {
  try {
    const apartments = await apartmentService.findAll();
    return res.status(200).json(apartments);
  } catch (error) {
    return next(error);
  }
});

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Cadastro de novo morador/usuário
 *     description: Permite o auto-cadastro de morador com usuário de acesso ao sistema (senha criptografada com bcrypt).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateResidentRequest'
 *     responses:
 *       201:
 *         description: Cadastro realizado com sucesso.
 *       400:
 *         description: Dados inválidos enviados.
 *       409:
 *         description: CPF ou e-mail já cadastrado.
 */
authRoutes.post(
  "/register",
  validateBody(createResidentSchema),
  async (req, res, next) => {
    try {
      const resident = await residentService.create(req.body);
      return res.status(201).json({
        message: "Cadastro realizado com sucesso! Faça login para continuar.",
        resident,
      });
    } catch (error) {
      return next(error);
    }
  }
);

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
