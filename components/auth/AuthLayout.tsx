import type { ReactNode } from "react";
import LogoMark from "@/components/ui/LogoMark";

interface AuthLayoutProps {
  heading: string;
  subtitle: ReactNode;
  children: ReactNode;
}

// Shared shell for /login and /register: a branding panel on the left
// (hidden below lg, since there's no room for it on mobile) and the actual
// form on the right. Deliberately dark on both sides — distinct from the
// light dashboard — reusing the app's existing dark-green/lime hero
// treatment (see Dashboard's "Public Sentiment Overview" card) rather than
// introducing a new color language just for auth.
export default function AuthLayout({ heading, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_82%_72%,rgba(123,214,88,0.24),transparent_35%),linear-gradient(135deg,#04392b,#05281f)] p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="relative z-10 flex items-center gap-3.5">
          <LogoMark />
          <div>
            <h2 className="m-0 text-xl font-black leading-none text-white">MBG</h2>
            <p className="m-0 mt-1 text-sm font-semibold leading-none text-[#d6ead0]">
              Insight AI
            </p>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="m-0 text-[40px] font-black leading-[1.05] tracking-[-1px] text-white">
            Dengarkan Suara Publik, <span className="text-[#b9fb7d]">Setiap Saat.</span>
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70">
            Pantau sentimen masyarakat terhadap program Makan Bergizi Gratis
            secara real-time dari berbagai platform sosial.
          </p>
        </div>

        <div className="absolute -bottom-24 -right-16 h-[260px] w-[260px] rounded-full border border-[#beff96]/20 before:absolute before:inset-8 before:rounded-full before:border before:border-[#beff96]/20 after:absolute after:inset-16 after:rounded-full after:border after:border-[#beff96]/20" />
      </div>

      <div className="flex items-center justify-center bg-[#0a1c15] px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3.5 lg:hidden">
            <LogoMark />
            <div>
              <h2 className="m-0 text-lg font-black leading-none text-white">MBG</h2>
              <p className="m-0 mt-1 text-xs font-semibold leading-none text-[#d6ead0]">
                Insight AI
              </p>
            </div>
          </div>

          <h1 className="m-0 text-3xl font-black tracking-[-0.5px] text-white">{heading}</h1>
          <p className="mt-2 text-sm font-medium text-white/60">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
