import "dotenv/config";
import jwt from "jsonwebtoken";

function readSecret(): string {
  const value = process.env.JWT_SECRET;

  if (!value) {
    throw new Error("JWT_SECRET não está definida no arquivo .env");
  }

  if (value.length < 32) {
    throw new Error(
      "JWT_SECRET deve possuir pelo menos 32 caracteres",
    );
  }

  return value;
}

const secret = readSecret();

export function signToken(userId: number): string {
  return jwt.sign({}, secret, {
    subject: String(userId),
    expiresIn: "1d",
  });
}

export function verifyToken(token: string): number {
  const payload = jwt.verify(token, secret, {
    algorithms: ["HS256"],
  });

  if (typeof payload === "string" || !payload.sub) {
    throw new Error("Token sem identificação do usuário");
  }

  const userId = Number(payload.sub);

  if (!Number.isInteger(userId)) {
    throw new Error("Token com identificação inválida");
  }

  return userId;
}