"use client";

import { useActionState } from "react";
import { createProject } from "@/app/actions/projects";
import { FormError, FormField } from "@/components/form-ui";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import type { FormState } from "@/lib/form-state";

const initialState: FormState = {};

export function ProjectForm() {
  const [state, formAction] = useActionState(
    createProject,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <FormField
        label="Nome do projeto"
        htmlFor="name"
        error={state.fieldErrors?.name?.[0]}
      >
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={100}
          placeholder="Ex.: Meu novo projeto"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </FormField>

      <FormField
        label="Descrição"
        htmlFor="description"
        error={state.fieldErrors?.description?.[0]}
      >
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={1000}
          placeholder="Descreva seu projeto..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </FormField>

      <FormError message={state.error} />

      <ConfirmSubmitButton
        pendingText="Criando..."
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Criar projeto
      </ConfirmSubmitButton>
    </form>
  );
}