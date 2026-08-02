"use client";

import { useEffect, useState } from "react";

/**
 * Delays propagating `value` until it has stopped changing for `delayMs`.
 * Filters that fire a request on every keystroke (Keyword Sentiment) pass the
 * debounced copy to their query hook while the input stays bound to the raw
 * state, so typing remains instant but the backend sees one request.
 */
export function useDebouncedValue<T>(value: T, delayMs = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
