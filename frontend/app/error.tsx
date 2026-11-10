"use client";

import Link from "next/link";

export default function ErrorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-slate-100">
      <p className="text-sm font-medium text-indigo-300">Erro</p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        Algo deu errado
      </h1>

      <p className="mt-4 max-w-md text-slate-400">
        Não foi possível carregar esta página. Tente novamente em instantes.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
        >
          Tentar novamente
        </button>

        <Link
          href="/"
          className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
        >
          Ir para o início
        </Link>
      </div>
    </main>
  );
}