import { CountdownCard } from "./CountdownCard";
import { Header } from "./Header";
import { NowNext } from "./NowNext";
import { SponsorGallery } from "./SponsorGallery";
import { BottomTicker } from "./BottomTicker";
import {
  SCHEDULE,
  PLATINUM_SPONSORS,
  GOLD_SPONSORS,
  COUNTDOWN_TARGET,
  TICKER,
  USER_SPONSORS,
  COLLABORATOR_SPONSORS,
} from "./data";

export function TvLayout() {
  return (
    <div className="relative flex min-h-screen w-full gap-8 overflow-hidden bg-[#05060A] p-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          backgroundImage: "url(/images/pattern.png)",
          backgroundSize: "304px 304px",
          backgroundRepeat: "repeat",
        }}
      />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col gap-8">
        <Header />
        <CountdownCard target={COUNTDOWN_TARGET} />
        <NowNext schedule={SCHEDULE} />
      </div>

      <aside className="relative z-10 flex w-[520px] shrink-0 flex-col gap-6">
        <SponsorGallery platinum={PLATINUM_SPONSORS} gold={GOLD_SPONSORS} user={USER_SPONSORS} collaborators={COLLABORATOR_SPONSORS} />
        <BottomTicker wifi={TICKER.wifi} />
      </aside>
    </div>
  );
}
