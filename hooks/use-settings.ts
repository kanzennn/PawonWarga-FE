"use client";

import { useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { useApiMutation, type ApiMutationState } from "@/hooks/use-api-mutation";
import { useApiQuery, type ApiQueryState } from "@/hooks/use-api-query";
import { getIntegrations, getPreferences, updatePreference } from "@/lib/api/settings";
import type { MonitoringPreference, SettingsIntegration } from "@/lib/types";
import type { UpdatePreferenceInput } from "@/lib/api/types";

export interface SettingsPanels {
  integrations: SettingsIntegration[];
  preferences: MonitoringPreference[];
}

// Two separate resources on the backend, one loading state on the page — the
// Settings screen renders both cards together, so a partial load would just
// mean two spinners in the same column.
export function useSettingsPanels(): ApiQueryState<SettingsPanels> {
  const { token } = useAuth();

  return useApiQuery(async () => {
    const [integrations, preferences] = await Promise.all([
      getIntegrations(token ?? undefined),
      getPreferences(token ?? undefined),
    ]);

    return { integrations, preferences };
  }, [token]);
}

export function usePreferenceUpdate(): ApiMutationState<
  UpdatePreferenceInput,
  MonitoringPreference[]
> {
  const { token } = useAuth();

  const action = useCallback(
    (input: UpdatePreferenceInput) => updatePreference(input, token ?? undefined),
    [token],
  );

  return useApiMutation(action);
}
