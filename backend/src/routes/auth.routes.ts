
import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { signToken } from "../lib/token.js";
import { loginSchema, registerSchema } from "../schemas/auth.schemas.js";

const SALT_ROUNDS = 12;

// Hash fictício: usado quando o e-mail não existe, para que a resposta
// leve o mesmo tempo que uma senha errada.
const DUMMY_HASH = await bcrypt.hash("senha-ficticia", SALT_ROUNDS);

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: "Dados inválidos",
      details: z.flattenError(parsed.error),
    });
    return;
  }

  const { name, email, password } = parsed.data;
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true, createdAt: true },
    });
    res.status(201).json(user);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(409).json({ error: "E-mail já cadastrado" });
      return;
    }
    throw error;
  }
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: "Dados inválidos",
      details: z.flattenError(parsed.error),
    });
    return;
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  const passwordMatches = await bcrypt.compare(
    password,
    user?.passwordHash ?? DUMMY_HASH,
  );

  if (!user || !passwordMatches) {
    res.status(401).json({ error: "Credenciais inválidas" });
    return;
  }

  res.status(200).json({
    token: signToken(user.id),
    user: { id: user.id, name: user.name, email: user.email },
  });
});
