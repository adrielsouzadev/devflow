"use client";

import { useActionState } from "react";
import { createTask } from "@/app/actions/tasks";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { FormError, FormField } from "@/components/form-ui";
import type { FormState } from "@/lib/form-state";
import {
  PRIORITIES,
  PRIORITY_LABELS,
} from "@/lib/types";

const initialState: FormState = {};

type TaskFormProps = {
  projectId: number;
};

export function TaskForm({ projectId }: TaskFormProps) {
  const [state, formAction] = useActionState(
    createTask.bind(null, projectId),
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <FormField
        label="Título da tarefa"
        htmlFor="title"
        error={state.fieldErrors?.title?.[0]}
      >
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={150}
          placeholder="Ex.: Desenvolver a tela de login"
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
          maxLength={2000}
          placeholder="Descreva o que precisa ser feito..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </FormField>

      <FormField
        label="Prioridade"
        htmlFor="priority"
        error={state.fieldErrors?.priority?.[0]}
      >
        <select
          id="priority"
          name="priority"
          defaultValue="MEDIUM"
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
        >
          {PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_LABELS[priority]}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Prazo"
        htmlFor="dueDate"
        error={state.fieldErrors?.dueDate?.[0]}
      >
        <input
          id="dueDate"
          name="dueDate"
          type="datetime-local"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </FormField>

      <FormError message={state.error} />

      <ConfirmSubmitButton
        pendingText="Criando tarefa..."
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Criar tarefa
      </ConfirmSubmitButton>
    </form>
  );
}