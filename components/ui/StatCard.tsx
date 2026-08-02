import type { LucideIcon } from "lucide-react";

export type StatTone = "positive" | "danger" | "neutral" | "info";

interface ToneStyle {
  icon: string;
  change: string;
  line: string;
}

const toneClasses: Record<StatTone, ToneStyle> = {
  positive: {
    icon: "bg-[#e5f9dd] text-[#07513b]",
    change: "bg-[#d9f6e5] text-[#047348]",
    line: "text-[#67c74a]",
  },
  danger: {
    icon: "bg-[#ffe6e6] text-[#e54848]",
    change: "bg-[#ffe3e3] text-[#d53333]",
    line: "text-[#e54848]",
  },
  neutral: {
    icon: "bg-[#eef2f3] text-[#607079]",
    change: "bg-[#e9eef0] text-[#6b7c83]",
    line: "text-[#607079]",
  },
  info: {
    icon: "bg-[#e8f1ff] text-[#2674cf]",
    change: "bg-[#e8f1ff] text-[#2674cf]",
    line: "text-[#2674cf]",
  },
};

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change: string;
  tone?: StatTone;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
  tone = "positive",
}: StatCardProps) {
  const style = toneClasses[tone] || toneClasses.positive;

  return (
    <div className="rounded-[18px] border border-[#dce8df] bg-white/95 p-4 shadow-[0_12px_30px_rgba(11,68,45,0.06)]">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div
          className={[
            "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
            style.icon,
          ].join(" ")}
        >
          <Icon size={20} />
        </div>

        <svg
          className={["mt-1 w-[72px] opacity-95", style.line].join(" ")}
          viewBox="0 0 120 36"
        >
          <polyline
            points="0,28 10,25 20,27 30,20 40,23 50,16 60,18 70,11 82,17 94,7 106,13 120,10"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
      </div>

      <p className="m-0 mb-1 text-[13px] font-bold text-[#6d7e75]">{label}</p>

      <h3 className="m-0 text-[26px] font-black leading-tight text-[#10231c]">
        {value}
      </h3>

      <span
        className={[
          "mt-2.5 inline-flex h-6 items-center rounded-full px-2.5 text-xs font-black",
          style.change,
        ].join(" ")}
      >
        {change}
      </span>
    </div>
  );
}
