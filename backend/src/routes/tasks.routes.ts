import { Router } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { parseOrReply } from "../lib/validation.js";
import { authenticate, getUserId } from "../middlewares/authenticate.js";
import {
  createTaskSchema,
  projectTasksParamSchema,
  taskIdParamSchema,
  updateTaskSchema,
} from "../schemas/tasks.schemas.js";

function isRecordNotFound(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
}

async function userOwnsProject(
  projectId: number,
  userId: number,
): Promise<boolean> {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    select: { id: true },
  });

  return project !== null;
}

// Rotas aninhadas: /projects/:projectId/tasks
export const projectTasksRouter = Router({ mergeParams: true });

projectTasksRouter.use(authenticate);

projectTasksRouter.post("/", async (req, res) => {
  const params = parseOrReply(res, projectTasksParamSchema, req.params);
  if (!params) return;

  const data = parseOrReply(res, createTaskSchema, req.body);
  if (!data) return;

  if (!(await userOwnsProject(params.projectId, getUserId(req)))) {
    res.status(404).json({ error: "Projeto não encontrado" });
    return;
  }

  const task = await prisma.task.create({
    data: { ...data, projectId: params.projectId },
  });

  res.status(201).json(task);
});

projectTasksRouter.get("/", async (req, res) => {
  const params = parseOrReply(res, projectTasksParamSchema, req.params);
  if (!params) return;

  if (!(await userOwnsProject(params.projectId, getUserId(req)))) {
    res.status(404).json({ error: "Projeto não encontrado" });
    return;
  }

  const tasks = await prisma.task.findMany({
    where: { projectId: params.projectId },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json(tasks);
});

// Rotas por id de tarefa: /tasks/:id
export const tasksRouter = Router();

tasksRouter.use(authenticate);

tasksRouter.patch("/:id", async (req, res) => {
  const params = parseOrReply(res, taskIdParamSchema, req.params);
  if (!params) return;

  const data = parseOrReply(res, updateTaskSchema, req.body);
  if (!data) return;

  try {
    const task = await prisma.task.update({
      where: { id: params.id, project: { userId: getUserId(req) } },
      data,
    });

    res.status(200).json(task);
  } catch (error) {
    if (isRecordNotFound(error)) {
      res.status(404).json({ error: "Tarefa não encontrada" });
      return;
    }

    throw error;
  }
});

tasksRouter.delete("/:id", async (req, res) => {
  const params = parseOrReply(res, taskIdParamSchema, req.params);
  if (!params) return;

  try {
    await prisma.task.delete({
      where: { id: params.id, project: { userId: getUserId(req) } },
    });

    res.status(204).send();
  } catch (error) {
    if (isRecordNotFound(error)) {
      res.status(404).json({ error: "Tarefa não encontrada" });
      return;
    }

    throw error;
  }
});