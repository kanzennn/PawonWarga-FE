interface LoadingStateProps {
  message?: string;
}

// Generic skeletal shimmer used anywhere a page-specific skeleton isn't
// worth building (settings panels, report modals, etc). Pages whose layout
// is stable and worth mirroring exactly — e.g. the dashboard grid — should
// build their own skeleton next to the page instead of stretching this one
// to fit every shape.
export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className="rounded-[22px] border border-[#dce8df] bg-[#fbfdf8] p-6"
    >
      {message && <span className="sr-only">{message}</span>}

      <div className="grid gap-3">
        <SkeletonBlock className="h-4 w-1/3 rounded-full" />
        <SkeletonBlock className="h-24 w-full rounded-xl" />
        <SkeletonBlock className="h-4 w-2/3 rounded-full" />
        <SkeletonBlock className="h-4 w-1/2 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={["relative overflow-hidden bg-[#eef3ec]", className].join(
        " ",
      )}
    >
      <div className="animate-shimmer absolute inset-0" />
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-[22px] border border-[#f2cccc] bg-[#fff6f6] p-8 text-center">
      <b className="text-[#d63838]">Failed to load data</b>
      <p className="m-0 mt-2 text-sm leading-6 text-[#6d7e75]">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 h-10 rounded-xl bg-[#052d22] px-5 font-black text-white transition-all duration-200 hover:bg-[#07513b] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#07513b] focus-visible:ring-offset-2"
        >
          Try again
        </button>
      )}
    </div>
  );
}
