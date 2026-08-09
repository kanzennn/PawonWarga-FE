"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import MentionDetailModal from "@/components/mentions/MentionDetailModal";
import { DateRangeProvider } from "@/context/date-range-context";
import { MentionProvider } from "@/context/mention-context";
import { PlatformProvider } from "@/context/platform-context";
import { useAuth } from "@/context/auth-context";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f6faf5] text-sm font-bold text-[#6d7e75]">
        Loading...
      </div>
    );
  }

  return (
    <DateRangeProvider>
      <PlatformProvider>
        <MentionProvider>
          <AppShell>{children}</AppShell>
          <MentionDetailModal />
        </MentionProvider>
      </PlatformProvider>
    </DateRangeProvider>
  );
}
