import { Suspense, type ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Suspense
        fallback={
          <header className="h-16 border-b border-slate-800" />
        }
      >
        <AppHeader />
      </Suspense>

      <div className="flex-1">{children}</div>

      <AppFooter />
    </div>
  );
}