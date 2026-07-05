import type { ReactNode } from "react";

interface CardProps {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, action, children, className = "" }: CardProps) {
  return (
    <section
      className={[
        "min-w-0 rounded-[22px] border border-[#dce8df] bg-white/90 shadow-[0_18px_50px_rgba(11,68,45,0.08)]",
        className || "p-5",
      ].join(" ")}
    >
      {(title || action) && (
        <div className="mb-5 flex min-w-0 items-start justify-between gap-3">
          {title && (
            <h3 className="m-0 min-w-0 flex-1 text-[20px] font-black leading-tight tracking-[-0.3px] text-[#10231c]">
              {title}
            </h3>
          )}

          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      {children}
    </section>
  );
}
