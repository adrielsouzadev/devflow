import "server-only";
import { redirect } from "next/navigation";
import { apiFetch, type ApiResponse } from "@/lib/api";
import { getSession } from "@/lib/session";

type AuthFetchOptions = {
  method?: string;
  body?: unknown;
};

export async function authFetch<T = unknown>(
  path: string,
  options: AuthFetchOptions = {},
): Promise<ApiResponse<T>> {
  const token = await getSession();

  if (!token) {
    redirect("/login");
  }

  const response = await apiFetch<T>(path, {
    ...options,
    token,
  });

  if (response.status === 401) {
    redirect("/session/expired");
  }

  return response;
}