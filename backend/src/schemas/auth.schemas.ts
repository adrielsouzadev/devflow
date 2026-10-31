
import { z } from "zod";

const emailField = z
  .string("E-mail é obrigatório")
  .trim()
  .toLowerCase()
  .pipe(z.email("E-mail inválido"));

export const registerSchema = z.object(
  {
    name: z
      .string("Nome é obrigatório")
      .trim()
      .min(1, "Nome é obrigatório")
      .max(100, "Nome deve ter no máximo 100 caracteres"),
    email: emailField,
    password: z
      .string("Senha é obrigatória")
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .max(72, "A senha deve ter no máximo 72 caracteres"),
  },
  { error: "Envie um JSON com nome, e-mail e senha" },
);

export const loginSchema = z.object(
  {
    email: emailField,
    password: z.string("Senha é obrigatória").min(1, "Senha é obrigatória"),
  },
  { error: "Envie um JSON com e-mail e senha" },
);
