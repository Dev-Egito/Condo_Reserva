import { z } from "zod";

const residentFields = {
  fullName: z
    .string({ error: "O nome completo é obrigatório." })
    .trim()
    .min(1, "O nome completo é obrigatório.")
    .meta({ example: "João da Silva" }),

  cpf: z
    .string({ error: "O CPF é obrigatório." })
    .trim()
    .min(1, "O CPF é obrigatório.")
    .meta({ example: "12345678901" }),

  phone: z
    .string({ error: "O telefone é obrigatório." })
    .trim()
    .min(1, "O telefone é obrigatório.")
    .meta({ example: "83999998888" }),

  apartmentId: z
    .uuid({ error: "Informe um identificador de apartamento válido." })
    .meta({ example: "550e8400-e29b-41d4-a716-446655440000" }),
};

// Cadastro de morador e criação do usuário vinculado
export const createResidentSchema = z.strictObject({
  ...residentFields,

  email: z
    .email({ error: "Informe um e-mail válido." })
    .trim()
    .toLowerCase()
    .meta({ example: "joao@email.com" }),

  password: z
    .string({ error: "A senha é obrigatória." })
    .min(8, "A senha deve ter pelo menos 8 caracteres.")
    .meta({ example: "senha123" }),
});

// Atualização de morador
export const updateResidentSchema = z
  .strictObject(residentFields)
  .partial()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "Informe pelo menos um campo para atualizar.",
    }
  );

export type CreateResidentInput = z.infer<
  typeof createResidentSchema
>;

export type UpdateResidentInput = z.infer<
  typeof updateResidentSchema
>;
