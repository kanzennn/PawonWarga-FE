"use client";

import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell({ children }: { children: ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div
      className={[
        "min-h-screen bg-[#f6faf5] transition-[grid-template-columns] duration-300 lg:grid",
        isSidebarCollapsed
          ? "lg:grid-cols-[88px_minmax(0,1fr)]"
          : "lg:grid-cols-[300px_minmax(0,1fr)]",
      ].join(" ")}
    >
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((value) => !value)}
      />

      <main className="min-w-0 bg-[radial-gradient(circle_at_45%_20%,rgba(165,231,137,0.16),transparent_28%),#f6faf5] px-5 py-5 md:px-8 md:py-7">
        <Topbar />
        {children}
      </main>
    </div>
  );
}
