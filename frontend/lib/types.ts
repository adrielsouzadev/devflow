export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Project = {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  userId: number;
};

export type Task = {
  id: number;
  title: string;
  description: string | null;
  priority: Priority;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  projectId: number;
};

export const PRIORITIES: Priority[] = ["LOW", "MEDIUM", "HIGH"];

export const TASK_STATUSES: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "DONE",
];

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "A fazer",
  IN_PROGRESS: "Em andamento",
  DONE: "Concluída",
};