import type { ReactNode } from "react";
import type { Sentiment } from "@/lib/types";

type BadgeTone = Sentiment | "danger";

const badgeClasses: Record<BadgeTone, string> = {
  positive: "bg-[#e1f8d9] text-[#15803d]",
  negative: "bg-[#ffe5e5] text-[#d63838]",
  neutral: "bg-[#fff3ce] text-[#a66d00]",
  danger: "bg-[#ffe5e5] text-[#d63838]",
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
}

export default function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex h-[26px] w-max items-center rounded-full px-2.5 text-xs font-black capitalize",
        badgeClasses[tone] || badgeClasses.neutral,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
