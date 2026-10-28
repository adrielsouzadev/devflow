import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-112 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl"
      />

      <main className="relative mx-auto min-h-screen max-w-5xl px-6 py-16">
        <Link
          href="/"
          className="text-sm font-medium text-indigo-300 transition hover:text-indigo-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-300"
        >
          ← Voltar para o início
        </Link>

        <header className="mt-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Projetos
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-400">
            Aqui você vai organizar seus projetos e acompanhar as tarefas de
            cada um.
          </p>
        </header>

        <section
          aria-labelledby="empty-state-title"
          className="mt-12 flex flex-col items-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center"
        >
          <h2
            id="empty-state-title"
            className="text-xl font-semibold text-indigo-300"
          >
            Nenhum projeto por aqui ainda
          </h2>
          <p className="mt-3 max-w-md text-slate-400">
            Quando você cadastrar seu primeiro projeto, ele vai aparecer nesta
            lista.
          </p>
        </section>
      </main>
    </div>
  );
}