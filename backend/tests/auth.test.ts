
import { afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

const testUser = {
  name: "Usuário de Teste",
  email: `teste-${Date.now()}@example.com`,
  password: "SenhaTeste123",
};

let token = "";

describe("Autenticação", () => {
  it("deve cadastrar um usuário", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: testUser.name,
      email: testUser.email,
    });
    expect(response.body.passwordHash).toBeUndefined();
  });

  it("não deve cadastrar um e-mail duplicado", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(testUser);

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("E-mail já cadastrado");
  });

  it("deve rejeitar dados inválidos no cadastro", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        name: "Teste",
        email: "email-invalido",
        password: "123",
      });

    expect(response.status).toBe(400);
  });

  it("deve realizar login e retornar um token", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTypeOf("string");

    token = response.body.token;
  });

  it("não deve permitir login com senha incorreta", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: testUser.email,
        password: "SenhaErrada123",
      });

    expect(response.status).toBe(401);
  });

  it("não deve permitir acessar /auth/me sem token", async () => {
    const response = await request(app).get("/auth/me");

    expect(response.status).toBe(401);
  });

  it("deve rejeitar um token inválido", async () => {
    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", "Bearer token-invalido");

    expect(response.status).toBe(401);
  });

  it("deve retornar os dados do usuário autenticado", async () => {
    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(testUser.email);
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({
    where: { email: testUser.email },
  });

  await prisma.$disconnect();
});