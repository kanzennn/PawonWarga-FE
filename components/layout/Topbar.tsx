"use client";

import Image from "next/image";
import { Bell, CalendarDays, ChevronDown, Globe2, LogOut, Search } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getInitials } from "@/lib/formatters";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="mb-6 flex h-auto flex-wrap items-center justify-start gap-3.5 lg:h-[54px] lg:justify-end">
      <div className="flex h-[46px] w-full items-center gap-2.5 rounded-[14px] border border-[#dce8df] bg-white/90 px-4 text-[#6d7e75] shadow-[0_10px_30px_rgba(8,42,27,0.04)] lg:w-[335px]">
        <Search size={18} />
        <input
          className="w-full border-0 bg-transparent text-[#10231c] outline-none"
          placeholder="Search keyword, topic, or campaign..."
        />
      </div>

      <button className="flex h-[46px] items-center gap-2 rounded-[14px] border border-[#dce8df] bg-white/90 px-3.5 font-extrabold text-[#10231c] shadow-[0_10px_30px_rgba(8,42,27,0.04)]">
        <CalendarDays size={17} />
        <span>1 - 31 Mei 2025</span>
        <ChevronDown size={15} />
      </button>

      <button className="flex h-[46px] items-center gap-2 rounded-[14px] border border-[#dce8df] bg-white/90 px-3.5 font-extrabold text-[#10231c] shadow-[0_10px_30px_rgba(8,42,27,0.04)]">
        <Globe2 size={17} />
        <span>All Platforms</span>
        <ChevronDown size={15} />
      </button>

      <button className="relative flex h-[46px] w-[46px] items-center justify-center rounded-[14px] border border-[#dce8df] bg-white/90 text-[#063b2d] shadow-[0_10px_30px_rgba(8,42,27,0.04)]">
        <Bell size={19} />
        <span className="absolute -right-0.5 -top-1 grid h-[18px] w-[18px] place-items-center rounded-full bg-red-500 text-[11px] font-black text-white">
          3
        </span>
      </button>

      <button
        onClick={logout}
        title="Logout"
        className="flex h-[46px] items-center gap-2.5 rounded-[14px] border border-[#dce8df] bg-white/90 px-2.5 text-[#10231c] shadow-[0_10px_30px_rgba(8,42,27,0.04)]"
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
