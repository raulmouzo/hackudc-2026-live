import type { SponsorTierItem } from "./data";

export function SponsorTier({
  label,
  sponsors,
  tier,
}: {
  label: string;
  sponsors: SponsorTierItem[];
  tier: "admin" | "root" | "user" | "collaborator";
}) {
  const isPlatinum = tier === "root";
  return (
    <div className="flex flex-col gap-3">
      <span
        className={`text-[11px] font-bold tracking-widest ${isPlatinum ? "text-[#F3C743]" : "text-[#8F96B2]"
          }`}
      >
        {label}
      </span>
      <div
        className={`flex flex-col ${isPlatinum ? "gap-3" : "gap-2.5"
          }`}
      >
        {sponsors.map((s) => (
          <div
            key={s.id}
            className={`flex items-center justify-center rounded-xl border border-[#2A3144] bg-[#101728] ${isPlatinum
              ? "h-[72px] rounded-[18px] shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              : "h-[60px] rounded-[14px] bg-[#0C1324]"
              }`}
          >
            <span
              className={`font-medium tracking-wide text-[#F5F7FF] ${isPlatinum ? "text-base font-semibold" : "text-sm"
                }`}
            >
              {s.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
