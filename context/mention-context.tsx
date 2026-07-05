"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Mention } from "@/lib/types";

interface MentionContextValue {
  selectedMention: Mention | null;
  selectMention: (mention: Mention) => void;
  clearMention: () => void;
}

const MentionContext = createContext<MentionContextValue | null>(null);

export function MentionProvider({ children }: { children: ReactNode }) {
  const [selectedMention, setSelectedMention] = useState<Mention | null>(null);

  const value = useMemo<MentionContextValue>(
    () => ({
      selectedMention,
      selectMention: setSelectedMention,
      clearMention: () => setSelectedMention(null),
    }),
    [selectedMention],
  );

  return <MentionContext.Provider value={value}>{children}</MentionContext.Provider>;
}

export function useMention(): MentionContextValue {
  const context = useContext(MentionContext);

  if (!context) {
    throw new Error("useMention must be used within a MentionProvider");
  }

  return context;
}
