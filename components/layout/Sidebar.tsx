"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  FileText,
  Grid2X2,
  LogOut,
  MessageSquareText,
  Search,
  Settings,
  Smile,
  type LucideIcon,
} from "lucide-react";
import LogoMark from "@/components/ui/LogoMark";
import { useAuth } from "@/context/auth-context";
import { getInitials } from "@/lib/formatters";

interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const menus: MenuItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Grid2X2 },
  { href: "/monitoring", label: "Social Monitoring", icon: MessageSquareText },
  { href: "/sentiment", label: "Sentiment Analysis", icon: Smile },
  { href: "/keywords", label: "Keyword Sentiment", icon: Search },
  // { href: "/ai", label: "AI Summary", icon: Bot },
  { href: "/reports", label: "Reports", icon: FileText },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profileOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  return (
    <aside
      className={[
        "fixed inset-x-0 bottom-0 z-40 flex h-[72px] items-center gap-2 overflow-x-auto bg-[#0d321e] px-3 text-white lg:sticky lg:top-0 lg:h-screen lg:flex-col lg:items-stretch lg:bg-[radial-gradient(circle_at_72%_34%,rgba(151,221,85,0.24),transparent_30%),linear-gradient(180deg,#0d321e,#102c1a_68%,#092014)] lg:transition-all lg:duration-300",
        profileOpen ? "lg:overflow-visible" : "lg:overflow-hidden",
        isCollapsed
          ? "lg:w-[88px] lg:px-3.5 lg:py-5"
          : "lg:w-[300px] lg:px-4 lg:py-6",
      ].join(" ")}
    >
      <div
        className={[
          "hidden lg:flex",
          isCollapsed
            ? "mb-7 w-full flex-col items-center gap-4"
            : "mb-9 items-center justify-between gap-4",
        ].join(" ")}
      >
        <div
          className={[
            "flex items-center gap-3.5 min-w-0",
            isCollapsed ? "justify-center" : "",
          ].join(" ")}
        >
          <LogoMark />

          {!isCollapsed && (
            <div className="min-w-0">
              <h2 className="m-0 text-xl font-black leading-none">MBG</h2>
              <p className="m-0 mt-1 text-lg font-semibold leading-none text-[#d6ead0]">
                Insight AI
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="grid h-10 w-10 place-items-center rounded-xl border border-[#ddffc2]/30 bg-white/10 text-[#eaf7df] transition hover:-translate-y-0.5 hover:bg-[#d8ffc2]/15"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav
        className={[
          "flex min-w-max gap-2 lg:grid lg:min-w-0",
          isCollapsed ? "lg:w-full lg:justify-items-center" : "",
        ].join(" ")}
      >
        {menus.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={[
                "flex h-[48px] items-center rounded-[14px] px-3 font-extrabold whitespace-nowrap transition lg:h-[52px]",
                isCollapsed
                  ? "lg:w-[52px] lg:justify-center lg:p-0"
                  : "lg:w-full lg:gap-3 lg:px-3.5 lg:text-left",
                isActive
                  ? "bg-gradient-to-br from-[#dcffc5] to-[#c8f7a6] text-[#052d22] shadow-[0_16px_35px_rgba(207,255,174,0.16)]"
                  : "bg-transparent text-[#f5fff1] hover:bg-white/10",
              ].join(" ")}
            >
              <Icon size={20} className="shrink-0" />
              {!isCollapsed && (
                <span className="hidden overflow-hidden text-ellipsis lg:inline">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div ref={profileRef} className="relative mt-auto hidden lg:block">
        {profileOpen && (
          <div
            className={[
              "absolute bottom-[calc(100%+10px)] z-50 w-[260px] overflow-hidden rounded-[16px] border border-[#dce8df] bg-white p-1.5 text-[#10231c] shadow-[0_20px_46px_rgba(8,42,27,0.22)]",
              isCollapsed ? "left-0" : "left-0 right-0 w-auto",
            ].join(" ")}
          >
            <div className="flex items-center gap-3 p-2.5">
              <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[#e4f8d6] text-xs font-black text-[#07513b]">
                {user?.profile_picture ? (
                  <Image
                    src={user.profile_picture}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitials(user?.name || "?")
                )}
              </div>
              <div className="min-w-0">
                <b className="block truncate text-sm">{user?.name ?? "Analyst"}</b>
                <small className="block truncate text-xs text-[#6d7e75]">
                  {user?.email ?? "Admin"}
                </small>
              </div>
            </div>

            <div className="my-1 h-px bg-[#eef2ef]" />

            <Link
              href="/settings"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-[#10231c] transition hover:bg-[#f3f8ee]"
            >
              <Settings size={16} />
              Settings
            </Link>

            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-[#d63838] transition hover:bg-[#fff2f2]"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setProfileOpen((current) => !current)}
          aria-haspopup="menu"
          aria-expanded={profileOpen}
          className={[
            "flex w-full items-center gap-2.5 rounded-[18px] border border-[#ddffc2]/20 bg-white/5 p-3 transition hover:bg-white/10",
            isCollapsed ? "justify-center" : "",
          ].join(" ")}
        >
          <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-[#e4f8d6] text-xs font-black text-[#07513b]">
            {user?.profile_picture ? (
              <Image
                src={user.profile_picture}
                alt={user.name}
                width={44}
                height={44}
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials(user?.name || "?")
            )}
          </div>

          {!isCollapsed && (
            <>
              <div className="min-w-0 flex-1 text-left">
                <b className="block truncate text-[13px] text-white">
                  {user?.name ?? "Analyst"}
                </b>
                <small className="block truncate text-xs text-[#a9c7ae]">
                  {user?.email ?? "Admin"}
                </small>
              </div>

              <ChevronsUpDown size={15} className="shrink-0 text-[#a9c7ae]" />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
