/**
 * Static data for the TV signage page.
 * Replace with API/real data later.
 */

export interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  isNow?: boolean;
}

export interface SponsorTierItem {
  id: string;
  name: string;
}

export const SCHEDULE: ScheduleItem[] = [
  {
    id: "1",
    title: "Team Formation & Hacking Begins",
    time: "09:30 – 11:00",
    isNow: true,
  },
  {
    id: "2",
    title: "Workshop: Shipping a Winning Demo",
    time: "11:15 – 12:00",
  },
  {
    id: "3",
    title: "Mentor Rounds & Check-ins",
    time: "12:15 – 13:00",
  },
];

export const PLATINUM_SPONSORS: SponsorTierItem[] = [
  { id: "1", name: "ACME CLOUD" },
];

export const GOLD_SPONSORS: SponsorTierItem[] = [
  { id: "1", name: "NEURALWARE" },
  { id: "2", name: "BYTEBREW" },
];

export const USER_SPONSORS: SponsorTierItem[] = [
  { id: "1", name: "USER 1" },
];

export const COLLABORATOR_SPONSORS: SponsorTierItem[] = [
  { id: "1", name: "COLLABORATOR 1" },
];
/** Countdown target (submission deadline). Static for now. */
export const COUNTDOWN_TARGET = new Date(Date.now() + 12 * 60 * 60 * 1000);

/** Ticker at the bottom (Wi‑Fi). */
export const TICKER = {
  wifi: "Wi‑Fi: HackUDC  •  Password: hackthefuture",
};
