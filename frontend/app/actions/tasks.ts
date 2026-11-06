"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authFetch } from "@/lib/auth-fetch";
import { getFormErrors } from "@/lib/form-errors";
import type { FormState } from "@/lib/form-state";
import type { Task } from "@/lib/types";

export async function createTask(
  projectId: number,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");
  const priority = String(formData.get("priority") ?? "MEDIUM");
  const dueDate = String(formData.get("dueDate") ?? "");

  const { status, data } = await authFetch<Task | { error: string }>(
    `/projects/${projectId}/tasks`,
    {
      method: "POST",
      body: {
        title,
        ...(description.trim() ? { description } : {}),
        priority,
        ...(dueDate ? { dueDate: new Date(dueDate).toISOString() } : {}),
      },
    },
  );

  if (status !== 201 || !data) {
    return getFormErrors(data);
  }

  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}`);
}

export async function updateTask(
  projectId: number,
  taskId: number,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");
  const priority = String(formData.get("priority") ?? "MEDIUM");
  const status = String(formData.get("status") ?? "TODO");
  const dueDate = String(formData.get("dueDate") ?? "");

  const { status: responseStatus, data } = await authFetch<
    Task | { error: string }
  >(`/tasks/${taskId}`, {
    method: "PATCH",
    body: {
      title,
      description: description.trim() ? description : null,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    },
  });

  if (responseStatus !== 200 || !data) {
    return getFormErrors(data);
  }

  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}`);
}

export async function deleteTask(
  projectId: number,
  taskId: number,
  _prevState: FormState,
  _formData: FormData,
): Promise<FormState> {
  const { status, data } = await authFetch<unknown>(`/tasks/${taskId}`, {
    method: "DELETE",
  });

  if (status !== 204) {
    return getFormErrors(data);
  }

  revalidatePath(`/projects/${projectId}`);
  redirect(`/projects/${projectId}`);
}