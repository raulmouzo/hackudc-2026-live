import type { ScheduleItem as ScheduleItemType } from "./data";

export function ScheduleItem({ item }: { item: ScheduleItemType }) {
  const isNow = item.isNow ?? false;

  return (
    <div
      className={`flex flex-col gap-1 rounded-2xl border px-4 py-3 ${
        isNow
          ? "border-[#F3C743] bg-[#070D1CE6] shadow-[0_0_24px_rgba(243,199,67,0.5)]"
          : "border-transparent bg-[#070D1CBA]"
      } ${isNow ? "rounded-[18px] px-[18px] py-4" : "rounded-[14px] px-4 py-3"}`}
    >
      {isNow && (
        <span className="text-[11px] font-bold tracking-[0.1em] text-[#F3C743]">
          NOW
        </span>
      )}
      <span
        className={`font-medium text-[#F5F7FF] ${isNow ? "text-lg" : "text-[15px]"}`}
      >
        {item.title}
      </span>
      <span
        className="text-[13px] font-medium text-[#8F96B2]"
        style={{ fontFamily: "Space Mono, monospace" }}
      >
        {item.time}
      </span>
    </div>
  );
}
