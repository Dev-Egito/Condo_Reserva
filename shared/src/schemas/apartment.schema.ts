import { z } from "zod";

const apartmentFields = {
  block: z
    .string({ error: "O bloco é obrigatório." })
    .trim()
    .min(1, "O bloco é obrigatório.")
    .meta({ example: "A" }),

  number: z
    .string({ error: "O número do apartamento é obrigatório." })
    .trim()
    .min(1, "O número do apartamento é obrigatório.")
    .meta({ example: "101" }),
};

export const createApartmentSchema = z.strictObject(apartmentFields);

export const updateApartmentSchema = z
  .strictObject(apartmentFields)
  .partial()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: "Informe pelo menos um campo para atualizar." }
  );

export type CreateApartmentInput = z.infer<typeof createApartmentSchema>;
export type UpdateApartmentInput = z.infer<typeof updateApartmentSchema>;