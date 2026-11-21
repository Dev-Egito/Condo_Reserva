import { z } from "zod";

// Login
export const loginSchema = z.strictObject({
  email: z
    .email({ error: "Informe um e-mail válido." })
    .meta({ example: "morador@email.com" }),

  password: z
    .string({ error: "A senha é obrigatória." })
    .min(1, "A senha é obrigatória.")
    .meta({ example: "senha123" }),
});

// Alteração de senha
export const changePasswordSchema = z.strictObject({
  currentPassword: z
    .string({ error: "A senha atual é obrigatória." })
    .min(1, "A senha atual é obrigatória.")
    .meta({ example: "senhaAtual123" }),

  newPassword: z
    .string({ error: "A nova senha é obrigatória." })
    .min(8, "A nova senha deve ter pelo menos 8 caracteres.")
    .meta({ example: "novaSenha123" }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export type ChangePasswordInput = z.infer<
  typeof changePasswordSchema
>;
