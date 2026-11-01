import type { Response } from "express";
import { z } from "zod";

// Valida `input` com o schema. Se for válido, devolve os dados tipados.
// Se não for, já responde 400 e devolve undefined: quem chama deve encerrar.
export function parseOrReply<T extends z.ZodType>(
  res: Response,
  schema: T,
  input: unknown,
): z.output<T> | undefined {
  const parsed = schema.safeParse(input);

  if (parsed.success) {
    return parsed.data;
  }

  res.status(400).json({
    error: "Dados inválidos",
    details: z.flattenError(parsed.error),
  });
  return undefined;
}