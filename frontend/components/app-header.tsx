import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/current-user";

export async function AppHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-slate-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/projects" className="text-lg font-bold tracking-tight">
          Dev<span className="text-indigo-400">Flow</span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">{user.name}</span>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:border-indigo-400 hover:text-indigo-300"
            >
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}