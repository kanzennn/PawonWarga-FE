"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Bell, CalendarDays, ChevronDown, Globe2, LogOut, X } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useDateRange } from "@/context/date-range-context";
import { PLATFORM_OPTIONS, usePlatform } from "@/context/platform-context";
import { getInitials } from "@/lib/formatters";

function formatRangeLabel(from: string | null, to: string | null): string {
  if (!from && !to) return "All Time";

  const fmt = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (from && to) return `${fmt(from)} - ${fmt(to)}`;
  if (from) return `From ${fmt(from)}`;
  return `Until ${fmt(to as string)}`;
}

export default function Topbar() {
  const { user, logout } = useAuth();
  const { range, setRange, clearRange } = useDateRange();
  const { platform, setPlatform } = usePlatform();

  const [open, setOpen] = useState(false);
  const [draftFrom, setDraftFrom] = useState(range.from ?? "");
  const [draftTo, setDraftTo] = useState(range.to ?? "");
  const panelRef = useRef<HTMLDivElement>(null);

  const [platformOpen, setPlatformOpen] = useState(false);
  const platformPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!platformOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (platformPanelRef.current && !platformPanelRef.current.contains(event.target as Node)) {
        setPlatformOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [platformOpen]);

  const toggleOpen = () => {
    if (!open) {
      setDraftFrom(range.from ?? "");
      setDraftTo(range.to ?? "");
    }
    setOpen((current) => !current);
  };

  const applyRange = () => {
    setRange({ from: draftFrom || null, to: draftTo || null });
    setOpen(false);
  };

  const viewAllTime = () => {
    clearRange();
    setDraftFrom("");
    setDraftTo("");
    setOpen(false);
  };

  const selectPlatform = (value: string | null) => {
    setPlatform(value);
    setPlatformOpen(false);
  };

  return (
    <header className="mb-6 flex h-auto flex-wrap items-center justify-start gap-3.5 lg:h-[54px] lg:justify-end">
      <div className="relative">
        <button
          onClick={toggleOpen}
          className="flex h-[46px] items-center gap-2 rounded-[14px] border border-[#dce8df] bg-white/90 px-3.5 font-extrabold text-[#10231c] shadow-[0_10px_30px_rgba(8,42,27,0.04)]"
        >
          <CalendarDays size={17} />
          <span>{formatRangeLabel(range.from, range.to)}</span>
          <ChevronDown size={15} />
        </button>

        {open && (
          <div
            ref={panelRef}
            className="absolute right-0 top-[54px] z-40 w-[300px] rounded-[16px] border border-[#dce8df] bg-white p-4 shadow-[0_18px_44px_rgba(8,42,27,0.14)]"
          >
            <div className="mb-3 flex items-center justify-between">
              <b className="text-sm text-[#10231c]">Date range</b>
              <button
                onClick={() => setOpen(false)}
                className="grid h-7 w-7 place-items-center rounded-lg text-[#6d7e75] hover:bg-[#f3f8ee]"
              >
                <X size={15} />
              </button>
            </div>

            <div className="grid gap-3">
              <label className="grid gap-1 text-xs font-bold text-[#6d7e75]">
                From
                <input
                  type="date"
                  value={draftFrom}
                  max={draftTo || undefined}
                  onChange={(event) => setDraftFrom(event.target.value)}
                  className="h-10 rounded-xl border border-[#dce8df] px-3 text-sm text-[#10231c] outline-none"
                />
              </label>

              <label className="grid gap-1 text-xs font-bold text-[#6d7e75]">
                To
                <input
                  type="date"
                  value={draftTo}
                  min={draftFrom || undefined}
                  onChange={(event) => setDraftTo(event.target.value)}
                  className="h-10 rounded-xl border border-[#dce8df] px-3 text-sm text-[#10231c] outline-none"
                />
              </label>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={viewAllTime}
                className="h-10 rounded-xl border border-[#dce8df] bg-white text-sm font-extrabold text-[#10231c]"
              >
                View All Time
              </button>
              <button
                onClick={applyRange}
                disabled={!draftFrom && !draftTo}
                className="h-10 rounded-xl bg-[#052d22] text-sm font-extrabold text-white disabled:opacity-40"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setPlatformOpen((current) => !current)}
          className="flex h-[46px] items-center gap-2 rounded-[14px] border border-[#dce8df] bg-white/90 px-3.5 font-extrabold text-[#10231c] shadow-[0_10px_30px_rgba(8,42,27,0.04)]"
        >
          <Globe2 size={17} />
          <span>{platform ?? "All Platforms"}</span>
          <ChevronDown size={15} />
        </button>

        {platformOpen && (
          <div
            ref={platformPanelRef}
            className="absolute right-0 top-[54px] z-40 w-[220px] rounded-[16px] border border-[#dce8df] bg-white p-2 shadow-[0_18px_44px_rgba(8,42,27,0.14)]"
          >
            <button
              onClick={() => selectPlatform(null)}
              className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-bold hover:bg-[#f3f8ee] ${
                platform === null ? "bg-[#eef7ea] text-[#07513b]" : "text-[#10231c]"
              }`}
            >
              All Platforms
            </button>
            {PLATFORM_OPTIONS.map((name) => (
              <button
                key={name}
                onClick={() => selectPlatform(name)}
                className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-bold hover:bg-[#f3f8ee] ${
                  platform === name ? "bg-[#eef7ea] text-[#07513b]" : "text-[#10231c]"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      <button className="relative flex h-[46px] w-[46px] items-center justify-center rounded-[14px] border border-[#dce8df] bg-white/90 text-[#063b2d] shadow-[0_10px_30px_rgba(8,42,27,0.04)]">
        <Bell size={19} />
        <span className="absolute -right-0.5 -top-1 grid h-[18px] w-[18px] place-items-center rounded-full bg-red-500 text-[11px] font-black text-white">
          3
        </span>
      </button>

      <button
        onClick={logout}
        title="Logout"
        className="flex h-[46px] items-center gap-2.5 rounded-[14px] border border-[#dce8df] bg-white/90 px-2.5 text-[#10231c] shadow-[0_10px_30px_rgba(8,42,27,0.04)] lg:hidden"
      >
        <div className="grid h-[38px] w-[38px] shrink-0 place-items-center overflow-hidden rounded-full bg-[#e4f8d6] text-xs font-black text-[#07513b]">
          {user?.profile_picture ? (
            <Image
              src={user.profile_picture}
              alt={user.name}
              width={38}
              height={38}
              className="h-full w-full object-cover"
            />
          ) : (
            getInitials(user?.name || "?")
          )}
        </div>
        <div className="hidden text-left sm:grid">
          <b className="text-[13px]">{user?.name ?? "Analyst"}</b>
          <small className="max-w-[120px] truncate text-xs text-[#6d7e75]">
            {user?.email ?? "Admin"}
          </small>
        </div>
        <LogOut size={15} />
      </button>
    </header>
  );
}
