"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Camera,
  KeyRound,
  MonitorCog,
  Pencil,
  Save,
  ShieldCheck,
  X,
  type LucideIcon,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import { ErrorState, SkeletonBlock } from "@/components/ui/DataState";
import { useAuth } from "@/context/auth-context";
import { usePreferenceUpdate, useSettingsPanels } from "@/hooks/use-settings";
import { ApiError } from "@/lib/api-client";
import { getInitials } from "@/lib/formatters";
import type { MonitoringPreference } from "@/lib/types";

// "fullName" and "phoneNumber" round-trip through GET/PUT
// /api/v1/auth/profile. The avatar round-trips through POST
// /api/v1/auth/profile/picture. Role/organization are fixed display labels
// under the name — not editable, no backing column in PawonWarga-BE yet.
export default function SettingsPage() {
  // DashboardLayout only renders this page once `user` is loaded, so it's
  // safe to seed local form state from it directly — no effect needed.
  const router = useRouter();
  const {
    user,
    updateProfile: saveProfileToApi,
    uploadAvatar,
    changePassword,
    logoutAllDevices,
  } = useAuth();
  const [profile, setProfile] = useState({
    fullName: user?.name ?? "",
    phoneNumber: user?.phone_number ?? "",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const draftBeforeEdit = useRef(profile);

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);
  const [logoutAllError, setLogoutAllError] = useState<string | null>(null);

  const {
    data: panels,
    isLoading: isPanelsLoading,
    error: panelsError,
    refetch: refetchPanels,
  } = useSettingsPanels();
  const { mutate: savePreference } = usePreferenceUpdate();

  // The fetched panels are the source of truth until a toggle overrides them,
  // which avoids mirroring server data into state via an effect. Integrations
  // have no client-side override — their status is read-only (see Data
  // Integrations below), so panels?.integrations is rendered directly.
  const [preferenceOverride, setPreferenceOverride] = useState<MonitoringPreference[] | null>(null);

  const preferences = preferenceOverride ?? panels?.preferences ?? [];
  const integrations = panels?.integrations ?? [];

  const updateProfileField = (key: keyof typeof profile, value: string) => {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [key]: value,
    }));
  };

  const startEditingProfile = () => {
    draftBeforeEdit.current = profile;
    setSaveError(null);
    setIsEditingProfile(true);
  };

  const cancelEditingProfile = () => {
    setProfile(draftBeforeEdit.current);
    setSaveError(null);
    setIsEditingProfile(false);
  };

  const saveProfile = async () => {
    setSaveError(null);
    setIsSaving(true);
    try {
      await saveProfileToApi({ name: profile.fullName, phoneNumber: profile.phoneNumber });
      setIsEditingProfile(false);
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setAvatarError(null);
    setIsUploadingAvatar(true);
    try {
      await uploadAvatar(file);
    } catch (err) {
      setAvatarError(err instanceof ApiError ? err.message : "Failed to upload profile picture.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    const confirmed = window.confirm(
      "This will log you out of all devices, including this one, and you'll need to sign in again. Continue?",
    );
    if (!confirmed) return;

    setLogoutAllError(null);
    setIsLoggingOutAll(true);
    try {
      await logoutAllDevices();
      router.replace("/login");
    } catch (err) {
      setLogoutAllError(err instanceof ApiError ? err.message : "Failed to log out of all devices.");
      setIsLoggingOutAll(false);
    }
  };

  // Both toggles flip locally first so the switch feels instant, then reconcile
  // with whatever the server returns — and roll back if the call fails.
  const togglePreference = async (key: string) => {
    const previous = preferences;
    const optimistic = preferences.map((item) =>
      item.key === key ? { ...item, checked: !item.checked } : item,
    );
    const target = optimistic.find((item) => item.key === key);
    if (!target) return;

    setPreferenceOverride(optimistic);

    try {
      setPreferenceOverride(await savePreference({ key, checked: target.checked }));
    } catch {
      setPreferenceOverride(previous);
    }
  };

  return (
    <div className="min-w-0 pb-24 lg:pb-0">
      <PageHeading title="Settings" subtitle="Manage your profile, security, monitoring preferences, and data source integrations." />

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card className="animate-fade-up min-w-0 p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative shrink-0">
                <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-[#e4f8d6] text-lg font-black text-[#07513b]">
                  {user?.profile_picture ? (
                    <Image
                      src={user.profile_picture}
                      alt={user.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(profile.fullName || "?")
                  )}
                </div>

                <label
                  htmlFor="avatar-upload"
                  title="Change profile picture"
                  className="absolute -bottom-1 -right-1 grid h-7 w-7 cursor-pointer place-items-center rounded-full border-2 border-white bg-[#052d22] text-white transition-all duration-200 hover:scale-105 hover:bg-[#0a4534] active:scale-95"
                >
                  <Camera size={13} />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={isUploadingAvatar}
                  onChange={(event) => void handleAvatarChange(event)}
                />
              </div>

              <div className="min-w-0">
                <b className="block truncate text-lg font-black text-[#10231c]">
                  {user?.name || "—"}
                </b>
                <p className="m-0 mt-1 truncate text-sm font-bold text-[#6d7e75]">
                  {user?.email || "—"}
                </p>
                {isUploadingAvatar && (
                  <span className="mt-1 block text-xs font-bold text-[#6d7e75]">Mengunggah...</span>
                )}
              </div>
            </div>

            {!isEditingProfile ? (
              <button
                onClick={startEditingProfile}
                className="inline-flex h-9 shrink-0 items-center gap-2 rounded-xl border border-[#dce8df] bg-white px-3.5 text-sm font-black text-[#10231c] transition-all duration-200 hover:border-[#07513b]/40 hover:bg-[#f4f8f2] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07513b] focus-visible:ring-offset-2"
              >
                <Pencil size={14} /> Edit
              </button>
            ) : (
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={cancelEditingProfile}
                  disabled={isSaving}
                  className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#dce8df] bg-white px-3.5 text-sm font-black text-[#10231c] transition-all duration-200 hover:border-[#07513b]/40 hover:bg-[#f4f8f2] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07513b] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X size={14} /> Cancel
                </button>
                <button
                  onClick={() => void saveProfile()}
                  disabled={isSaving}
                  className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#052d22] px-3.5 text-sm font-black text-white transition-all duration-200 hover:bg-[#07513b] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07513b] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={14} /> {isSaving ? "Menyimpan..." : "Save"}
                </button>
              </div>
            )}
          </div>

          {avatarError && <p className="m-0 mt-3 text-sm font-bold text-[#d63838]">{avatarError}</p>}

          <div className="my-6 h-px bg-[#eef2ef]" />

          <h4 className="m-0 mb-4 text-xs font-black uppercase tracking-wide text-[#9aaa9f]">
            Personal Information
          </h4>

          {isEditingProfile ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Full Name" value={profile.fullName} onChange={(value) => updateProfileField("fullName", value)} />
              <Input label="Email" value={user?.email ?? ""} onChange={() => {}} disabled />
              <Input label="Phone Number" value={profile.phoneNumber} onChange={(value) => updateProfileField("phoneNumber", value)} />
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              <InfoField label="Full Name" value={profile.fullName} />
              <InfoField label="Email address" value={user?.email ?? "—"} />
              <InfoField label="Phone" value={profile.phoneNumber || "—"} />
            </div>
          )}

          {saveError && <p className="m-0 mt-4 text-sm font-bold text-[#d63838]">{saveError}</p>}
        </Card>

        <Card title="Account Security" className="animate-fade-up p-7 [animation-delay:80ms]">
          <div className="grid gap-4">
            <SettingRow
              icon={KeyRound}
              title="Password"
              desc="Change your account password regularly."
              action="Change"
              onAction={() => setIsChangePasswordOpen(true)}
            />
            <SettingRow icon={ShieldCheck} title="Two-Factor Auth" desc="Enabled via authenticator app" action="Manage" />
            <SettingRow
              icon={MonitorCog}
              title="Login Devices"
              desc="Sign out of all active sessions, including this device."
              action={isLoggingOutAll ? "Logging out..." : "Log Out"}
              onAction={() => void handleLogoutAllDevices()}
              disabled={isLoggingOutAll}
            />
          </div>
          {logoutAllError && <p className="m-0 mt-4 text-sm font-bold text-[#d63838]">{logoutAllError}</p>}
        </Card>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card title="Monitoring Preferences" className="animate-fade-up p-7 [animation-delay:140ms]">
          {isPanelsLoading ? (
            <PreferencesSkeleton />
          ) : !panels ? (
            <ErrorState message={panelsError ?? "Preferences unavailable."} onRetry={refetchPanels} />
          ) : (
          <div className="grid gap-4 md:grid-cols-2 sm:grid-cols-1">
            {preferences.map((item) => (
              <Toggle
                key={item.key}
                title={item.title}
                desc={item.desc}
                checked={item.checked}
                onToggle={() => togglePreference(item.key)}
              />
            ))}
          </div>
          )}
        </Card>

        <Card title="Data Integrations" className="animate-fade-up p-7 [animation-delay:180ms]">
          {isPanelsLoading ? (
            <IntegrationsSkeleton />
          ) : !panels ? (
            <ErrorState message={panelsError ?? "Integrations unavailable."} onRetry={refetchPanels} />
          ) : (
          <div className="grid gap-3">
            {integrations.map((item) => {
              const isOperational = item.status === "Operational";

              return (
              <div key={item.name} className="flex items-center justify-between gap-4 rounded-2xl border border-[#dce8df] bg-[#fbfdf8] p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_32px_rgba(11,68,45,0.08)]">
                <div>
                  <b className="text-[#10231c]">{item.name}</b>
                  <p className="m-0 mt-1 text-sm text-[#6d7e75]">{item.count}</p>
                </div>
                <span
                  title="Status is reported automatically and can't be changed here"
                  className={[
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black",
                    isOperational ? "bg-[#e1f8d9] text-[#15803d]" : "bg-[#eef2f3] text-[#607079]",
                  ].join(" ")}
                >
                  <span
                    className={["h-1.5 w-1.5 shrink-0 rounded-full", isOperational ? "bg-[#15803d]" : "bg-[#607079]"].join(" ")}
                  />
                  {item.status}
                </span>
              </div>
              );
            })}
          </div>
          )}
        </Card>
      </div>

      <ChangePasswordModal
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSubmit={changePassword}
      />
    </div>
  );
}

function ChangePasswordModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void>;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New password confirmation doesn't match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(currentPassword, newPassword);
      handleClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to change password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} title="Change Password" onClose={handleClose}>
      <form className="grid gap-4" onSubmit={(event) => void handleSubmit(event)}>
        <label className="grid gap-2 text-sm font-black text-[#10231c]">
          Current Password
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="h-12 rounded-2xl border border-[#dce8df] bg-white px-4 font-bold text-[#10231c] outline-none transition-colors focus:border-[#07513b] focus:ring-2 focus:ring-[#07513b]/15"
          />
        </label>

        <label className="grid gap-2 text-sm font-black text-[#10231c]">
          New Password
          <input
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="h-12 rounded-2xl border border-[#dce8df] bg-white px-4 font-bold text-[#10231c] outline-none transition-colors focus:border-[#07513b] focus:ring-2 focus:ring-[#07513b]/15"
          />
        </label>

        <label className="grid gap-2 text-sm font-black text-[#10231c]">
          Confirm New Password
          <input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="h-12 rounded-2xl border border-[#dce8df] bg-white px-4 font-bold text-[#10231c] outline-none transition-colors focus:border-[#07513b] focus:ring-2 focus:ring-[#07513b]/15"
          />
        </label>

        {error && <p className="m-0 text-sm font-bold text-[#d63838]">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-12 rounded-2xl bg-[#052d22] font-black text-white transition-all duration-200 hover:bg-[#07513b] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07513b] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Menyimpan..." : "Save Password"}
        </button>
      </form>
    </Modal>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1.5">
      <span className="text-xs font-bold text-[#9aaa9f]">{label}</span>
      <span className="text-sm font-black text-[#10231c]">{value}</span>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-black text-[#10231c]">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="h-12 rounded-2xl border border-[#dce8df] bg-white px-4 font-bold text-[#10231c] outline-none transition-colors focus:border-[#07513b] focus:ring-2 focus:ring-[#07513b]/15 disabled:cursor-not-allowed disabled:bg-[#f6faf5] disabled:text-[#6d7e75]"
      />
    </label>
  );
}

function SettingRow({
  icon: Icon,
  title,
  desc,
  action,
  onAction,
  disabled = false,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  action: string;
  onAction?: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#dce8df] bg-[#fbfdf8] p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_32px_rgba(11,68,45,0.08)]">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e4f8d6] text-[#07513b]"><Icon size={20} /></span>
      <div className="min-w-0 flex-1">
        <b className="text-[#10231c]">{title}</b>
        <p className="m-0 mt-1 text-sm text-[#6d7e75]">{desc}</p>
      </div>
      <button
        onClick={onAction}
        disabled={disabled || !onAction}
        className="h-9 shrink-0 whitespace-nowrap rounded-xl border border-[#dce8df] bg-white px-3 font-black text-[#10231c] transition-all duration-200 hover:border-[#07513b]/40 hover:bg-[#f4f8f2] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07513b] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-[#dce8df] disabled:hover:bg-white"
      >
        {action}
      </button>
    </div>
  );
}

function Toggle({ title, desc, checked, onToggle }: { title: string; desc: string; checked: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-[#dce8df] bg-[#fbfdf8] p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_32px_rgba(11,68,45,0.08)]">
      <div><b className="text-[#10231c]">{title}</b><p className="m-0 mt-1 text-sm leading-6 text-[#6d7e75]">{desc}</p></div>
      <button
        onClick={onToggle}
        aria-pressed={checked}
        aria-label={title}
        className={[
          "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07513b] focus-visible:ring-offset-2",
          checked ? "bg-[#67c74a]" : "bg-[#dce8df]",
        ].join(" ")}
      >
        <span className={["absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200", checked ? "left-6" : "left-1"].join(" ")} />
      </button>
    </div>
  );
}

function PreferencesSkeleton() {
  return (
    <div aria-live="polite" aria-busy="true" className="grid gap-4 md:grid-cols-2 sm:grid-cols-1">
      <span className="sr-only">Loading preferences...</span>
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonBlock key={i} className="h-[84px] rounded-2xl" />
      ))}
    </div>
  );
}

function IntegrationsSkeleton() {
  return (
    <div aria-live="polite" aria-busy="true" className="grid gap-3">
      <span className="sr-only">Loading integrations...</span>
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonBlock key={i} className="h-[72px] rounded-2xl" />
      ))}
    </div>
  );
}

function PageHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-7 max-w-xl">
      <h1 className="m-0 text-[28px] font-black tracking-[-0.7px] text-[#10231c]">{title}</h1>
      <p className="mt-1 text-[15px] text-[#6d7e75]">{subtitle}</p>
    </div>
  );
}
