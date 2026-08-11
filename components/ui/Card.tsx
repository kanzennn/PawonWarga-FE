import type { ReactNode } from "react";

interface CardProps {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Card({
  title,
  action,
  children,
  className = "",
}: CardProps) {
  return (
    <section
      className={[
        "min-w-0 rounded-[18px] border border-[#dce8df] bg-white/95 shadow-[0_12px_30px_rgba(11,68,45,0.06)] transition-shadow duration-300 hover:shadow-[0_16px_36px_rgba(11,68,45,0.1)]",
        className || "p-5",
      ].join(" ")}
    >
      {(title || action) && (
        <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
          {title && (
            <h3 className="m-0 min-w-0 flex-1 text-[18px] font-black leading-tight text-[#10231c]">
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
