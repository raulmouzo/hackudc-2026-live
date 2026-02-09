import { Link } from 'react-router'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Calendar, Trophy, Users } from 'lucide-react'
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

const DISCORD_URL = 'https://discord.gg/catyMZrF'
const SOCIAL_MASTODON = 'https://mastodon.social/@gpul_'
const SOCIAL_BSKY = 'https://bsky.app/profile/gpul.org'
const SOCIAL_LINKEDIN = 'https://www.linkedin.com/company/gpul'
const SOCIAL_X = 'https://x.com/gpul_'

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
            discord.gg/catyMZrF
          </a>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase text-slate-500">Social</span>
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={SOCIAL_MASTODON}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-300 transition-colors"
              aria-label="Mastodon"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 640 640" aria-hidden>
                <path d="m 619.10911,209.93288 c 0,-139.109896 -91.16564,-179.898291 -91.16564,-179.898291 -89.44824,-41.07463 -327.16587,-40.645279 -415.7554,0 0,0 -91.165647,40.788395 -91.165647,179.898291 0,165.58658 -9.445734,371.24596 151.131737,413.75176 57.96246,15.31354 107.76724,18.60523 147.84005,16.31536 72.70352,-4.00728 113.49192,-25.90421 113.49192,-25.90421 l -2.43299,-52.81024 c 0,0 -51.95154,16.31536 -110.34335,14.45484 -57.81934,-2.00364 -118.78725,-6.29716 -128.23299,-77.28328 -0.8587,-6.58339 -1.28805,-13.3099 -1.28805,-19.89329 122.5083,29.91149 227.12696,13.02367 255.75039,9.58885 80.28874,-9.58885 150.27304,-59.10739 159.14631,-104.33242 14.02548,-71.27235 12.88054,-173.88737 12.88054,-173.88737 z m -107.481,179.18271 H 444.9355 V 225.67577 c 0,-71.12924 -91.59499,-73.84846 -91.59499,9.87509 v 89.44823 h -66.26325 v -89.44823 c 0,-83.72355 -91.595,-81.00433 -91.595,-9.87509 v 163.43982 h -66.83572 c 0,-174.74608 -7.44209,-211.67031 26.33356,-250.45506 37.06735,-41.360868 114.20751,-44.080094 148.55563,8.73014 l 16.60159,27.90785 16.6016,-27.90785 c 34.49124,-53.096469 111.77451,-49.804774 148.55563,-8.73014 33.91877,39.07099 26.33356,75.8521 26.33356,250.45506 z" />
              </svg>
            </a>
            <a
              href={SOCIAL_BSKY}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-300 transition-colors"
              aria-label="Bluesky"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 600 530" aria-hidden>
                <path d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z" />
              </svg>
            </a>
            <a
              href={SOCIAL_LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-300 transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href={SOCIAL_X}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-300 transition-colors"
              aria-label="X (Twitter)"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
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
        <Link
          to="/mentors"
          className="rounded-xl border border-neutral-700 bg-neutral-900/80 p-6 md:p-8 flex flex-col items-center justify-center gap-2 hover:border-neutral-600 transition-colors"
        >
          <Users className="w-7 h-7 md:w-8 md:h-8 text-slate-300" />
          <span className="text-lg md:text-xl font-semibold text-slate-100">Mentors</span>
          <span className="text-sm text-slate-500">Get help from experts</span>
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
