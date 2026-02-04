import { useSyncExternalStore } from "react";

// Snapshot must be stable between subscription ticks so React doesn't loop (useSyncExternalStore uses Object.is).
let currentSeconds = Math.floor(Date.now() / 1000);

function subscribe(cb: () => void) {
  const id = setInterval(() => {
    currentSeconds = Math.floor(Date.now() / 1000);
    cb();
  }, 1000);
  return () => clearInterval(id);
}

function getSnapshot() {
  return currentSeconds;
}

function getServerSnapshot() {
  return Math.floor(Date.now() / 1000);
}

function formatTime(secondsSinceEpoch: number) {
  return new Date(secondsSinceEpoch * 1000).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function Clock() {
  const seconds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <div className="flex flex-col items-end gap-1">
      <span
        className="font-mono text-[32px] font-bold tracking-[0.06em] text-[#F5F7FF]"
        style={{ fontFamily: "Space Mono, monospace" }}
      >
        {formatTime(seconds)}
      </span>
      <span className="text-xs font-semibold tracking-[0.15em] text-[#8F96B2]">
        CURRENT TIME
      </span>
    </div>
  );
}
