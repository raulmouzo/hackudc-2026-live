import { Link } from 'react-router'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { readItems } from '@directus/sdk'
import directus from '../lib/directus'
import type { Mentor } from '../lib/directus'
import { useNow, formatClockTime, markdownComponents } from '../lib/hackathon'

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

function DiscordCopy({ username }: { username: string }) {
  const [copied, setCopied] = useState(false)

  const handleClick = async () => {
    const value = username.startsWith('@') ? username : `@${username}`
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-slate-400 hover:text-slate-300 transition-colors text-sm font-medium cursor-pointer inline-flex items-center gap-1.5"
      title={copied ? 'Copied!' : 'Copy Discord handle'}
    >
      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
      </svg>
      {username.startsWith('@') ? username : `@${username}`}
      {copied ? <span className="text-emerald-400 text-xs font-semibold">Copied!</span> : null}
    </button>
  )
}

function MentorCard({ mentor }: { mentor: Mentor }) {
  return (
    <article className="rounded-xl border border-neutral-700 bg-neutral-900/80 p-5 md:p-7 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg md:text-xl font-semibold text-slate-100">{mentor.name}</h3>
        {mentor.subtitle ? <p className="text-sm md:text-base text-slate-400">{mentor.subtitle}</p> : null}
      </div>

      {mentor.discord ? (
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase text-slate-500">Discord</span>
          <DiscordCopy username={mentor.discord} />
        </div>
      ) : null}

      {mentor.description ? (
        <div className="text-slate-200 text-sm md:text-base prose prose-invert prose-sm max-w-none">
          <ReactMarkdown components={markdownComponents}>{mentor.description}</ReactMarkdown>
        </div>
      ) : null}
    </article>
  )
}

export default function Mentors() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const now = useNow(1000)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const list = await directus.request<Mentor[]>(readItems('mentors', { fields: ['*'] })).catch(() => [])
        if (!cancelled) {
          setMentors(Array.isArray(list) ? list : [])
          setIsLoading(false)
        }
      } catch (e) {
        console.error('Failed to load mentors', e)
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
        <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 mb-5">Mentors</h2>
        <div className="space-y-5 md:space-y-6">
          {mentors.map((m) => (
            <MentorCard key={m.id} mentor={m} />
          ))}
        </div>
        {mentors.length === 0 && !isLoading ? <p className="text-slate-500 py-8">No mentors yet.</p> : null}
      </main>
      {isLoading ? (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 text-xs text-slate-500 pointer-events-none">Loading…</div>
      ) : null}
    </div>
  )
}
