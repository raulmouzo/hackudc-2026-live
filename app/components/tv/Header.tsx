import { Clock } from "./Clock";

export function Header() {
  return (
    <header className="flex w-full items-center justify-between rounded-[20px] border border-[#0f1420] bg-[#060913E6] px-6 py-4 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
      <img
        src="/images/logo.png"
        alt="HackUDC"
        className="h-16 w-[360px] max-w-full object-contain object-center"
      />
      <Clock />
    </header>
  );
}
