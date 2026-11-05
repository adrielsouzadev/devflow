"use server";

import { redirect } from "next/navigation";
import { apiFetch, type ApiErrorBody } from "@/lib/api";
import type { AuthFormState } from "@/lib/form-state";
import { setSession } from "@/lib/session";

type LoginResponse = {
  token: string;
  user: { id: number; name: string; email: string };
};

function buildErrorState(
  status: number,
  body: ApiErrorBody | null,
  values: AuthFormState["values"],
): AuthFormState {
  if (status === 400 && body?.details) {
    return {
      error: body.details.formErrors[0],
      fieldErrors: body.details.fieldErrors,
      values,
    };
  }

  if (body?.error && status < 500) {
    return { error: body.error, values };
  }

  return {
    error: "Não foi possível concluir a operação. Tente novamente.",
    values,
  };
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { status, data } = await apiFetch<LoginResponse | ApiErrorBody>(
    "/auth/login",
    { method: "POST", body: { email, password } },
  );

  if (status === 200) {
    const { token } = data as LoginResponse;

    await setSession(token);

    redirect("/projects");
  }

  return buildErrorState(status, data as ApiErrorBody | null, { email });
}

export async function register(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { status, data } = await apiFetch<ApiErrorBody>("/auth/register", {
    method: "POST",
    body: { name, email, password },
  });

  if (status !== 201) {
    return buildErrorState(status, data, { name, email });
  }

  // Cadastro feito: entra direto, sem pedir o login de novo.
  const login = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  if (login.status === 200 && login.data) {
    await setSession(login.data.token);
    redirect("/projects");
  }

  redirect("/login");
}