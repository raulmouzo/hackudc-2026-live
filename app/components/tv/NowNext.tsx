import type { ScheduleItem } from "./data";
import { ScheduleItem as ScheduleItemComponent } from "./ScheduleItem";

export function NowNext({ schedule }: { schedule: ScheduleItem[] }) {
  return (
    <div className="flex flex-col gap-4 rounded-[24px] bg-[#050914E6] p-7 shadow-[0_0_32px_rgba(0,0,0,0.69)]">
      <h2 className="text-[13px] font-semibold tracking-[0.15em] text-[#8F96B2]">
        NOW & NEXT
      </h2>
      <div className="flex flex-col gap-2">
        {schedule.map((item) => (
          <ScheduleItemComponent key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
