import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        className="w-full max-w-xl rounded-[24px] border border-[#dce8df] bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="m-0 text-xl font-black text-[#10231c]">{title}</h2>
          <button
            className="grid h-10 w-10 place-items-center rounded-xl bg-[#f3f8ee] text-[#10231c] hover:bg-[#e1f8d9]"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
