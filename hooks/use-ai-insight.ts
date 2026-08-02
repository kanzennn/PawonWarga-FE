"use client";

import { useAuth } from "@/context/auth-context";
import { useApiQuery, type ApiQueryState } from "@/hooks/use-api-query";
import { getAiInsight } from "@/lib/api/ai";
import type { AiInsight } from "@/lib/api/types";

export function useAiInsight(): ApiQueryState<AiInsight> {
  const { token } = useAuth();

  return useApiQuery(() => getAiInsight(token ?? undefined), [token]);
}
