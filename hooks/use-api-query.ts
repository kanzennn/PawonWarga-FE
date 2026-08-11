"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api-client";

export interface ApiQueryState<T> {
  data: T | null;
  error: string | null;
  /** True only until the first successful response — drives the full skeleton. */
  isLoading: boolean;
  /** True for every in-flight request, including refetches over existing data. */
  isFetching: boolean;
  refetch: () => void;
}

export const GENERIC_QUERY_ERROR = "Failed to load data from the server.";

interface Snapshot<T> {
  /** Which request produced this snapshot; null before the first response. */
  key: string | null;
  data: T | null;
  error: string | null;
}

/**
 * Runs `fetcher` whenever `deps` change and exposes the usual
 * loading/error/data triple. Previous data is kept while a refetch is in
 * flight so filter inputs don't unmount (and lose focus) on every keystroke.
 *
 * `deps` must hold primitives — they are stringified into the request key that
 * `isFetching` is derived from.
 *
 * Deliberately minimal — if this app ever needs caching, deduping, or
 * background revalidation, swap the body for TanStack Query without touching
 * a single call site.
 */
export function useApiQuery<T>(fetcher: () => Promise<T>, deps: unknown[]): ApiQueryState<T> {
  const [snapshot, setSnapshot] = useState<Snapshot<T>>({
    key: null,
    data: null,
    error: null,
  });
  const [reloadToken, setReloadToken] = useState(0);

  const requestKey = `${reloadToken}|${deps.map(String).join("|")}`;

  // Callers pass an inline arrow, so `fetcher` is a new function every render.
  // Parking it in a ref (synced from an effect, never during render) lets
  // `deps` alone decide when a refetch happens. This effect is declared first,
  // so the ref is already current when the fetch effect below runs.
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    let cancelled = false;

    fetcherRef
      .current()
      .then((result) => {
        if (cancelled) return;
        setSnapshot({ key: requestKey, data: result, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        setSnapshot((previous) => ({
          key: requestKey,
          // Keep whatever was on screen; the page decides whether to show the
          // error instead of stale data.
          data: previous.data,
          error: err instanceof ApiError ? err.message : GENERIC_QUERY_ERROR,
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [requestKey]);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  // No synchronous setState needed on the way in: a snapshot that doesn't
  // match the current request key means the response is still pending.
  const isFetching = snapshot.key !== requestKey;

  return {
    data: snapshot.data,
    error: snapshot.error,
    isLoading: isFetching && snapshot.data === null,
    isFetching,
    refetch,
  };
}
