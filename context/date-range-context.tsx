"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export interface DateRange {
  /** ISO date "YYYY-MM-DD", or null for no lower/upper bound ("view without
   * a date range"). */
  from: string | null;
  to: string | null;
}

const NO_RANGE: DateRange = { from: null, to: null };

interface DateRangeContextValue {
  range: DateRange;
  setRange: (range: DateRange) => void;
  clearRange: () => void;
}

const DateRangeContext = createContext<DateRangeContextValue | null>(null);

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState<DateRange>(NO_RANGE);

  const value = useMemo<DateRangeContextValue>(
    () => ({
      range,
      setRange,
      clearRange: () => setRange(NO_RANGE),
    }),
    [range],
  );

  return <DateRangeContext.Provider value={value}>{children}</DateRangeContext.Provider>;
}

export function useDateRange(): DateRangeContextValue {
  const context = useContext(DateRangeContext);

  if (!context) {
    throw new Error("useDateRange must be used within a DateRangeProvider");
  }

  return context;
}
