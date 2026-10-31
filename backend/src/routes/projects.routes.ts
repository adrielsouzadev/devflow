import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { authenticate, getUserId } from "../middlewares/authenticate.js";
import { createProjectSchema } from "../schemas/projects.schemas.js";

export const projectsRouter = Router();

projectsRouter.use(authenticate);

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