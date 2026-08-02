import { apiFetch } from "@/lib/api-client";
import { USE_MOCK_API } from "@/lib/api/config";
import { endpoints } from "@/lib/api/endpoints";
import { mockResponse } from "@/lib/api/http";
import {
  applyPreference,
  buildIntegrations,
  buildPreferences,
  toggleIntegrationStatus,
} from "@/lib/api/mock/settings.mock";
import type { MonitoringPreference, SettingsIntegration } from "@/lib/types";
import type {
  MonitoringPreferenceDto,
  SettingsIntegrationDto,
  UpdatePreferenceInput,
  UpdatePreferenceRequestDto,
} from "@/lib/api/types";

export async function getIntegrations(token?: string): Promise<SettingsIntegration[]> {
  if (USE_MOCK_API) {
    return mockResponse(buildIntegrations);
  }

  return apiFetch<SettingsIntegrationDto[]>(endpoints.settings.integrations, { token });
}

export async function toggleIntegration(
  name: string,
  token?: string,
): Promise<SettingsIntegration[]> {
  if (USE_MOCK_API) {
    return mockResponse(() => toggleIntegrationStatus(name));
  }

  return apiFetch<SettingsIntegrationDto[]>(endpoints.settings.integration(name), {
    method: "PATCH",
    token,
  });
}

export async function getPreferences(token?: string): Promise<MonitoringPreference[]> {
  if (USE_MOCK_API) {
    return mockResponse(buildPreferences);
  }

  return apiFetch<MonitoringPreferenceDto[]>(endpoints.settings.preferences, { token });
}

export async function updatePreference(
  input: UpdatePreferenceInput,
  token?: string,
): Promise<MonitoringPreference[]> {
  if (USE_MOCK_API) {
    return mockResponse(() => applyPreference(input));
  }

  const payload: UpdatePreferenceRequestDto = { key: input.key, checked: input.checked };

  return apiFetch<MonitoringPreferenceDto[]>(endpoints.settings.preferences, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}
