import { Router } from "express";
import { Role } from "../generated/prisma/client";
import { residentController } from "../controllers/residentController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import {
  validateBody,
  validateParams,
} from "../middlewares/validationMiddleware";
import {
  createResidentSchema,
  updateResidentSchema,
  idParamSchema,
} from "shared";

const residentRoutes = Router();

residentRoutes.use(authMiddleware);
residentRoutes.use(roleMiddleware(Role.ADMIN));

/**
 * @openapi
 * /residents:
 *   post:
 *     tags:
 *       - Moradores
 *     summary: Cadastra um morador
 *     description: Cria uma conta de usuário com papel RESIDENT e o cadastro do morador associado.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateResidentRequest'
 *     responses:
 *       201:
 *         description: Morador cadastrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResidentResponse'
 *       400:
 *         description: Dados enviados inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Operação exclusiva para ADMIN.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Apartamento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: CPF ou e-mail já cadastrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
residentRoutes.post(
  "/",
  validateBody(createResidentSchema),
  residentController.create
);

/**
 * @openapi
 * /residents:
 *   get:
 *     tags:
 *       - Moradores
 *     summary: Lista todos os moradores
 *     description: Operação exclusiva para ADMIN.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de moradores com seus apartamentos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ResidentResponse'
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Operação exclusiva para ADMIN.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
residentRoutes.get("/", residentController.findAll);

/**
 * @openapi
 * /residents/{id}:
 *   get:
 *     tags:
 *       - Moradores
 *     summary: Busca um morador pelo ID
 *     description: Operação exclusiva para ADMIN.
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
 *         description: Morador encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResidentResponse'
 *       400:
 *         description: ID inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Operação exclusiva para ADMIN.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Morador não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
residentRoutes.get(
  "/:id",
  validateParams(idParamSchema),
  residentController.findById
);

/**
 * @openapi
 * /residents/{id}:
 *   put:
 *     tags:
 *       - Moradores
 *     summary: Atualiza um morador
 *     description: Operação exclusiva para ADMIN. É necessário informar pelo menos um campo.
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
 *             $ref: '#/components/schemas/ResidentUpdateRequest'
 *     responses:
 *       200:
 *         description: Morador atualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResidentResponse'
 *       400:
 *         description: ID ou dados inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Operação exclusiva para ADMIN.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Morador ou apartamento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: CPF já cadastrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
residentRoutes.put(
  "/:id",
  validateParams(idParamSchema),
  validateBody(updateResidentSchema),
  residentController.update
);

/**
 * @openapi
 * /residents/{id}:
 *   delete:
 *     tags:
 *       - Moradores
 *     summary: Exclui um morador
 *     description: Operação exclusiva para ADMIN.
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
 *         description: Morador excluído com sucesso.
 *       400:
 *         description: ID inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Operação exclusiva para ADMIN.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Morador não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Não é possível excluir um morador que possui reservas vinculadas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
residentRoutes.delete(
  "/:id",
  validateParams(idParamSchema),
  residentController.delete
);

export default residentRoutes;