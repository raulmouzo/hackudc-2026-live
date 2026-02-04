export function BottomTicker({ wifi }: { wifi: string }) {
  return (
    <div
      className="flex h-20 items-center justify-center rounded-full px-8 py-3 shadow-[0_0_40px_rgba(243,199,67,0.5)]"
      style={{
        background:
          "linear-gradient(135deg, #F3C743 0%, #F7D161 50%, #FFE38A 100%)",
      }}
    >
      <span
        className="font-semibold text-[#2A1B00]"
        style={{ fontFamily: "Space Mono, monospace", fontSize: "1.5rem" }}
      >
        {wifi}
      </span>
    </div>
  );
}
