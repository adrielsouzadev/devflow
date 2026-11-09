"use client";

import { useState, useActionState } from "react";
import { updateProject } from "@/app/actions/projects";
import { FormError, FormField } from "@/components/form-ui";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import type { FormState } from "@/lib/form-state";

type ProjectEditFormProps = {
  project: {
    id: number;
    name: string;
    description: string | null;
  };
};

const initialState: FormState = {};

export function ProjectEditForm({ project }: ProjectEditFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const updateProjectWithId = updateProject.bind(null, project.id);

  const [state, formAction] = useActionState(
    updateProjectWithId,
    initialState,
  );

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="mt-5 rounded-md border border-indigo-500 px-4 py-2 text-sm font-medium text-indigo-300 transition hover:bg-indigo-500/10"
      >
        Editar projeto
      </button>
    );
  }

  return (
    <form action={formAction} className="mt-6 max-w-2xl space-y-4">
      <FormField
        label="Nome do projeto"
        htmlFor="edit-project-name"
        error={state.fieldErrors?.name?.[0]}
      >
        <input
          id="edit-project-name"
          name="name"
          type="text"
          required
          maxLength={100}
          defaultValue={project.name}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
        />
      </FormField>

      <FormField
        label="Descrição"
        htmlFor="edit-project-description"
        error={state.fieldErrors?.description?.[0]}
      >
        <textarea
          id="edit-project-description"
          name="description"
          rows={3}
          maxLength={1000}
          defaultValue={project.description ?? ""}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
        />
      </FormField>

      <FormError message={state.error} />

      <div className="flex gap-3">
        <ConfirmSubmitButton
          pendingText="Salvando..."
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
        >
          Salvar alterações
        </ConfirmSubmitButton>

        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}