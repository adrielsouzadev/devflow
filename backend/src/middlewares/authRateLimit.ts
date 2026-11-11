import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    return email ? `email:${email}` : ipKeyGenerator(req.ip ?? "");
  },
  message: {
    error: "Muitas tentativas de login. Tente novamente em 15 minutos.",
  },
});

export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Muitas tentativas de cadastro. Tente novamente em 1 hora.",
  },
});