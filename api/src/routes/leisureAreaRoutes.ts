import { Router } from "express";
import { Role } from "../generated/prisma/client";
import { leisureAreaController } from "../controllers/leisureAreaController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import {
  validateBody,
  validateParams,
} from "../middlewares/validationMiddleware";
import {
  createLeisureAreaSchema,
  updateLeisureAreaSchema,
  idParamSchema,
} from "shared";

const leisureAreaRoutes = Router();

leisureAreaRoutes.use(authMiddleware);

/**
 * @openapi
 * /leisure-areas:
 *   get:
 *     summary: Lista as áreas de lazer
 *     tags: [Áreas de lazer]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de áreas de lazer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LeisureAreaResponse'
 *       401:
 *         description: Usuário não autenticado
 */
leisureAreaRoutes.get(
  "/",
  roleMiddleware(Role.ADMIN, Role.RESIDENT),
  leisureAreaController.findAll
);

/**
 * @openapi
 * /leisure-areas/{id}:
 *   get:
 *     summary: Busca uma área de lazer pelo ID
 *     tags: [Áreas de lazer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Área de lazer encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeisureAreaResponse'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Área de lazer não encontrada
 */
leisureAreaRoutes.get(
  "/:id",
  roleMiddleware(Role.ADMIN, Role.RESIDENT),
  validateParams(idParamSchema),
  leisureAreaController.findById
);

/**
 * @openapi
 * /leisure-areas:
 *   post:
 *     summary: Cadastra uma área de lazer
 *     tags: [Áreas de lazer]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeisureAreaRequest'
 *     responses:
 *       201:
 *         description: Área de lazer cadastrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeisureAreaResponse'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Acesso permitido somente ao ADMIN
 */
leisureAreaRoutes.post(
  "/",
  roleMiddleware(Role.ADMIN),
  validateBody(createLeisureAreaSchema),
  leisureAreaController.create
);

/**
 * @openapi
 * /leisure-areas/{id}:
 *   put:
 *     summary: Atualiza uma área de lazer
 *     tags: [Áreas de lazer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LeisureAreaUpdateRequest'
 *     responses:
 *       200:
 *         description: Área de lazer atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LeisureAreaResponse'
 *       400:
 *         description: ID ou dados inválidos
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Acesso permitido somente ao ADMIN
 *       404:
 *         description: Área de lazer não encontrada
 */
leisureAreaRoutes.put(
  "/:id",
  roleMiddleware(Role.ADMIN),
  validateParams(idParamSchema),
  validateBody(updateLeisureAreaSchema),
  leisureAreaController.update
);

/**
 * @openapi
 * /leisure-areas/{id}:
 *   delete:
 *     summary: Exclui uma área de lazer
 *     tags: [Áreas de lazer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Área de lazer excluída
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Acesso permitido somente ao ADMIN
 *       404:
 *         description: Área de lazer não encontrada
 */
leisureAreaRoutes.delete(
  "/:id",
  roleMiddleware(Role.ADMIN),
  validateParams(idParamSchema),
  leisureAreaController.delete
);

export default leisureAreaRoutes;