import type React from 'react'
import { useEffect, useState } from 'react'

export type SponsorLevel = 'root' | 'admin' | 'user' | 'collaborator'

export interface Sponsor {
  id: number
  name: string
  level: SponsorLevel
  link: string
  logo: string
}

export interface ScheduleItem {
  id: number
  title: string
  start: string
  end: string
  location: string
  tags: string[]
  description?: string
}

export interface WifiInfo {
  id: number
  ssid: string
  password: string
}

export interface HackingTime {
  id: number
  start: string
  end: string
}

export interface AnnouncementInfo {
  id: number
  content?: string
  visible: boolean
}

export interface Challenge {
  id: number
  title: string
  description: string
  criteria: string
  sponsor: Sponsor
  prize: string
  prize_url: string
}

export type ScheduleItemStatus = 'past' | 'live' | 'upcoming'

export interface TimedScheduleItem extends ScheduleItem {
  startDate: Date
  endDate: Date
  status: ScheduleItemStatus
}

const DIRECTUS_URL = import.meta.env.VITE_DIRECTUS_URL ?? ''

export function getAssetUrl(id?: string | null): string {
  if (!id) return ''
  try {
    const url = new URL(`/assets/${id}`, DIRECTUS_URL)
    return url.toString()
  } catch {
    return `${DIRECTUS_URL.replace(/\/$/, '')}/assets/${id}`
  }
}

export function useNow(tickMs: number): Date | null {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const interval = setInterval(() => {
      setNow(new Date())
    }, tickMs)
    return () => clearInterval(interval)
  }, [tickMs])

  return now
}

export function formatClockTime(date: Date | null): string {
  if (!date) return '--:--'
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

export function formatCountdown(hacking: HackingTime | null, now: Date | null): string {
  if (!hacking || !now) return '--:--:--'

  const start = new Date(hacking.start)
  const end = new Date(hacking.end)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return '--:--:--'
  }

  if (now < start) {
    return '36:00:00'
  }

  if (now >= end) {
    return '00:00:00'
  }

  const diffMs = end.getTime() - now.getTime()
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const hh = String(hours).padStart(2, '0')
  const mm = String(minutes).padStart(2, '0')
  const ss = String(seconds).padStart(2, '0')

  return `${hh}:${mm}:${ss}`
}

export function buildTimedSchedule(schedule: ScheduleItem[], now: Date | null): TimedScheduleItem[] {
  return schedule
    .map((item) => {
      const startDate = new Date(item.start)
      const endDate = new Date(item.end)
      let status: ScheduleItemStatus = 'upcoming'

      if (now) {
        if (now >= endDate) status = 'past'
        else if (now >= startDate && now < endDate) status = 'live'
        else status = 'upcoming'
      }

      return { ...item, startDate, endDate, status }
    })
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
}

export const markdownComponents: Record<
  string,
  (props: Record<string, unknown> & { children?: React.ReactNode }) => React.ReactElement
> = {
  ul: (props) => <ul className="list-disc list-inside space-y-1" {...props} />,
  ol: (props) => <ol className="list-decimal list-inside space-y-1" {...props} />,
  li: (props) => <li className="ml-0" {...props} />,
  p: (props) => <p className="mb-1 last:mb-0" {...props} />,
  a: (props) => (
    <a
      {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      className="text-amber-200 underline hover:text-amber-100"
      target="_blank"
      rel="noreferrer"
    />
  )
}
