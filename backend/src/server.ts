import express from "express";
import { authRouter } from "./routes/auth.routes.js";
import { projectsRouter } from "./routes/projects.routes.js";
import { projectTasksRouter } from "./routes/tasks.routes.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/projects/:projectId/tasks", projectTasksRouter);
app.use("/projects", projectsRouter);

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});