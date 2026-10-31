import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/token.js";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token não informado" });
    return;
  }

  const token = header.slice("Bearer ".length);

  try {
    req.userId = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
