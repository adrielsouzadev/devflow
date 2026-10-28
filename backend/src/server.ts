import express from "express";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});