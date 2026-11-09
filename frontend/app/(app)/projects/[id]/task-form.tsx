"use client";

import { useActionState } from "react";
import { createTask } from "@/app/actions/tasks";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { FormError, FormField, inputClass } from "@/components/form-ui";
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
    <details className="border-t border-slate-800 pt-4">
      <summary className="cursor-pointer text-sm font-medium text-indigo-400 hover:text-indigo-300">
        + Criar tarefa
      </summary>

      <form action={formAction} className="mt-4 space-y-4">
        <FormField
          label="Título da tarefa"
          htmlFor="new-task-title"
          error={state.fieldErrors?.title?.[0]}
        >
          <input
            id="new-task-title"
            name="title"
            type="text"
            required
            maxLength={150}
            placeholder="Ex.: Desenvolver a tela de login"
            className={inputClass}
          />
        </FormField>

        <FormField
          label="Descrição"
          htmlFor="new-task-description"
          error={state.fieldErrors?.description?.[0]}
        >
          <textarea
            id="new-task-description"
            name="description"
            rows={3}
            maxLength={2000}
            placeholder="Descreva o que precisa ser feito..."
            className={inputClass}
          />
        </FormField>

        <FormField
          label="Prioridade"
          htmlFor="new-task-priority"
          error={state.fieldErrors?.priority?.[0]}
        >
          <select
            id="new-task-priority"
            name="priority"
            defaultValue="MEDIUM"
            className={inputClass}
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
          htmlFor="new-task-dueDate"
          error={state.fieldErrors?.dueDate?.[0]}
        >
          <input
            id="new-task-dueDate"
            name="dueDate"
            type="datetime-local"
            className={inputClass}
          />
        </FormField>

        <FormError message={state.error} />

        <ConfirmSubmitButton
          pendingText="Criando tarefa..."
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Criar tarefa
        </ConfirmSubmitButton>
      </form>
    </details>
  );
}