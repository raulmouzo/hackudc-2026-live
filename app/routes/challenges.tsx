import { Link } from 'react-router'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { readItems } from '@directus/sdk'
import directus from '../lib/directus'
import { useNow, formatClockTime, getAssetUrl, markdownComponents, type Challenge } from '../lib/hackathon'

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

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const sponsor = challenge.sponsor && typeof challenge.sponsor === 'object' ? challenge.sponsor : null
  const logoUrl = sponsor?.logo ? getAssetUrl(sponsor.logo) : null

  return (
    <article className="rounded-xl border border-neutral-700 bg-neutral-900/80 p-5 md:p-7 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4 md:gap-5">
        <div className="w-14 h-14 md:w-[72px] md:h-[72px] rounded-lg bg-neutral-800 flex items-center justify-center shrink-0 overflow-hidden">
          {logoUrl ? (
            <img src={logoUrl} alt={sponsor?.name ?? 'Sponsor'} className="w-full h-full object-contain p-1" />
          ) : (
            <span className="text-slate-600 text-xs font-medium">Logo</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg md:text-xl font-semibold text-slate-100">{challenge.title}</h3>
          {sponsor?.name ? <p className="text-sm md:text-base text-slate-400 mt-0.5">{sponsor.name}</p> : null}
        </div>
      </div>

      {challenge.description ? (
        <div className="text-slate-200 text-sm md:text-base prose prose-invert prose-sm max-w-none">
          <ReactMarkdown components={markdownComponents}>{challenge.description}</ReactMarkdown>
        </div>
      ) : null}

      {challenge.criteria ? (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Criteria</h4>
          <div className="text-slate-200 text-sm prose prose-invert prose-sm max-w-none">
            <ReactMarkdown components={markdownComponents}>{challenge.criteria}</ReactMarkdown>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <span className="text-xs font-semibold uppercase text-slate-500">Prize</span>
        <span className="text-base md:text-lg font-semibold text-amber-400">{challenge.prize}</span>
        {challenge.prize_url ? (
          <a
            href={challenge.prize_url}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
          >
            Details
          </a>
        ) : null}
      </div>
    </article>
  )
}

export default function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const now = useNow(1000)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const list = await directus
          .request<Challenge[]>(
            readItems('challenges', {
              fields: ['*', 'sponsor.*']
            })
          )
          .catch(() => [])
        if (!cancelled) {
          setChallenges(Array.isArray(list) ? list : [])
          setIsLoading(false)
        }
      } catch (e) {
        console.error('Failed to load challenges', e)
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
        <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 mb-5">Challenges and Prizes</h2>
        <div className="space-y-5 md:space-y-6">
          {challenges.map((c) => (
            <ChallengeCard key={c.id} challenge={c} />
          ))}
        </div>
        {challenges.length === 0 && !isLoading ? <p className="text-slate-500 py-8">No challenges yet.</p> : null}
      </main>
      {isLoading ? (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 text-xs text-slate-500 pointer-events-none">Loading…</div>
      ) : null}
    </div>
  )
}
