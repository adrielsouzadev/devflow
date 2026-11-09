import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { authFetch } from "@/lib/auth-fetch";
import { formatDate } from "@/lib/format";
import type { Project, Task } from "@/lib/types";
import { TaskForm } from "./task-form";
import { TaskItem } from "./task-item";
import { TaskFilters } from "./task-filters";
import { ProjectEditForm } from "./project-edit-form";
import { ProjectDeleteButton } from "./project-delete-button";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
};

async function ProjectContent({
  id,
  status,
}: {
  id: number;
  status?: string;
}) {
  const projectResponse = await authFetch<Project>(
    `/projects/${id}`,
  );

  if (projectResponse.status === 404) {
    notFound();
  }

  if (projectResponse.status !== 200 || !projectResponse.data) {
    throw new Error("Não foi possível carregar o projeto.");
  }

  const project = projectResponse.data;

  let allTasks: Task[];
  let tasks: Task[];

  if (status) {
    const [allTasksResponse, filteredTasksResponse] =
      await Promise.all([
        authFetch<Task[]>(`/projects/${id}/tasks`),
        authFetch<Task[]>(
          `/projects/${id}/tasks?status=${status}`,
        ),
      ]);

    if (
      allTasksResponse.status !== 200 ||
      !allTasksResponse.data
    ) {
      throw new Error("Não foi possível carregar os totais das tarefas.");
    }

    if (
      filteredTasksResponse.status !== 200 ||
      !filteredTasksResponse.data
    ) {
      throw new Error("Não foi possível carregar as tarefas.");
    }

    allTasks = allTasksResponse.data;
    tasks = filteredTasksResponse.data;
  } else {
    const tasksResponse = await authFetch<Task[]>(
      `/projects/${id}/tasks`,
    );

    if (tasksResponse.status !== 200 || !tasksResponse.data) {
      throw new Error("Não foi possível carregar as tarefas.");
    }

    allTasks = tasksResponse.data;
    tasks = allTasks;
  }

  const taskCounts = {
    TODO: allTasks.filter((task) => task.status === "TODO").length,
    IN_PROGRESS: allTasks.filter(
      (task) => task.status === "IN_PROGRESS",
    ).length,
    DONE: allTasks.filter((task) => task.status === "DONE").length,
  };

  const summaryCards = [
    {
      label: "A fazer",
      count: taskCounts.TODO,
      style: "border-slate-700 bg-slate-900/70 text-slate-300",
    },
    {
      label: "Em andamento",
      count: taskCounts.IN_PROGRESS,
      style: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
    },
    {
      label: "Concluídas",
      count: taskCounts.DONE,
      style: "border-green-500/30 bg-green-500/10 text-green-300",
    },
  ];

  return (
    <main className="relative mx-auto min-h-screen max-w-5xl px-6 py-16">
      <Link
        href="/projects"
        className="text-sm font-medium text-indigo-300 transition hover:text-indigo-200"
      >
        ← Voltar para projetos
      </Link>

      <header className="mt-8">
        <p className="text-sm font-medium text-indigo-300">
          Detalhes do projeto
        </p>

        <h1 className="mt-2 wrap-break-word text-4xl font-bold tracking-tight text-slate-100">
          {project.name}
        </h1>

        <p className="mt-4 max-w-2xl text-slate-400">
          {project.description || "Este projeto não possui descrição."}
        </p>

        <p className="mt-4 text-xs text-slate-500">
          Criado em {formatDate(project.createdAt)}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <ProjectEditForm project={project} />
          <ProjectDeleteButton projectId={id} />
        </div>
      </header>

      <section className="mt-12 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="mb-5 text-xl font-semibold text-indigo-300">
          Criar nova tarefa
        </h2>

        <TaskForm projectId={id} />
      </section>

      <section className="mt-12">
        <h2 className="mb-5 text-2xl font-semibold text-slate-100">
          Resumo das tarefas
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className={`rounded-xl border p-5 ${card.style}`}
            >
              <p className="text-sm font-medium">{card.label}</p>
              <p className="mt-2 text-3xl font-bold">{card.count}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-100">
            Tarefas
          </h2>

          <span className="text-sm text-slate-400">
            {tasks.length}{" "}
            {tasks.length === 1 ? "tarefa" : "tarefas"}
          </span>
        </div>

        <div className="mb-6">
          <TaskFilters />
        </div>

        {tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center">
            <h3 className="text-xl font-semibold text-indigo-300">
              {status
                ? "Nenhuma tarefa encontrada"
                : "Nenhuma tarefa por aqui ainda"}
            </h3>

            <p className="mt-3 text-slate-400">
              {status
                ? "Não existem tarefas com esse status. Experimente selecionar outro filtro."
                : "Crie sua primeira tarefa usando o formulário acima."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                projectId={id}
                task={task}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

async function ProjectPageContent({
  params,
  searchParams,
}: ProjectPageProps) {
  const [{ id: rawId }, { status: rawStatus }] = await Promise.all([
    params,
    searchParams,
  ]);

  const id = Number(rawId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  const validStatuses = ["TODO", "IN_PROGRESS", "DONE"];
  const status = validStatuses.includes(rawStatus ?? "")
    ? rawStatus
    : undefined;

  return <ProjectContent id={id} status={status} />;
}

export default function ProjectPage({
  params,
  searchParams,
}: ProjectPageProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-112 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl"
      />

      <Suspense
        fallback={
          <main className="mx-auto max-w-5xl px-6 py-16 text-slate-400">
            Carregando projeto...
          </main>
        }
      >
        <ProjectPageContent
          params={params}
          searchParams={searchParams}
        />
      </Suspense>
    </div>
  );
}