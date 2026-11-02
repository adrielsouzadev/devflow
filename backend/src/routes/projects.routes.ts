
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { isRecordNotFound } from "../lib/prismaErrors.js";
import { parseOrReply } from "../lib/validation.js";
import { authenticate, getUserId } from "../middlewares/authenticate.js";
import {
  createProjectSchema,
  projectIdParamSchema,
  updateProjectSchema,
} from "../schemas/projects.schemas.js";

export const projectsRouter = Router();

projectsRouter.use(authenticate);

projectsRouter.post("/", async (req, res) => {
  const data = parseOrReply(res, createProjectSchema, req.body);
  if (!data) return;

  const project = await prisma.project.create({
    data: { ...data, userId: getUserId(req) },
  });

  res.status(201).json(project);
});

projectsRouter.get("/", async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { userId: getUserId(req) },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json(projects);
});

projectsRouter.patch("/:id", async (req, res) => {
  const params = parseOrReply(res, projectIdParamSchema, req.params);
  if (!params) return;

  const data = parseOrReply(res, updateProjectSchema, req.body);
  if (!data) return;

  try {
    const project = await prisma.project.update({
      where: { id: params.id, userId: getUserId(req) },
      data,
    });
    res.status(200).json(project);
  } catch (error) {
    if (isRecordNotFound(error)) {
      res.status(404).json({ error: "Projeto não encontrado" });
      return;
    }
    throw error;
  }
});

projectsRouter.delete("/:id", async (req, res) => {
  const params = parseOrReply(res, projectIdParamSchema, req.params);
  if (!params) return;

  try {
    await prisma.project.delete({
      where: { id: params.id, userId: getUserId(req) },
    });
    res.status(204).send();
  } catch (error) {
    if (isRecordNotFound(error)) {
      res.status(404).json({ error: "Projeto não encontrado" });
      return;
    }
    throw error;
  }
});