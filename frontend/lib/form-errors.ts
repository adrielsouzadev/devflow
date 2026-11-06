import type { ApiErrorBody } from "@/lib/api";

export type FormErrors = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export function getFormErrors(data: unknown): FormErrors {
  if (!data || typeof data !== "object" || !("error" in data)) {
    return { error: "Ocorreu um erro inesperado." };
  }

  const apiError = data as ApiErrorBody;

  return {
    error: apiError.error,
    fieldErrors: apiError.details?.fieldErrors,
  };
}