import { monitoringPreferences, settingsIntegrations } from "@/lib/data/dummy-data";
import type {
  MonitoringPreferenceDto,
  SettingsIntegrationDto,
  UpdatePreferenceInput,
} from "@/lib/api/types";

// Mutable copies so a toggle sticks for the rest of the browser session,
// the way a real PATCH would. Reloading the page resets them.
let integrationState: SettingsIntegrationDto[] = settingsIntegrations.map((item) => ({ ...item }));
let preferenceState: MonitoringPreferenceDto[] = monitoringPreferences.map((item) => ({ ...item }));

export function buildIntegrations(): SettingsIntegrationDto[] {
  return integrationState.map((item) => ({ ...item }));
}

export function buildPreferences(): MonitoringPreferenceDto[] {
  return preferenceState.map((item) => ({ ...item }));
}

export function toggleIntegrationStatus(name: string): SettingsIntegrationDto[] {
  integrationState = integrationState.map((item) =>
    item.name === name
      ? {
          ...item,
          status: item.status === "Operational" ? "Not Operational" : "Operational",
        }
      : item,
  );

  return buildIntegrations();
}

export function applyPreference(input: UpdatePreferenceInput): MonitoringPreferenceDto[] {
  preferenceState = preferenceState.map((item) =>
    item.key === input.key ? { ...item, checked: input.checked } : item,
  );

  return buildPreferences();
}
