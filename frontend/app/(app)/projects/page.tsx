import Link from "next/link";
import { authFetch } from "@/lib/auth-fetch";
import { formatDate } from "@/lib/format";
import type { Project } from "@/lib/types";
import { ProjectForm } from "./project-form";
import { Suspense } from "react";

async function ProjectsContent() {
  const { status, data } = await authFetch<Project[]>("/projects");

  if (status !== 200 || !data) {
    throw new Error("Não foi possível carregar os projetos.");
  }

  const projects = data;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-112 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl"
      />

      <main className="relative mx-auto min-h-screen max-w-5xl px-6 py-16">

        <header className="mt-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Projetos
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-slate-400">
            Organize seus projetos e acompanhe as tarefas de cada um.
          </p>
        </header>

        <section className="mt-12 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="mb-5 text-xl font-semibold text-indigo-300">
            Criar novo projeto
          </h2>

          <ProjectForm />
        </section>

        <section className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Meus projetos</h2>

            <span className="text-sm text-slate-400">
              {projects.length}{" "}
              {projects.length === 1 ? "projeto" : "projetos"}
            </span>
          </div>

          {projects.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center">
              <h3 className="text-xl font-semibold text-indigo-300">
                Nenhum projeto por aqui ainda
              </h3>

              <p className="mt-3 max-w-md text-slate-400">
                Crie seu primeiro projeto usando o formulário acima.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 transition hover:border-indigo-500/60 hover:bg-slate-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-400"
                >
                  <h3 className="wrap-break-word text-lg font-semibold text-slate-100">
                    {project.name}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-sm text-slate-400">
                    {project.description || "Sem descrição."}
                  </p>

                  <p className="mt-5 text-xs text-slate-500">
                    Criado em {formatDate(project.createdAt)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-5xl px-6 py-16 text-slate-400">
          Carregando projetos...
        </main>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
}