/** Base URL for the MediCare backend (no trailing slash). */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL as string | undefined;
  const base = (raw?.trim() || "http://localhost:3000").replace(/\/$/, "");
  return base;
}

export function useLocalAuthOnly(): boolean {
  return import.meta.env.VITE_USE_LOCAL_AUTH === "true";
}

type ApiErrorBody = {
  success?: boolean;
  error?: { message?: string };
};

export async function parseJsonSafe(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export function getErrorMessage(body: unknown, fallback: string): string {
  const b = body as ApiErrorBody;
  return b?.error?.message || fallback;
}
