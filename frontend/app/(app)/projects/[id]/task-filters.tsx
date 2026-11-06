"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const filters = [
  { label: "Todas", value: "" },
  { label: "A fazer", value: "TODO" },
  { label: "Em andamento", value: "IN_PROGRESS" },
  { label: "Concluídas", value: "DONE" },
];

export function TaskFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") ?? "";

  function handleFilter(status: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = currentStatus === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => handleFilter(filter.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-indigo-600 text-white"
                : "border border-slate-700 bg-slate-900 text-slate-300 hover:border-indigo-500 hover:text-white"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}