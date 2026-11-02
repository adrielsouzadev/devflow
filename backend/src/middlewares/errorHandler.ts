import type { NextFunction, Request, Response } from "express";

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: "Rota não encontrada" });
}

// Os erros do express.json() trazem um campo "type" que os identifica.
function getErrorType(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "type" in error) {
    return String(error.type);
  }
  return undefined;
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) {
    next(error);
    return;
  }

  const type = getErrorType(error);

  if (type === "entity.parse.failed") {
    res.status(400).json({ error: "JSON malformado" });
    return;
  }

  if (type === "entity.too.large") {
    res.status(413).json({ error: "Corpo da requisição muito grande" });
    return;
  }

  console.error(error);
  res.status(500).json({ error: "Erro interno do servidor" });
}