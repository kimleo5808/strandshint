'use client'

import type { PurpleArchetype } from '@/data/connections/purple-content'
import { archetypeFrequency } from '@/data/connections/purple-content'
import {
  ArrowLeftRight,
  Replace,
  Search,
  Shuffle,
  Sparkles,
  SquareDashedBottom,
  Volume2,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'

const ICONS: Record<string, LucideIcon> = {
  SquareDashedBottom,
  Search,
  Volume2,
  Shuffle,
  Replace,
  ArrowLeftRight,
  Sparkles,
}

interface PurpleArchetypeCardProps {
  archetype: PurpleArchetype
  /** 1-based index for the heading number */
  index: number
}

/**
 * A single archetype card. Front shows the definition, the four example words
 * as a mini-grid, and the trap. A button flips it to reveal how the words
 * resolve (progressive reveal — keyboard-operable, not hover-only).
 */
export function PurpleArchetypeCard({ archetype, index }: PurpleArchetypeCardProps) {
  const [revealed, setRevealed] = useState(false)
  const Icon = ICONS[archetype.icon] ?? Sparkles
  const { count, pct } = archetypeFrequency(archetype.key)
  const ex = archetype.example
  const headingId = `archetype-${archetype.key}`

  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 id={headingId} className="font-heading text-base font-bold text-foreground">
            {index}. {archetype.name}
          </h3>
          <p className="mt-0.5 font-mono text-xs text-purple-600">{archetype.pattern}</p>
        </div>
        <span
          className="ml-auto shrink-0 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700"
          title={`Appeared in ${count} of the analyzed purple groups`}
        >
          {pct}%
        </span>
      </div>

      {/* Definition */}
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {archetype.definition}
      </p>

      {/* Worked example */}
      <div className="mt-4 rounded-lg border border-purple-100 bg-purple-50/50 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-purple-700">
            {ex.categoryTitle}
          </span>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            #{ex.puzzleId} · {ex.date}
          </span>
        </div>

        {/* 4-chip mini-grid */}
        <div className="mt-2 grid grid-cols-2 gap-2">
          {ex.words.map((w) => (
            <span
              key={w}
              className="rounded-md bg-white px-2 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-foreground shadow-sm ring-1 ring-purple-100"
            >
              {w}
            </span>
          ))}
        </div>

        {/* Trap */}
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-amber-600">The trap: </span>
          {archetype.trap}
        </p>

        {/* Reveal */}
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          aria-expanded={revealed}
          aria-controls={`${headingId}-reveal`}
          className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-purple-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-purple-700"
        >
          {revealed ? 'Hide the answer' : 'Reveal how it works'}
          <span className={`transition-transform ${revealed ? 'rotate-180' : ''}`}>▾</span>
        </button>
        {revealed && (
          <p
            id={`${headingId}-reveal`}
            className="mt-2 rounded-md bg-white p-2.5 text-xs leading-relaxed text-foreground ring-1 ring-purple-100"
          >
            <span className="font-semibold text-purple-700">The reveal: </span>
            {archetype.reveal}
          </p>
        )}
      </div>
    </article>
  )
}
