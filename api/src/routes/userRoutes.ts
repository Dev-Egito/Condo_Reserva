import { Router } from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateBody } from "../middlewares/validationMiddleware";
import { changePasswordSchema } from "shared";

const userRoutes = Router();

/**
 * @openapi
 * /users/me:
 *   get:
 *     tags:
 *       - Usuários
 *     summary: Consulta os dados do usuário autenticado
 *     description: Retorna os dados da conta associada ao token JWT enviado.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuário não encontrado.
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
userRoutes.get(
  "/me",
  authMiddleware,
  userController.findMe
);

/**
 * @openapi
 * /users/change-password:
 *   patch:
 *     tags:
 *       - Usuários
 *     summary: Altera a senha do usuário autenticado
 *     description: Exige a senha atual e uma nova senha com pelo menos 8 caracteres.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Dados inválidos ou nova senha igual à atual.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token inválido ou senha atual incorreta.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuário não encontrado.
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
userRoutes.patch(
  "/change-password",
  authMiddleware,
  validateBody(changePasswordSchema),
  userController.changePassword
);

export default userRoutes;