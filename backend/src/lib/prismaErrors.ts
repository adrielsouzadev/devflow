import { Prisma } from "../generated/prisma/client.js";

// P2025: um update ou delete não encontrou o registro.
export function isRecordNotFound(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
}