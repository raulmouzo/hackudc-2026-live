import { Link } from 'react-router'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Calendar, Trophy } from 'lucide-react'
import { readSingleton } from '@directus/sdk'
import directus from '../lib/directus'
import {
  useNow,
  formatClockTime,
  formatCountdown,
  markdownComponents,
  type WifiInfo,
  type HackingTime,
  type AnnouncementInfo
} from '../lib/hackathon'

interface IndexData {
  wifi: WifiInfo | null
  hacking: HackingTime | null
  announcement: AnnouncementInfo | null
}

async function fetchIndexData(): Promise<IndexData> {
  const [wifi, hacking, announcement] = await Promise.all([
    directus.request<WifiInfo | null>(readSingleton('wifi')).catch(() => null),
    directus.request<HackingTime | null>(readSingleton('hackingtime')).catch(() => null),
    directus.request<AnnouncementInfo | null>(readSingleton('announcement')).catch(() => null)
  ])
  return {
    wifi: wifi ?? null,
    hacking: hacking ?? null,
    announcement: announcement ?? null
  }
}

const DISCORD_URL = import.meta.env.VITE_DISCORD_URL ?? 'https://discord.gg/hackudc'
const VENUE_MAP_URL = import.meta.env.VITE_VENUE_MAP_URL ?? '#'
const SOCIAL_TWITTER = import.meta.env.VITE_SOCIAL_TWITTER ?? 'https://twitter.com/HackUDC'
const SOCIAL_INSTAGRAM = import.meta.env.VITE_SOCIAL_INSTAGRAM ?? 'https://instagram.com/HackUDC'
const SOCIAL_LINKEDIN = import.meta.env.VITE_SOCIAL_LINKEDIN ?? 'https://linkedin.com/company/hackudc'
const HASHTAG = import.meta.env.VITE_HASHTAG ?? '#HackUDC2026'

function Header({ now }: { now: Date | null }) {
  return (
    <header className="flex items-center justify-between h-14 px-6 md:px-12">
      <Link to="/" className="flex items-center">
        <img src="/images/logo.svg" alt="HackUDC" className="h-8 md:h-9 w-auto object-contain" />
      </Link>
      <span className="text-lg md:text-2xl text-slate-400 tabular-nums font-sans">{formatClockTime(now)}</span>
    </header>
  )
}

function CountdownSection({ hacking, now }: { hacking: HackingTime | null; now: Date | null }) {
  return (
    <section className="flex flex-col items-center justify-center gap-1 py-4 md:py-6">
      <p className="text-[10px] md:text-xs font-semibold text-slate-500 tracking-[0.2em] uppercase">HACKING ENDS IN</p>
      <p className="text-2xl md:text-4xl font-mono text-slate-200 tabular-nums">{formatCountdown(hacking, now)}</p>
    </section>
  )
}

function StayConnected({ wifi }: { wifi: WifiInfo | null }) {
  return (
    <section className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 md:p-8">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-6">Stay connected</h2>
      <div className="flex flex-wrap gap-10 md:gap-12">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase text-slate-500">Wi‑Fi</span>
          {wifi ? (
            <>
              <span className="text-base md:text-lg font-semibold text-slate-100">{wifi.ssid}</span>
              <span className="text-sm text-slate-400">Password: {wifi.password}</span>
            </>
          ) : (
            <span className="text-slate-500">—</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase text-slate-500">Discord</span>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noreferrer"
            className="text-base md:text-lg font-semibold text-indigo-400 hover:text-indigo-300"
          >
            discord.gg/hackudc
          </a>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase text-slate-500">Social</span>
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={SOCIAL_TWITTER}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-300"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href={SOCIAL_INSTAGRAM}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-300"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href={SOCIAL_LINKEDIN}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-300"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <span className="text-sm font-semibold text-slate-200">{HASHTAG}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase text-slate-500">Venue</span>
          <a
            href={VENUE_MAP_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm md:text-base font-medium text-indigo-400 hover:text-indigo-300"
          >
            View venue map
          </a>
        </div>
      </div>
    </section>
  )
}

function AnnouncementBanner({ announcement }: { announcement: AnnouncementInfo | null }) {
  if (!announcement || !announcement.visible || !announcement.content) return null
  return (
    <section className="rounded-xl border border-amber-500/80 bg-amber-950/40 px-5 py-4 shadow-[0_0_30px_rgba(250,204,21,0.15)]">
      <div className="flex items-center gap-3 mb-2">
        <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(250,204,21,0.9)]" />
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-300">Announcement</p>
      </div>
      <div className="text-amber-50 text-sm">
        <ReactMarkdown components={markdownComponents}>{announcement.content}</ReactMarkdown>
      </div>
    </section>
  )
}

function QuickLinks() {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">Quick links</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Link
          to="/schedule"
          className="rounded-xl border border-neutral-700 bg-neutral-900/80 p-6 md:p-8 flex flex-col items-center justify-center gap-2 hover:border-neutral-600 transition-colors"
        >
          <Calendar className="w-7 h-7 md:w-8 md:h-8 text-slate-300" />
          <span className="text-lg md:text-xl font-semibold text-slate-100">Schedule</span>
          <span className="text-sm text-slate-500">See the full agenda</span>
        </Link>
        <Link
          to="/challenges"
          className="rounded-xl border border-neutral-700 bg-neutral-900/80 p-6 md:p-8 flex flex-col items-center justify-center gap-2 hover:border-neutral-600 transition-colors"
        >
          <Trophy className="w-7 h-7 md:w-8 md:h-8 text-amber-400" />
          <span className="text-lg md:text-xl font-semibold text-amber-400">Challenges and Prizes</span>
          <span className="text-sm text-slate-500">Tracks and awards</span>
        </Link>
      </div>
    </section>
  )
}

export default function Index() {
  const [data, setData] = useState<IndexData>({
    wifi: null,
    hacking: null,
    announcement: null
  })
  const [isLoading, setIsLoading] = useState(true)
  const now = useNow(1000)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const next = await fetchIndexData()
        if (!cancelled) {
          setData(next)
          setIsLoading(false)
        }
      } catch (e) {
        console.error('Failed to load index data', e)
        if (!cancelled) setIsLoading(false)
      }
    }
    void load()
    const interval = setInterval(() => void load(), 5000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="min-h-screen text-slate-50 font-sans flex flex-col">
      <Header now={now} />
      <main className="flex-1 px-4 md:px-12 pb-12 md:pb-16 max-w-4xl mx-auto w-full space-y-8 md:space-y-10">
        <CountdownSection hacking={data.hacking} now={now} />
        <StayConnected wifi={data.wifi} />
        <AnnouncementBanner announcement={data.announcement} />
        <QuickLinks />
      </main>
      {isLoading ? (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 text-xs text-slate-500 pointer-events-none">Loading…</div>
      ) : null}
    </div>
  )
}
