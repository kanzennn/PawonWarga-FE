import { API_BASE_URL } from "@/lib/api/config";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

function readEnvelope<T>(response: Response, body: ApiEnvelope<T> | null): T {
  if (!response.ok || !body?.success) {
    throw new ApiError(body?.message ?? `Request failed with status ${response.status}`, response.status);
  }
  return body.data as T;
}

interface ApiFetchOptions extends Omit<RequestInit, "headers"> {
  token?: string;
  headers?: Record<string, string>;
}

// Thin wrapper around PawonWarga-BE's {success, message, data} response envelope.
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  return readEnvelope(response, body);
}

// For multipart/form-data uploads (e.g. profile picture) — deliberately
// doesn't set Content-Type so the browser can add the multipart boundary.
export async function apiUpload<T>(path: string, formData: FormData, token: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  return readEnvelope(response, body);
}
