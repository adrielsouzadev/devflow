import Link from "next/link";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold tracking-tight">Criar conta</h1>
        <p className="mt-2 text-slate-400">
          Organize seus projetos e tarefas em um só lugar.
        </p>

        <RegisterForm />

        <p className="mt-6 text-sm text-slate-400">
          Já tem conta?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-300 hover:text-indigo-200"
          >
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}