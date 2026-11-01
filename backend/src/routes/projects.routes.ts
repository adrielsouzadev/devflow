import { Router } from "express";
import { z } from "zod";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { authenticate, getUserId } from "../middlewares/authenticate.js";
import {
  createProjectSchema,
  projectIdParamSchema,
  updateProjectSchema,
} from "../schemas/projects.schemas.js";

export const projectsRouter = Router();

projectsRouter.use(authenticate);

function isRecordNotFound(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
}

projectsRouter.post("/", async (req, res) => {
  const parsed = createProjectSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: "Dados inválidos",
      details: z.flattenError(parsed.error),
    });
    return;
  }

  const project = await prisma.project.create({
    data: { ...parsed.data, userId: getUserId(req) },
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
  const params = projectIdParamSchema.safeParse(req.params);

  if (!params.success) {
    res.status(400).json({
      error: "Dados inválidos",
      details: z.flattenError(params.error),
    });
    return;
  }

  const body = updateProjectSchema.safeParse(req.body);

  if (!body.success) {
    res.status(400).json({
      error: "Dados inválidos",
      details: z.flattenError(body.error),
    });
    return;
  }

  try {
    const project = await prisma.project.update({
      where: { id: params.data.id, userId: getUserId(req) },
      data: body.data,
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
  const params = projectIdParamSchema.safeParse(req.params);

  if (!params.success) {
    res.status(400).json({
      error: "Dados inválidos",
      details: z.flattenError(params.error),
    });
    return;
  }

  try {
    await prisma.project.delete({
      where: { id: params.data.id, userId: getUserId(req) },
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