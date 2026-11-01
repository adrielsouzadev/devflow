import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { parseOrReply } from "../lib/validation.js";
import { authenticate, getUserId } from "../middlewares/authenticate.js";
import {
  createTaskSchema,
  projectTasksParamSchema,
} from "../schemas/tasks.schemas.js";

export const projectTasksRouter = Router({ mergeParams: true });

projectTasksRouter.use(authenticate);

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