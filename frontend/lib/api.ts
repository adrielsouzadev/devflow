import "server-only";

type ApiOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

export type ApiResponse<T> = {
  status: number;
  data: T | null;
};

export type ApiErrorBody = {
  error: string;
  details?: {
    formErrors: string[];
    fieldErrors: Record<string, string[] | undefined>;
  };
};

function readApiUrl(): string {
  const value = process.env.API_URL;

  if (!value) {
    throw new Error("API_URL não está definida em frontend/.env.local");
  }

  return value;
}

const apiUrl = readApiUrl();

export async function apiFetch<T = unknown>(
  path: string,
  { method = "GET", body, token }: ApiOptions = {},
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${apiUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  // Respostas 204 não têm corpo.
  const text = await response.text();
  const data = text ? (JSON.parse(text) as T) : null;

  return { status: response.status, data };
}