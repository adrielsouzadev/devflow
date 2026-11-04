"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import type { AuthFormState } from "@/lib/form-state";

const initialState: AuthFormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {state.error}
        </p>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-300"
        >
          E-mail
        </label>

        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={state.values?.email}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-indigo-400"
        />

        {state.fieldErrors?.email && (
          <p className="mt-1 text-sm text-red-300">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-300"
        >
          Senha
        </label>

        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-indigo-400"
        />

        {state.fieldErrors?.password && (
          <p className="mt-1 text-sm text-red-300">
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-indigo-500 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-60"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}