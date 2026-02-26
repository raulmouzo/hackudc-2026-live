import { Link } from 'react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { ChevronDown, Clock, Filter, MapPin, Tag } from 'lucide-react'
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

function formatRelativeStartsIn(startDate: Date, now: Date | null): string | null {
  if (!now) return null
  const diffMs = startDate.getTime() - now.getTime()
  const diffMinutes = Math.round(diffMs / 60000)
  if (diffMinutes <= 0) return null
  if (diffMinutes < 60) return `Starts in ${diffMinutes} min`
  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60
  return minutes === 0 ? `Starts in ${hours}h` : `Starts in ${hours}h ${minutes}m`
}

function statusBadge(status: TimedScheduleItem['status']) {
  if (status === 'live') {
    return {
      label: 'Live',
      classes: 'text-amber-200 bg-amber-500/15 border-amber-400/50'
    }
  }
  if (status === 'past') {
    return {
      label: 'Done',
      classes: 'text-slate-400 bg-slate-800/80 border-slate-700'
    }
  }
  return null
}

function ScheduleCard({ item, isActive, now }: { item: TimedScheduleItem; isActive: boolean; now: Date | null }) {
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

  const badge = statusBadge(item.status)

  let textClasses = 'text-slate-400'
  let titleClasses = 'text-lg md:text-xl font-semibold'
  let borderClasses = 'border-neutral-800'

  if (item.status === 'live') {
    textClasses = 'text-amber-100'
    titleClasses = 'text-xl md:text-2xl font-semibold text-slate-50'
    borderClasses = 'border-amber-400/70'
  } else if (item.status === 'past') {
    textClasses = 'text-slate-500'
    titleClasses = 'text-lg md:text-xl font-semibold text-slate-500'
  } else {
    textClasses = 'text-slate-400'
    titleClasses = 'text-lg md:text-xl font-semibold text-slate-50'
  }

  const relativeTimeLabel = item.status === 'upcoming' ? formatRelativeStartsIn(item.startDate, now) : null

  return (
    <article
      className={`rounded-xl border bg-neutral-900/80 px-4 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-stretch gap-4 md:gap-5 ${borderClasses} ${isActive ? 'bg-neutral-900' : ''}`}
    >
      <div className="w-full md:w-44 md:shrink-0 md:pr-5 border-b border-neutral-800 pb-2 md:border-b-0 md:border-r md:pb-0 text-xs text-slate-400 flex flex-col gap-1.5">
        <span className="inline-flex items-center gap-1.5 tabular-nums text-slate-300">
          <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          {startLabel} → {endLabel} <span className="ml-1 text-slate-500">({durationLabel})</span>
        </span>
        <span className="inline-flex items-center gap-1.5 min-w-0 text-slate-400">
          <MapPin className="h-3 w-3 text-slate-600 shrink-0" />
          <span className="truncate">{item.location}</span>
        </span>
        {relativeTimeLabel ? <span className="text-slate-500">{relativeTimeLabel}</span> : null}
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {badge ? (
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${badge.classes}`}
            >
              {badge.label}
            </span>
          ) : null}
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
          {item.status === 'live' ? (
            <span className="inline-flex items-center gap-2 text-[11px] font-bold text-amber-300 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span>LIVE NOW</span>
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
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement | null>(null)
  const now = useNow(1000)
  const timedSchedule = useMemo(() => buildTimedSchedule(data.schedule, now), [data.schedule, now])
  const availableTags = useMemo(() => {
    const tagMap = new Map<string, string>()
    for (const item of data.schedule) {
      for (const rawTag of item.tags ?? []) {
        const label = rawTag.trim()
        if (!label) continue
        const key = label.toLowerCase()
        if (!tagMap.has(key)) tagMap.set(key, label)
      }
    }
    return Array.from(tagMap.entries())
      .map(([key, label]) => ({ key, label }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [data.schedule])

  const filteredSchedule = useMemo(() => {
    if (selectedTag === 'all') return timedSchedule
    return timedSchedule.filter((item) => item.tags?.some((tag) => tag.trim().toLowerCase() === selectedTag))
  }, [selectedTag, timedSchedule])

  const scheduleByDay = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })

    const groups: Array<{ key: string; label: string; items: TimedScheduleItem[] }> = []
    for (const item of filteredSchedule) {
      const timestamp = item.startDate.getTime()
      const isValidDate = Number.isFinite(timestamp)
      const key = isValidDate
        ? `${item.startDate.getFullYear()}-${String(item.startDate.getMonth() + 1).padStart(2, '0')}-${String(item.startDate.getDate()).padStart(2, '0')}`
        : `unknown-${item.id}`
      const existing = groups.length > 0 ? groups[groups.length - 1] : null
      if (existing && existing.key === key) {
        existing.items.push(item)
        continue
      }

      const label = isValidDate ? formatter.format(item.startDate) : 'Unscheduled'
      groups.push({ key, label, items: [item] })
    }

    return groups
  }, [filteredSchedule])

  useEffect(() => {
    if (selectedTag === 'all') return
    const exists = availableTags.some((tag) => tag.key === selectedTag)
    if (!exists) setSelectedTag('all')
  }, [availableTags, selectedTag])

  useEffect(() => {
    if (!isFilterOpen) return
    const handlePointerDown = (event: MouseEvent) => {
      if (!filterRef.current) return
      if (event.target instanceof Node && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)
    return () => window.removeEventListener('mousedown', handlePointerDown)
  }, [isFilterOpen])

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
      <main className="flex-1 px-4 md:px-12 py-6 md:py-8 max-w-5xl mx-auto w-full">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Schedule</h2>
          {availableTags.length > 0 ? (
            <div ref={filterRef} className="relative">
              <button
                type="button"
                onClick={() => setIsFilterOpen((value) => !value)}
                className="inline-flex items-center gap-2 rounded-md border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300 hover:border-neutral-600"
                aria-expanded={isFilterOpen}
                aria-haspopup="menu"
              >
                <Filter className="h-3.5 w-3.5" />
                <span>
                  {selectedTag === 'all'
                    ? 'All tags'
                    : (availableTags.find((tag) => tag.key === selectedTag)?.label ?? 'All tags')}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              {isFilterOpen ? (
                <div className="absolute right-0 z-20 mt-2 min-w-44 overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900 shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTag('all')
                      setIsFilterOpen(false)
                    }}
                    className={`block w-full px-3 py-2 text-left text-xs font-medium uppercase tracking-[0.12em] ${selectedTag === 'all' ? 'bg-slate-800 text-slate-100' : 'text-slate-300 hover:bg-neutral-800'}`}
                  >
                    All tags
                  </button>
                  {availableTags.map((tag) => (
                    <button
                      key={tag.key}
                      type="button"
                      onClick={() => {
                        setSelectedTag(tag.key)
                        setIsFilterOpen(false)
                      }}
                      className={`block w-full px-3 py-2 text-left text-xs font-medium uppercase tracking-[0.12em] ${selectedTag === tag.key ? 'bg-indigo-500/20 text-indigo-100' : 'text-slate-300 hover:bg-neutral-800'}`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="space-y-6">
          {scheduleByDay.map((dayGroup) => (
            <section key={dayGroup.key} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {dayGroup.label}
                </span>
                <div className="h-px flex-1 bg-neutral-800" />
              </div>
              {dayGroup.items.map((item) => (
                <ScheduleCard key={item.id} item={item} isActive={item.status === 'live'} now={now} />
              ))}
            </section>
          ))}
        </div>
        {filteredSchedule.length === 0 && !isLoading ? (
          <p className="text-slate-500 py-8">
            {selectedTag === 'all' ? 'No schedule items yet.' : 'No schedule items for this tag.'}
          </p>
        ) : null}
      </main>
      {isLoading ? (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 text-xs text-slate-500 pointer-events-none">Loading…</div>
      ) : null}
    </div>
  )
}
