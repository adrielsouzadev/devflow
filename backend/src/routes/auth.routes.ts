import bcrypt from "bcryptjs";
import { Router } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { signToken } from "../lib/token.js";
import { parseOrReply } from "../lib/validation.js";
import { authenticate, getUserId } from "../middlewares/authenticate.js";
import {
  loginRateLimiter,
  registerRateLimiter,
} from "../middlewares/authRateLimit.js";
import { loginSchema, registerSchema } from "../schemas/auth.schemas.js";

const SALT_ROUNDS = 12;

// Hash fictício: usado quando o e-mail não existe, para que a resposta
// leve o mesmo tempo que uma senha errada.
const DUMMY_HASH = await bcrypt.hash("senha-ficticia", SALT_ROUNDS);

export const authRouter = Router();

authRouter.post("/register", registerRateLimiter, async (req, res) => {
  const data = parseOrReply(res, registerSchema, req.body);
  if (!data) return;

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  try {
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, passwordHash },
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

authRouter.post("/login", loginRateLimiter, async (req, res) => {
  const data = parseOrReply(res, loginSchema, req.body);
  if (!data) return;

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  const passwordMatches = await bcrypt.compare(
    data.password,
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

authRouter.get("/me", authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: getUserId(req) },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  if (!user) {
    res.status(401).json({ error: "Usuário não encontrado" });
    return;
  }

  res.status(200).json(user);
});