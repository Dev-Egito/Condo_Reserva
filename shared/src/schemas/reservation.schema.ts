import { z } from "zod";

const reservationFields = {
  residentId: z
    .uuid({ error: "Informe um identificador de morador válido." })
    .meta({ example: "550e8400-e29b-41d4-a716-446655440000" }),

  leisureAreaId: z
    .uuid({ error: "Informe um identificador de área de lazer válido." })
    .meta({ example: "550e8400-e29b-41d4-a716-446655440001" }),

  startAt: z
    .iso.datetime({
        offset: true,
        error: "Informe uma data inicial válida no formato ISO.",
    })
    .meta({ example: "2026-12-01T14:00:00.000Z" }),

  endAt: z
    .iso.datetime({
        offset: true,
        error: "Informe uma data final válida no formato ISO.",
    })
    .meta({ example: "2026-12-01T16:00:00.000Z" }),
};

// Cadastro de reserva
export const createReservationSchema = z.strictObject({
  ...reservationFields,
  residentId: reservationFields.residentId.optional(),
});

// Atualização de reserva
export const updateReservationSchema = z
  .strictObject(reservationFields)
  .partial()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "Informe pelo menos um campo para atualizar.",
    }
  );

export type CreateReservationInput = z.infer<
  typeof createReservationSchema
>;

export type UpdateReservationInput = z.infer<
  typeof updateReservationSchema
>;