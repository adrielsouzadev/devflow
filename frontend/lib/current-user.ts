import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getSession } from "@/lib/session";

export type CurrentUser = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

export const getCurrentUser = cache(async (): Promise<CurrentUser> => {
  const token = await getSession();

  if (!token) {
    redirect("/login");
  }

  const { status, data } = await apiFetch<CurrentUser>("/auth/me", { token });

  if (status === 200 && data) {
    return data;
  }

  if (status === 401) {
    redirect("/session/expired");
  }

  throw new Error(`Falha ao carregar o usuário (status ${status})`);
});