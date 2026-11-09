
"use client";

import { useState, useTransition } from "react";
import { deleteProject } from "@/app/actions/projects";

type ProjectDeleteButtonProps = {
  projectId: number;
};

export function ProjectDeleteButton({
  projectId,
}: ProjectDeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteProject(projectId);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-5 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
      >
        Excluir projeto
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-project-title"
            aria-describedby="delete-project-description"
            className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <h2
              id="delete-project-title"
              className="text-xl font-semibold text-slate-100"
            >
              Excluir projeto?
            </h2>

            <p
              id="delete-project-description"
              className="mt-3 text-sm leading-relaxed text-slate-400"
            >
              Tem certeza que deseja excluir este projeto? Todas as tarefas
              associadas a ele também serão excluídas. Essa ação não pode ser
              desfeita.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Excluindo..." : "Excluir projeto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}