import { MOCK_LATENCY_MS } from "@/lib/api/config";

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

// Appends only the params that carry a value, so "/mentions" stays clean when
// no filter is active instead of becoming "/mentions?q=&platform=".
export function withQuery(path: string, params: QueryParams = {}): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }

  const queryString = search.toString();
  return queryString ? `${path}?${queryString}` : path;
}

// Resolves a locally built DTO after a simulated round-trip. Services feed the
// result through the same mapper the real response uses, so switching
// NEXT_PUBLIC_USE_MOCK_API only changes where the DTO comes from.
export function mockResponse<T>(build: () => T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(build()), MOCK_LATENCY_MS);
  });
}
