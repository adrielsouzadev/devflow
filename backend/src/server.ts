import express from "express";
import { authRouter } from "./routes/auth.routes.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});