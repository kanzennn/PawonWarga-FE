"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/** Display-name platform values, matching the backend's platformDisplayOrder
 * (internal/handler/mention.go) — these are exactly what the API expects for
 * the `platform` query param. */
export const PLATFORM_OPTIONS = ["X", "Instagram", "TikTok", "News", "YouTube"] as const;

interface PlatformContextValue {
  /** null means no filter applied ("All Platforms"). */
  platform: string | null;
  setPlatform: (platform: string | null) => void;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [platform, setPlatform] = useState<string | null>(null);

  const value = useMemo<PlatformContextValue>(
    () => ({ platform, setPlatform }),
    [platform],
  );

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform(): PlatformContextValue {
  const context = useContext(PlatformContext);

  if (!context) {
    throw new Error("usePlatform must be used within a PlatformProvider");
  }

  return context;
}
