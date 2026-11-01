import { z } from "zod";
import { Priority } from "../generated/prisma/enums.js";
import { idField } from "./common.schemas.js";

export const projectTasksParamSchema = z.object({
  projectId: idField,
});

export const createTaskSchema = z.object(
  {
    title: z
      .string("Título é obrigatório")
      .trim()
      .min(1, "Título é obrigatório")
      .max(150, "Título deve ter no máximo 150 caracteres"),
    description: z
      .string("Descrição inválida")
      .trim()
      .max(2000, "Descrição deve ter no máximo 2000 caracteres")
      .optional(),
    priority: z
      .enum(Priority, { error: "Prioridade inválida: use LOW, MEDIUM ou HIGH" })
      .optional(),
    dueDate: z.iso
      .datetime({
        offset: true,
        error: "Prazo inválido: use o formato ISO 8601 completo",
      })
      .transform((value) => new Date(value))
      .optional(),
  },
  {
    error:
      "Envie um JSON com o título e, opcionalmente, descrição, prioridade e prazo",
  },
);