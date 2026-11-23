import { Router } from "express";
import { Role } from "../generated/prisma/client";
import { apartmentController } from "../controllers/apartmentController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import {
  validateBody,
  validateParams,
} from "../middlewares/validationMiddleware";
import {
  createApartmentSchema,
  updateApartmentSchema,
  idParamSchema,
} from "shared";

const apartmentRoutes = Router();

apartmentRoutes.use(authMiddleware);

/**
 * @openapi
 * /apartments:
 *   get:
 *     tags:
 *       - Apartamentos
 *     summary: Lista todos os apartamentos
 *     description: Disponível para ADMIN e RESIDENT.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de apartamentos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ApartmentResponse'
 *       401:
 *         description: Token ausente, inválido ou expirado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Usuário sem permissão.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
apartmentRoutes.get(
  "/",
  roleMiddleware(Role.ADMIN, Role.RESIDENT),
  apartmentController.findAll
);

/**
 * @openapi
 * /apartments/{id}:
 *   get:
 *     tags:
 *       - Apartamentos
 *     summary: Busca um apartamento pelo ID
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
 *         description: Apartamento encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApartmentResponse'
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
 *       404:
 *         description: Apartamento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
apartmentRoutes.get(
  "/:id",
  roleMiddleware(Role.ADMIN, Role.RESIDENT),
  validateParams(idParamSchema),
  apartmentController.findById
);

/**
 * @openapi
 * /apartments:
 *   post:
 *     tags:
 *       - Apartamentos
 *     summary: Cadastra um apartamento
 *     description: Operação exclusiva para ADMIN.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApartmentRequest'
 *     responses:
 *       201:
 *         description: Apartamento cadastrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApartmentResponse'
 *       400:
 *         description: Dados inválidos.
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
 *       409:
 *         description: Já existe apartamento com esse bloco e número.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
apartmentRoutes.post(
  "/",
  roleMiddleware(Role.ADMIN),
  validateBody(createApartmentSchema),
  apartmentController.create
);

/**
 * @openapi
 * /apartments/{id}:
 *   put:
 *     tags:
 *       - Apartamentos
 *     summary: Atualiza um apartamento
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
 *             $ref: '#/components/schemas/ApartmentUpdateRequest'
 *     responses:
 *       200:
 *         description: Apartamento atualizado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApartmentResponse'
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
 *         description: Apartamento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Já existe apartamento com esse bloco e número.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
apartmentRoutes.put(
  "/:id",
  roleMiddleware(Role.ADMIN),
  validateParams(idParamSchema),
  validateBody(updateApartmentSchema),
  apartmentController.update
);

/**
 * @openapi
 * /apartments/{id}:
 *   delete:
 *     tags:
 *       - Apartamentos
 *     summary: Exclui um apartamento
 *     description: Operação exclusiva para ADMIN. Não é possível excluir apartamentos vinculados a moradores.
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
 *         description: Apartamento excluído com sucesso.
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
 *         description: Apartamento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Apartamento possui moradores vinculados.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
apartmentRoutes.delete(
  "/:id",
  roleMiddleware(Role.ADMIN),
  validateParams(idParamSchema),
  apartmentController.delete
);

export default apartmentRoutes;