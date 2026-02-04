import { useSyncExternalStore } from "react";

// Snapshot must be stable between subscription ticks to avoid infinite re-renders.
let currentNowMs = Date.now();

function subscribe(cb: () => void) {
  const id = setInterval(() => {
    currentNowMs = Date.now();
    cb();
  }, 1000);
  return () => clearInterval(id);
}

function getSnapshot() {
  return currentNowMs;
}

function getServerSnapshot() {
  return Date.now();
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  const h = Math.floor(ms / 3600000);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export function CountdownCard({ target }: { target: Date }) {
  const nowMs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const remaining = Math.max(0, target.getTime() - nowMs);
  const value = formatCountdown(remaining);

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 rounded-[32px] bg-[#050914F0] px-10 py-8 shadow-[0_0_45px_rgba(243,199,67,0.4)] backdrop-blur-[40px]">
      <span className="text-center text-sm font-semibold tracking-[0.2em] text-[#8F96B2]">
        TIME UNTIL SUBMISSION
      </span>
      <span
        className="text-center font-bold tracking-[0.06em] text-[#F3C743] drop-shadow-[0_0_36px_rgba(243,199,67,0.67)]"
        style={{
          fontFamily: "Space Mono, monospace",
          fontSize: "clamp(48px, 8vw, 96px)",
        }}
      >
        {value}
      </span>
      <span className="w-full text-center text-sm leading-snug text-[#8F96B2]">
        Submit on Devpost before the clock hits 00:00:00
      </span>
    </div>
  );
}
