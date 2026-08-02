"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  FileText,
  Grid2X2,
  LockKeyhole,
  MessageSquareText,
  Search,
  Settings,
  Smile,
  type LucideIcon,
} from "lucide-react";
import LogoMark from "@/components/ui/LogoMark";

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
  { href: "/settings", label: "Settings", icon: Settings },
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

  return (
    <aside
      className={[
        "fixed inset-x-0 bottom-0 z-40 flex h-[72px] items-center gap-2 overflow-x-auto bg-[#0d321e] px-3 text-white lg:sticky lg:top-0 lg:h-screen lg:flex-col lg:items-stretch lg:overflow-hidden lg:bg-[radial-gradient(circle_at_72%_34%,rgba(151,221,85,0.24),transparent_30%),linear-gradient(180deg,#0d321e,#102c1a_68%,#092014)] lg:transition-all lg:duration-300",
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

      {!isCollapsed && (
        <div className="mt-auto hidden rounded-[18px] border border-[#ddffc2]/40 bg-white/5 p-5 lg:block">
          <div className="text-[#f4b21b]">♛</div>
          <h3 className="my-2 mb-4 text-[15px] leading-relaxed">
            Unlock deeper public insight with AI-generated reports
          </h3>
          <button
            type="button"
            className="h-11 w-full rounded-xl border-0 bg-gradient-to-b from-[#ffc83d] to-[#f3ae16] font-black text-[#122316]"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      {isCollapsed && (
        <button
          type="button"
          title="Lock"
          className="mt-auto hidden h-[52px] w-[52px] place-items-center rounded-2xl border-0 bg-[#d9ffc2] text-[#052d22] lg:grid"
        >
          <LockKeyhole size={18} />
        </button>
      )}
    </aside>
  );
}
