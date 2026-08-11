import { monitoringPreferences, settingsIntegrations } from "@/lib/data/dummy-data";
import type {
  MonitoringPreferenceDto,
  SettingsIntegrationDto,
  UpdatePreferenceInput,
} from "@/lib/api/types";

// Preferences keep a mutable copy so a toggle sticks for the rest of the
// browser session, the way a real PUT would. Reloading the page resets it.
// Integrations have no such state — their status is read-only (reported
// automatically), so buildIntegrations just re-maps the dummy data fresh
// every call.
let preferenceState: MonitoringPreferenceDto[] = monitoringPreferences.map((item) => ({ ...item }));

export function buildIntegrations(): SettingsIntegrationDto[] {
  return settingsIntegrations.map((item) => ({ ...item }));
}

export function buildPreferences(): MonitoringPreferenceDto[] {
  return preferenceState.map((item) => ({ ...item }));
}

export function applyPreference(input: UpdatePreferenceInput): MonitoringPreferenceDto[] {
  preferenceState = preferenceState.map((item) =>
    item.key === input.key ? { ...item, checked: input.checked } : item,
  );

  return buildPreferences();
}
