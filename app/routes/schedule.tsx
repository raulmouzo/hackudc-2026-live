import { Link } from 'react-router'
import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Clock, MapPin, Tag } from 'lucide-react'
import { readItems, readSingleton } from '@directus/sdk'
import directus from '../lib/directus'
import {
  useNow,
  formatClockTime,
  buildTimedSchedule,
  markdownComponents,
  type ScheduleItem,
  type HackingTime,
  type TimedScheduleItem
} from '../lib/hackathon'

interface ScheduleData {
  schedule: ScheduleItem[]
  hacking: HackingTime | null
}

async function fetchScheduleData(): Promise<ScheduleData> {
  const [schedule, hacking] = await Promise.all([
    directus.request<ScheduleItem[]>(readItems('schedule', { sort: ['start'] })).catch(() => []),
    directus.request<HackingTime | null>(readSingleton('hackingtime')).catch(() => null)
  ])
  return {
    schedule: schedule ?? [],
    hacking: hacking ?? null
  }
}

function Header({ now }: { now: Date | null }) {
  return (
    <header className="flex items-center justify-between h-14 px-4 md:px-12 border-b border-neutral-800/80">
      <Link to="/" className="flex items-center">
        <img src="/images/logo.svg" alt="HackUDC" className="h-8 md:h-9 w-auto object-contain" />
      </Link>
      <span className="text-lg md:text-2xl text-slate-400 tabular-nums">{formatClockTime(now)}</span>
    </header>
  )
}

function ScheduleDescription({ markdown, className }: { markdown: string; className: string }) {
  return (
    <div className={className}>
      <ReactMarkdown components={markdownComponents}>{markdown}</ReactMarkdown>
    </div>
  )
}

function ScheduleCard({ item, isActive }: { item: TimedScheduleItem; isActive: boolean }) {
  const startLabel = item.startDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
  const endLabel = item.endDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  const durationMs = item.endDate.getTime() - item.startDate.getTime()
  const durationMinutes = Math.max(0, Math.round(durationMs / 60000))
  const durationHours = Math.floor(durationMinutes / 60)
  const durationRemainderMinutes = durationMinutes % 60
  const durationLabel =
    durationHours > 0
      ? durationRemainderMinutes === 0
        ? `${durationHours}h`
        : `${durationHours}h ${durationRemainderMinutes}m`
      : `${durationMinutes}m`

  let textClasses = 'text-slate-400'
  let titleClasses = 'text-lg md:text-xl font-semibold'
  let timeClasses = 'text-sm font-medium'
  let statusLabel: string | null = null
  let borderClasses = 'border-neutral-800'
  let liveAccentDot = false

  if (item.status === 'live') {
    textClasses = 'text-amber-100'
    titleClasses = 'text-xl md:text-2xl font-semibold text-slate-50'
    timeClasses = 'text-base font-medium text-amber-200'
    statusLabel = 'LIVE NOW'
    borderClasses = 'border-amber-400/80 shadow-[0_0_24px_rgba(250,204,21,0.25)]'
    liveAccentDot = true
  } else if (item.status === 'past') {
    textClasses = 'text-slate-500'
    titleClasses = 'text-lg md:text-xl font-semibold text-slate-500'
    timeClasses = 'text-sm font-medium text-slate-500'
  } else {
    textClasses = 'text-slate-400'
    titleClasses = 'text-lg md:text-xl font-semibold text-slate-50'
    timeClasses = 'text-sm font-medium text-slate-400'
  }

  let relativeTimeLabel: string | null = null
  if (item.status === 'upcoming') {
    const now = new Date()
    const diffMs = item.startDate.getTime() - now.getTime()
    const diffMinutes = Math.round(diffMs / 60000)
    if (diffMinutes > 0) {
      if (diffMinutes < 60) {
        relativeTimeLabel = `Starts in ${diffMinutes} min`
      } else {
        const hours = Math.floor(diffMinutes / 60)
        const minutes = diffMinutes % 60
        relativeTimeLabel = minutes === 0 ? `Starts in ${hours}h` : `Starts in ${hours}h ${minutes}m`
      }
    }
  }

  return (
    <article
      className={`rounded-xl border bg-black/80 px-4 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:gap-6 gap-3 ${borderClasses} ${isActive ? 'shadow-[0_0_30px_rgba(0,0,0,0.4)]' : ''}`}
    >
      <div className="md:w-40 flex flex-col gap-1 border-b border-neutral-800 md:border-b-0 md:border-r md:pr-4 md:pb-0 pb-2 text-xs text-slate-400 shrink-0">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <span className="tabular-nums">{startLabel}</span>
            <span className="tabular-nums text-slate-500">{durationLabel}</span>
          </span>
          <span className="tabular-nums text-slate-500">→ {endLabel}</span>
        </div>
        <div className="flex flex-col gap-0.5 text-[11px]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-slate-600 shrink-0" />
            <span className="truncate max-w-[200px] md:max-w-36">{item.location}</span>
          </span>
          {relativeTimeLabel ? <span>{relativeTimeLabel}</span> : null}
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className={titleClasses}>{item.title}</h3>
          {item.tags && item.tags.length ? (
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <Tag className="h-3 w-3 text-slate-600 shrink-0" />
              <span>{item.tags.join(' · ')}</span>
            </div>
          ) : null}
        </div>
        {item.description ? <ScheduleDescription markdown={item.description} className={textClasses} /> : null}
        <div className="mt-1 flex items-center justify-end gap-3 text-xs text-slate-500">
          {statusLabel ? (
            <span className="inline-flex items-center gap-2 text-[11px] font-bold text-amber-300 shrink-0">
              {liveAccentDot ? (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(250,204,21,0.9)] animate-pulse" />
              ) : null}
              <span>{statusLabel}</span>
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default function Schedule() {
  const [data, setData] = useState<ScheduleData>({ schedule: [], hacking: null })
  const [isLoading, setIsLoading] = useState(true)
  const now = useNow(1000)
  const timedSchedule = useMemo(() => buildTimedSchedule(data.schedule, now), [data.schedule, now])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const next = await fetchScheduleData()
        if (!cancelled) {
          setData(next)
          setIsLoading(false)
        }
      } catch (e) {
        console.error('Failed to load schedule', e)
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
      <main className="flex-1 px-4 md:px-12 py-6 md:py-8 max-w-4xl mx-auto w-full">
        <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 mb-4">Schedule</h2>
        <div className="space-y-3">
          {timedSchedule.map((item) => (
            <ScheduleCard key={item.id} item={item} isActive={item.status === 'live'} />
          ))}
        </div>
        {timedSchedule.length === 0 && !isLoading ? (
          <p className="text-slate-500 py-8">No schedule items yet.</p>
        ) : null}
      </main>
      {isLoading ? (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 text-xs text-slate-500 pointer-events-none">Loading…</div>
      ) : null}
    </div>
  )
}
