"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authFetch } from "@/lib/auth-fetch";
import { getFormErrors } from "@/lib/form-errors";
import type { FormState } from "@/lib/form-state";
import type { Project } from "@/lib/types";

export async function createProject(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = String(formData.get("name") ?? "");
  const description = String(formData.get("description") ?? "");

  const { status, data } = await authFetch<Project | { error: string }>(
    "/projects",
    {
      method: "POST",
      body: {
        name,
        ...(description.trim() ? { description } : {}),
      },
    },
  );

  if (status !== 201 || !data) {
    return getFormErrors(data);
  }

  revalidatePath("/projects");
  redirect("/projects");
}

export async function updateProject(
  projectId: number,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = String(formData.get("name") ?? "");
  const description = String(formData.get("description") ?? "");

  const { status, data } = await authFetch<Project | { error: string }>(
    `/projects/${projectId}`,
    {
      method: "PATCH",
      body: {
        name,
        description,
      },
    },
  );

  if (status !== 200 || !data) {
    return getFormErrors(data);
  }

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}`);
}

export async function deleteProject(
  projectId: number,
): Promise<FormState> {
  const { status, data } = await authFetch<unknown>(
    `/projects/${projectId}`,
    { method: "DELETE" },
  );

  if (status !== 204) {
    return getFormErrors(data);
  }

  revalidatePath("/projects");
  redirect("/projects");
}