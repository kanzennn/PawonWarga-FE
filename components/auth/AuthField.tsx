import type { ReactNode } from "react";

interface AuthFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  rightSlot?: ReactNode;
}

export default function AuthField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  minLength,
  maxLength,
  rightSlot,
}: AuthFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-bold text-white/80">
      {label}
      <div className="relative">
        <input
          type={type}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-12 w-full rounded-2xl border border-white/10 bg-[#0f2a20] px-4 font-semibold text-white outline-none placeholder:text-white/35 focus:border-[#67c74a]"
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-3 flex items-center">{rightSlot}</div>
        )}
      </div>
    </label>
  );
}
