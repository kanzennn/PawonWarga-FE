import { apiFetch } from "@/lib/api-client";
import { USE_MOCK_API } from "@/lib/api/config";
import { endpoints } from "@/lib/api/endpoints";
import { mockResponse } from "@/lib/api/http";
import { mapAiInsight } from "@/lib/api/mappers";
import { buildAiInsight } from "@/lib/api/mock/ai.mock";
import type { AiInsight, AiInsightDto } from "@/lib/api/types";

export async function getAiInsight(token?: string): Promise<AiInsight> {
  const dto = USE_MOCK_API
    ? await mockResponse(buildAiInsight)
    : await apiFetch<AiInsightDto>(endpoints.ai.insight, { token });

  return mapAiInsight(dto);
}
