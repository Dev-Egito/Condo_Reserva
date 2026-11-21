import { z } from "zod";

export const idParamSchema = z.strictObject({
  id: z.uuid({
    error: "Identificador inválido.",
  }),
});

export type IdParam = z.infer<typeof idParamSchema>;