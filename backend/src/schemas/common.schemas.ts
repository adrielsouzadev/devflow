import { z } from "zod";

export const idField = z.coerce
  .number("Id inválido")
  .int("Id inválido")
  .positive("Id inválido")
  .max(2_147_483_647, "Id inválido");