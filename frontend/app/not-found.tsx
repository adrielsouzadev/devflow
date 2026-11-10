import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-slate-100">
      <p className="text-sm font-medium text-indigo-300">Erro 404</p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        Página não encontrada
      </h1>

      <p className="mt-4 max-w-md text-slate-400">
        O endereço não existe ou o projeto foi removido.
      </p>

      <Link
        href="/projects"
        className="mt-8 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
      >
        Voltar para projetos
      </Link>
    </main>
  );
}