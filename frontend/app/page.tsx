import Link from "next/link";
import { getSession } from "@/lib/session";
import { getCurrentUser } from "@/lib/current-user";
import { logout } from "@/app/actions/auth";
import { AppFooter } from "@/components/app-footer";

export const instant = false;

const features = [
  {
    title: "Projetos",
    description: "Organize seu trabalho em projetos com nome e descrição.",
  },
  {
    title: "Tarefas",
    description: "Crie tarefas com prioridade e prazo dentro de cada projeto.",
  },
  {
    title: "Status",
    description: "Acompanhe o andamento: a fazer, em andamento ou concluída.",
  },
];

export default async function Home() {
  const token = await getSession();
  const user = token ? await getCurrentUser() : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-112 -translate-x-1/2 rounded-full bg-indigo-600/30 blur-3xl"
      />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-end gap-3 px-6 pt-6">
        {token ? (
          <>
            <span className="text-sm text-slate-400">
              Olá, {user?.name}
            </span>

            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:border-indigo-400 hover:text-indigo-300"
              >
                Sair
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Entrar
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Criar conta
            </Link>
          </>
        )}
      </header>

      <main className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
        <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-sm font-medium text-indigo-300">
          Gestão de projetos e tarefas
        </span>

        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
          Organize seus projetos com o{" "}
          <span className="text-indigo-400">DevFlow</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          Crie projetos, divida o trabalho em tarefas e acompanhe cada uma até a
          conclusão, tudo em um só lugar.
        </p>

        <Link
          href="/projects"
          className="mt-10 inline-flex items-center rounded-lg bg-indigo-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
        >
          Explorar projetos
        </Link>

        <ul className="mt-20 grid w-full gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <li
              key={feature.title}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-left"
            >
              <h2 className="font-semibold text-indigo-300">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </main>

      <div className="relative">
        <AppFooter />
      </div>
    </div>
  );
}