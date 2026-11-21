import { z } from "zod";

const leisureAreaFields = {
  name: z
    .string({ error: "O nome da área é obrigatório." })
    .trim()
    .min(1, "O nome da área é obrigatório.")
    .meta({ example: "Piscina" }),

  description: z
    .string()
    .trim()
    .nullable()
    .optional()
    .meta({ example: "Área de lazer com piscina adulto e infantil." }),

  active: z
    .boolean()
    .optional()
    .meta({ example: true }),
};

// Cadastro de área de lazer
export const createLeisureAreaSchema = z.strictObject(
  leisureAreaFields
);

// Atualização de área de lazer
export const updateLeisureAreaSchema = z
  .strictObject(leisureAreaFields)
  .partial()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "Informe ao menos um campo para atualizar.",
    }
  );

export type CreateLeisureAreaInput = z.infer<
  typeof createLeisureAreaSchema
>;

export type UpdateLeisureAreaInput = z.infer<
  typeof updateLeisureAreaSchema
>;