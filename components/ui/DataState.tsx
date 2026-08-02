interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Memuat data..." }: LoadingStateProps) {
  return (
    <div className="grid place-items-center rounded-[22px] border border-dashed border-[#cbdccd] bg-[#fbfdf8] p-10 text-center">
      <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#dce8df] border-t-[#07513b]" />
      <b className="mt-4 text-[#10231c]">{message}</b>
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
      <b className="text-[#d63838]">Gagal memuat data</b>
      <p className="m-0 mt-2 text-sm leading-6 text-[#6d7e75]">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 h-10 rounded-xl bg-[#052d22] px-5 font-black text-white"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}
