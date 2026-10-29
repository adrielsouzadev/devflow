import { Router } from "express";
import { z } from "zod";
import { registerSchema } from "../schemas/auth.schemas.js";

export const authRouter = Router();

authRouter.post("/register", (req, res) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error: "Dados inválidos",
      details: z.flattenError(parsed.error),
    });
    return;
  }

  // Resposta provisória (11.2.1): ainda não grava no banco.
  res.status(200).json({
    name: parsed.data.name,
    email: parsed.data.email,
  });
});