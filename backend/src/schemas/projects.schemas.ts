import { z } from "zod";

export const createProjectSchema = z.object(
  {
    name: z
      .string("Nome é obrigatório")
      .trim()
      .min(1, "Nome é obrigatório")
      .max(100, "Nome deve ter no máximo 100 caracteres"),
    description: z
      .string("Descrição inválida")
      .trim()
      .max(1000, "Descrição deve ter no máximo 1000 caracteres")
      .optional(),
  },
  { error: "Envie um JSON com o nome e, opcionalmente, a descrição" },
);

export const updateProjectSchema = createProjectSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    error: "Envie ao menos um campo para atualizar",
  });

export const projectIdParamSchema = z.object({
  id: z.coerce
    .number("Id inválido")
    .int("Id inválido")
    .positive("Id inválido")
    .max(2_147_483_647, "Id inválido"),
});