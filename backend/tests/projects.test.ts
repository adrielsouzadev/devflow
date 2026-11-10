
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

const suffix = Date.now();

const userA = {
  name: "Usuário Teste A",
  email: `projeto-a-${suffix}@example.com`,
  password: "SenhaTeste123",
};

const userB = {
  name: "Usuário Teste B",
  email: `projeto-b-${suffix}@example.com`,
  password: "SenhaTeste123",
};

let tokenA = "";
let tokenB = "";
let projectId = 0;
let otherProjectId = 0;
let taskId = 0;

describe("Projetos e tarefas", () => {
  beforeAll(async () => {
    await request(app).post("/auth/register").send(userA);
    await request(app).post("/auth/register").send(userB);

    const loginA = await request(app)
      .post("/auth/login")
      .send({ email: userA.email, password: userA.password });

    const loginB = await request(app)
      .post("/auth/login")
      .send({ email: userB.email, password: userB.password });

    tokenA = loginA.body.token;
    tokenB = loginB.body.token;
  });

  describe("Projetos", () => {
    it("deve criar um projeto", async () => {
      const response = await request(app)
        .post("/projects")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          name: "Projeto de Teste",
          description: "Projeto criado pelos testes automatizados",
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe("Projeto de Teste");

      projectId = response.body.id;
    });

    it("deve listar somente os projetos do usuário autenticado", async () => {
      const response = await request(app)
        .get("/projects")
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].id).toBe(projectId);
    });

    it("deve consultar um projeto pelo ID", async () => {
      const response = await request(app)
        .get(`/projects/${projectId}`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(projectId);
    });

    it("deve atualizar um projeto", async () => {
      const response = await request(app)
        .patch(`/projects/${projectId}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ name: "Projeto Atualizado" });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Projeto Atualizado");
    });

    it("deve rejeitar um projeto sem nome", async () => {
      const response = await request(app)
        .post("/projects")
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ name: "   " });

      expect(response.status).toBe(400);
    });

    it("não deve permitir atualizar outro usuário", async () => {
      const created = await request(app)
        .post("/projects")
        .set("Authorization", `Bearer ${tokenB}`)
        .send({ name: "Projeto de Outro Usuário" });

      otherProjectId = created.body.id;

      const response = await request(app)
        .patch(`/projects/${otherProjectId}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ name: "Tentativa de invasão" });

      expect(response.status).toBe(404);
    });

    it("não deve permitir consultar projeto de outro usuário", async () => {
      const response = await request(app)
        .get(`/projects/${otherProjectId}`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.status).toBe(404);
    });
  });

  describe("Tarefas", () => {
    it("deve criar uma tarefa em um projeto", async () => {
      const response = await request(app)
        .post(`/projects/${projectId}/tasks`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({
          title: "Tarefa de Teste",
          description: "Descrição da tarefa",
          priority: "HIGH",
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe("Tarefa de Teste");
      expect(response.body.status).toBe("TODO");

      taskId = response.body.id;
    });

    it("deve listar as tarefas do projeto", async () => {
      const response = await request(app)
        .get(`/projects/${projectId}/tasks`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].id).toBe(taskId);
    });

    it("deve filtrar tarefas pelo status", async () => {
      const response = await request(app)
        .get(`/projects/${projectId}/tasks?status=TODO`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    it("deve rejeitar uma tarefa com título vazio", async () => {
      const response = await request(app)
        .post(`/projects/${projectId}/tasks`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ title: "   " });

      expect(response.status).toBe(400);
    });

    it("deve atualizar o status de uma tarefa", async () => {
      const response = await request(app)
        .patch(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${tokenA}`)
        .send({ status: "IN_PROGRESS" });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("IN_PROGRESS");
    });

    it("não deve permitir alterar tarefa de outro usuário", async () => {
      const response = await request(app)
        .patch(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${tokenB}`)
        .send({ status: "DONE" });

      expect(response.status).toBe(404);
    });

    it("deve rejeitar um status inválido", async () => {
      const response = await request(app)
        .get(`/projects/${projectId}/tasks?status=INVALIDO`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.status).toBe(400);
    });

    it("deve excluir uma tarefa", async () => {
      const response = await request(app)
        .delete(`/tasks/${taskId}`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.status).toBe(204);
    });

    it("deve excluir um projeto", async () => {
      const response = await request(app)
        .delete(`/projects/${projectId}`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.status).toBe(204);
    });

    it("não deve permitir excluir projeto de outro usuário", async () => {
      const response = await request(app)
        .delete(`/projects/${otherProjectId}`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(response.status).toBe(404);
    });
  });
});

afterAll(async () => {
  const users = await prisma.user.findMany({
    where: {
      email: { in: [userA.email, userB.email] },
    },
    select: { id: true },
  });

  const userIds = users.map((user) => user.id);

  await prisma.project.deleteMany({
    where: { userId: { in: userIds } },
  });

  await prisma.user.deleteMany({
    where: { id: { in: userIds } },
  });

  await prisma.$disconnect();
});
