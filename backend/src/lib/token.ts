import "dotenv/config";
import jwt from "jsonwebtoken";

function readSecret(): string {
  const value = process.env.JWT_SECRET;

  if (!value) {
    throw new Error("JWT_SECRET não está definida no arquivo .env");
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