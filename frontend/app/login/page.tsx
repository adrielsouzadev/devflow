import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold tracking-tight">Entrar</h1>

        <p className="mt-2 text-slate-400">
          Acesse sua conta para ver seus projetos.
        </p>

        <LoginForm />

        <p className="mt-6 text-sm text-slate-400">
          Ainda não tem conta?{" "}
          <Link
            href="/register"
            className="font-medium text-indigo-300 hover:text-indigo-200"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}