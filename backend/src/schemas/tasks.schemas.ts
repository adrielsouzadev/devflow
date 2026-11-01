import { z } from "zod";
import { Priority, TaskStatus } from "../generated/prisma/enums.js";
import { idField } from "./common.schemas.js";

const titleField = z
  .string("Título é obrigatório")
  .trim()
  .min(1, "Título é obrigatório")
  .max(150, "Título deve ter no máximo 150 caracteres");

const descriptionField = z
  .string("Descrição inválida")
  .trim()
  .max(2000, "Descrição deve ter no máximo 2000 caracteres");

const priorityField = z.enum(Priority, {
  error: "Prioridade inválida: use LOW, MEDIUM ou HIGH",
});

const statusField = z.enum(TaskStatus, {
  error: "Status inválido: use TODO, IN_PROGRESS ou DONE",
});

const dueDateField = z.iso
  .datetime({
    offset: true,
    error: "Prazo inválido: use o formato ISO 8601 completo",
  })
  .transform((value) => new Date(value));

export const projectTasksParamSchema = z.object({ projectId: idField });

export const taskIdParamSchema = z.object({ id: idField });

export const createTaskSchema = z.object(
  {
    title: titleField,
    description: descriptionField.optional(),
    priority: priorityField.optional(),
    dueDate: dueDateField.optional(),
  },
  {
    error:
      "Envie um JSON com o título e, opcionalmente, descrição, prioridade e prazo",
  },
);

export const updateTaskSchema = z
  .object(
    {
      title: titleField.optional(),
      description: descriptionField.nullable().optional(),
      priority: priorityField.optional(),
      status: statusField.optional(),
      dueDate: dueDateField.nullable().optional(),
    },
    { error: "Envie um JSON com os campos que deseja alterar" },
  )
  .refine((data) => Object.keys(data).length > 0, {
    error: "Envie ao menos um campo para atualizar",
  });

export const listTasksQuerySchema = z.object({
  status: statusField.optional(),
});