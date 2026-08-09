// Two-option sliding pill toggle — an animated highlight (not the option
// text) slides between positions on click, matching the referenced
// "swipe"-style green button aesthetic without an actual drag gesture,
// which would be an unusual interaction for switching a chart's display mode.
// Shared by Sentiment Analysis's "Sentiment Over Time" chart and Dashboard's
// "Sentiment Trend" chart.
export function ModeToggle({
  value,
  onChange,
}: {
  value: "percentage" | "total";
  onChange: (value: "percentage" | "total") => void;
}) {
  return (
    <div className="relative inline-flex h-9 w-[178px] rounded-full bg-[#e1f8d9] p-1">
      <span
        className="absolute inset-y-1 w-[85px] rounded-full bg-[#07513b] transition-transform duration-200 ease-out"
        style={{
          transform: value === "percentage" ? "translateX(0)" : "translateX(85px)",
        }}
      />
      <button
        type="button"
        onClick={() => onChange("percentage")}
        className={`relative z-10 flex-1 rounded-full text-xs font-black transition-colors ${
          value === "percentage" ? "text-white" : "text-[#07513b]"
        }`}
      >
        %
      </button>
      <button
        type="button"
        onClick={() => onChange("total")}
        className={`relative z-10 flex-1 rounded-full text-xs font-black transition-colors ${
          value === "total" ? "text-white" : "text-[#07513b]"
        }`}
      >
        Total
      </button>
    </div>
  );
}
