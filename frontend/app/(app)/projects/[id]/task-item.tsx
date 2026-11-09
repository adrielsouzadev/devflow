
"use client";

import { useActionState } from "react";
import { deleteTask, updateTask } from "@/app/actions/tasks";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { FormError, FormField } from "@/components/form-ui";
import { formatDateTime, toDateTimeLocal } from "@/lib/format";
import type { FormState } from "@/lib/form-state";
import {
  PRIORITIES,
  PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type Task,
} from "@/lib/types";

const initialState: FormState = {};

const PRIORITY_BADGE_CLASSES: Record<
  (typeof PRIORITIES)[number],
  string
> = {
  LOW: "bg-slate-700 text-slate-300",
  MEDIUM: "bg-amber-500/15 text-amber-300",
  HIGH: "bg-red-500/15 text-red-300",
};

const STATUS_BADGE_CLASSES: Record<
  (typeof TASK_STATUSES)[number],
  string
> = {
  TODO: "bg-slate-700 text-slate-300",
  IN_PROGRESS: "bg-indigo-500/15 text-indigo-300",
  DONE: "bg-green-500/15 text-green-300",
};

type TaskItemProps = {
  projectId: number;
  task: Task;
};

export function TaskItem({ projectId, task }: TaskItemProps) {
  const [state, formAction] = useActionState(
    updateTask.bind(null, projectId, task.id),
    initialState,
  );

  const [deleteState, deleteFormAction] = useActionState(
    deleteTask.bind(null, projectId, task.id),
    initialState,
  );

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 text-sm text-slate-400">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span
            className={`rounded-full px-3 py-1 ${PRIORITY_BADGE_CLASSES[task.priority]}`}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>

          <span
            className={`rounded-full px-3 py-1 ${STATUS_BADGE_CLASSES[task.status]}`}
          >
            {TASK_STATUS_LABELS[task.status]}
          </span>
        </div>
      </div>

      {task.dueDate && (
        <p className="mb-5 text-xs text-slate-400">
          Prazo: {formatDateTime(task.dueDate)}
        </p>
      )}

      <details className="border-t border-slate-800 pt-4">
        <summary className="cursor-pointer text-sm font-medium text-indigo-400 hover:text-indigo-300">
          Editar tarefa
        </summary>

        <form action={formAction} className="mt-4 space-y-4">
          <FormField
            label="Título"
            htmlFor={`title-${task.id}`}
            error={state.fieldErrors?.title?.[0]}
          >
            <input
              id={`title-${task.id}`}
              name="title"
              type="text"
              required
              maxLength={150}
              defaultValue={task.title}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
            />
          </FormField>

          <FormField
            label="Descrição"
            htmlFor={`description-${task.id}`}
            error={state.fieldErrors?.description?.[0]}
          >
            <textarea
              id={`description-${task.id}`}
              name="description"
              rows={2}
              maxLength={2000}
              defaultValue={task.description ?? ""}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Prioridade"
              htmlFor={`priority-${task.id}`}
              error={state.fieldErrors?.priority?.[0]}
            >
              <select
                id={`priority-${task.id}`}
                name="priority"
                defaultValue={task.priority}
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
              label="Status"
              htmlFor={`status-${task.id}`}
              error={state.fieldErrors?.status?.[0]}
            >
              <select
                id={`status-${task.id}`}
                name="status"
                defaultValue={task.status}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
              >
                {TASK_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {TASK_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField
            label="Prazo"
            htmlFor={`dueDate-${task.id}`}
            error={state.fieldErrors?.dueDate?.[0]}
          >
            <input
              id={`dueDate-${task.id}`}
              name="dueDate"
              type="datetime-local"
              defaultValue={toDateTimeLocal(task.dueDate)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
            />
          </FormField>

          <FormError message={state.error} />

          <div className="flex flex-wrap items-center gap-3">
            <ConfirmSubmitButton
              pendingText="Salvando..."
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Salvar alterações
            </ConfirmSubmitButton>
          </div>
        </form>
      </details>

      <form
        action={deleteFormAction}
        className="mt-3 border-t border-slate-800 pt-3"
      >
        <FormError message={deleteState.error} />

        <ConfirmSubmitButton
          pendingText="Excluindo..."
          className="mt-3 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50"
        >
          Excluir tarefa
        </ConfirmSubmitButton>
      </form>
    </article>
  );
}