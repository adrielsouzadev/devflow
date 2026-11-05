import { Suspense, type ReactNode } from "react";
import { AppHeader } from "@/components/app-header";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Suspense
        fallback={
          <header className="h-16 border-b border-slate-800" />
        }
      >
        <AppHeader />
      </Suspense>

      {children}
    </div>
  );
}