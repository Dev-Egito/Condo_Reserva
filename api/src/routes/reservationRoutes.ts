import { Router } from "express";
import { Role } from "../generated/prisma/client";
import { reservationController } from "../controllers/reservationController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import {
  validateBody,
  validateParams,
} from "../middlewares/validationMiddleware";
import {
  createReservationSchema,
  updateReservationSchema,
  idParamSchema,
} from "shared";

const reservationRoutes = Router();

reservationRoutes.use(authMiddleware);

/**
 * @openapi
 * /reservations:
 *   post:
 *     summary: Cria uma reserva
 *     description: RESIDENT reserva para si mesmo. ADMIN deve informar o residentId.
 *     tags: [Reservas]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationRequest'
 *     responses:
 *       201:
 *         description: Reserva criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationResponse'
 *       400:
 *         description: Dados inválidos, morador obrigatório ou área inativa
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Acesso não permitido
 *       404:
 *         description: Morador ou área de lazer não encontrada
 *       409:
 *         description: Já existe uma reserva para a área nesse horário
 */
reservationRoutes.post(
  "/",
  roleMiddleware(Role.ADMIN, Role.RESIDENT),
  validateBody(createReservationSchema),
  reservationController.create
);

/**
 * @openapi
 * /reservations:
 *   get:
 *     summary: Lista todas as reservas
 *     description: Operação disponível somente para ADMIN.
 *     tags: [Reservas]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas ordenadas pela data inicial
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReservationResponse'
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Acesso permitido somente ao ADMIN
 */
reservationRoutes.get(
  "/",
  roleMiddleware(Role.ADMIN),
  reservationController.findAll
);

/**
 * @openapi
 * /reservations/me:
 *   get:
 *     summary: Lista as reservas do morador autenticado
 *     description: Retorna as reservas associadas ao morador autenticado. ADMIN recebe todas as reservas.
 *     tags: [Reservas]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas do morador
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ReservationResponse'
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Cadastro de morador não encontrado
 */
reservationRoutes.get(
  "/me",
  roleMiddleware(Role.ADMIN, Role.RESIDENT),
  reservationController.findMyReservations
);

/**
 * @openapi
 * /reservations/{id}:
 *   get:
 *     summary: Busca uma reserva pelo ID
 *     description: RESIDENT só pode consultar suas próprias reservas.
 *     tags: [Reservas]
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
 *         description: Reserva encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationResponse'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Usuário sem permissão para acessar esta reserva
 *       404:
 *         description: Reserva ou cadastro de morador não encontrado
 */
reservationRoutes.get(
  "/:id",
  roleMiddleware(Role.ADMIN, Role.RESIDENT),
  validateParams(idParamSchema),
  reservationController.findById
);

/**
 * @openapi
 * /reservations/{id}:
 *   put:
 *     summary: Atualiza uma reserva
 *     description: Operação disponível somente para ADMIN. Reservas canceladas não podem ser atualizadas.
 *     tags: [Reservas]
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
 *             $ref: '#/components/schemas/ReservationUpdateRequest'
 *     responses:
 *       200:
 *         description: Reserva atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationResponse'
 *       400:
 *         description: Dados inválidos, área inativa ou reserva cancelada
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Acesso permitido somente ao ADMIN
 *       404:
 *         description: Reserva, morador ou área não encontrada
 *       409:
 *         description: Conflito com outra reserva
 */
reservationRoutes.put(
  "/:id",
  roleMiddleware(Role.ADMIN),
  validateParams(idParamSchema),
  validateBody(updateReservationSchema),
  reservationController.update
);

/**
 * @openapi
 * /reservations/{id}/cancel:
 *   patch:
 *     summary: Cancela uma reserva
 *     description: ADMIN pode cancelar qualquer reserva. RESIDENT só pode cancelar suas próprias reservas.
 *     tags: [Reservas]
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
 *         description: Reserva cancelada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservationResponse'
 *       400:
 *         description: Reserva já cancelada
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Usuário sem permissão para cancelar esta reserva
 *       404:
 *         description: Reserva ou cadastro de morador não encontrado
 */
reservationRoutes.patch(
  "/:id/cancel",
  roleMiddleware(Role.ADMIN, Role.RESIDENT),
  validateParams(idParamSchema),
  reservationController.cancel
);

/**
 * @openapi
 * /reservations/{id}:
 *   delete:
 *     summary: Exclui uma reserva fisicamente
 *     description: Operação exclusiva para ADMIN. Remove permanentemente o registro de reserva.
 *     tags: [Reservas]
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
 *         description: Reserva excluída com sucesso
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Acesso permitido somente ao ADMIN
 *       404:
 *         description: Reserva não encontrada
 */
reservationRoutes.delete(
  "/:id",
  roleMiddleware(Role.ADMIN),
  validateParams(idParamSchema),
  reservationController.delete
);

export default reservationRoutes;