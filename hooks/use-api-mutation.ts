"use client";

import { useCallback, useState } from "react";
import { ApiError } from "@/lib/api-client";

export interface ApiMutationState<TInput, TResult> {
  mutate: (input: TInput) => Promise<TResult>;
  isPending: boolean;
  error: string | null;
  reset: () => void;
}

export const GENERIC_MUTATION_ERROR = "Failed to send request to the server.";

/**
 * Write counterpart to useApiQuery. `mutate` rethrows so the caller can branch
 * on success, while `error` holds the message for rendering.
 *
 * Pass a `useCallback`-stable `action` — `mutate` inherits its identity.
 */
export function useApiMutation<TInput, TResult>(
  action: (input: TInput) => Promise<TResult>,
): ApiMutationState<TInput, TResult> {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (input: TInput) => {
      setIsPending(true);
      setError(null);

      try {
        return await action(input);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : GENERIC_MUTATION_ERROR);
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    [action],
  );

  const reset = useCallback(() => setError(null), []);

  return { mutate, isPending, error, reset };
}
