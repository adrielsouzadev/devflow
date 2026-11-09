"use client";

import { useActionState } from "react";
import { createProject } from "@/app/actions/projects";
import { FormError, FormField, inputClass } from "@/components/form-ui";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import type { FormState } from "@/lib/form-state";

const initialState: FormState = {};

export function ProjectForm() {
  const [state, formAction] = useActionState(
    createProject,
    initialState,
  );

  return (
    <details className="border-t border-slate-800 pt-4">
      <summary className="cursor-pointer text-sm font-medium text-indigo-400 hover:text-indigo-300">
        + Criar projeto
      </summary>

      <form action={formAction} className="mt-4 space-y-4">
        <FormField
          label="Nome do projeto"
          htmlFor="new-project-name"
          error={state.fieldErrors?.name?.[0]}
        >
          <input
            id="new-project-name"
            name="name"
            type="text"
            required
            maxLength={100}
            placeholder="Ex.: Meu novo projeto"
            className={inputClass}
          />
        </FormField>

        <FormField
          label="Descrição"
          htmlFor="new-project-description"
          error={state.fieldErrors?.description?.[0]}
        >
          <textarea
            id="new-project-description"
            name="description"
            rows={3}
            maxLength={1000}
            placeholder="Descreva seu projeto..."
            className={inputClass}
          />
        </FormField>

        <FormError message={state.error} />

        <ConfirmSubmitButton
          pendingText="Criando..."
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Criar projeto
        </ConfirmSubmitButton>
      </form>
    </details>
  );
}