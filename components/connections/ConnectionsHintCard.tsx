'use client'

import type { ConnectionsPuzzle } from '@/types/connections'
import { DIFFICULTY_COLORS } from '@/types/connections'
import { ChevronDown, Eye, Lightbulb } from 'lucide-react'
import { useState } from 'react'

interface ConnectionsHintCardProps {
  puzzle: ConnectionsPuzzle
}

export function ConnectionsHintCard({ puzzle }: ConnectionsHintCardProps) {
  const [expanded, setExpanded] = useState(true)
  const [revealLevel, setRevealLevel] = useState(0)

  const sorted = [...puzzle.categories].sort((a, b) => a.difficulty - b.difficulty)
  const firstTwo = sorted.slice(0, 2)

  const hints = [
    {
      label: 'Hint 1: Category Count',
      content: `Today's puzzle has 4 categories with 4 words each — 16 words total. Look for ${sorted[0].title.toLowerCase()} connections first.`,
    },
    {
      label: 'Hint 2: Easiest Category',
      content: `The easiest category (Yellow) is themed: "${sorted[0].title}". Think about which 4 words share this connection.`,
    },
    {
      label: `Hint 3: Two Category Themes`,
      content: `Two of today's categories are: "${firstTwo[0].title}" (Yellow) and "${firstTwo[1].title}" (Green). Can you sort the 16 words into these?`,
    },
    {
      label: 'Hint 4: All Category Themes',
      content: `All four categories: Yellow — "${sorted[0].title}", Green — "${sorted[1].title}", Blue — "${sorted[2].title}", Purple — "${sorted[3].title}".`,
    },
    {
      label: 'Hint 5: Full Answers',
      content: sorted
        .map(
          (cat) =>
            `${DIFFICULTY_COLORS[cat.difficulty].label}: "${cat.title}" → ${cat.cards.map((c) => c.content).join(', ')}`
        )
        .join(' | '),
    },
  ]

  return (
    <div className="rounded-xl border border-purple-200 bg-card overflow-hidden transition-shadow hover:shadow-md">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-purple-50/50"
      >
        <div className="flex items-center gap-3">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <span className="font-heading text-sm font-bold text-foreground">
            Progressive Hints
          </span>
          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
            {revealLevel}/{hints.length}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-border px-5 pb-5 pt-4 space-y-3">
          {hints.map((hint, i) => (
            <div key={i}>
              {i < revealLevel ? (
                <div className="flex items-start gap-2 rounded-lg bg-purple-50 px-3 py-2.5">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <div>
                    <p className="text-xs font-bold text-foreground mb-1">{hint.label}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{hint.content}</p>
                  </div>
                </div>
              ) : i === revealLevel ? (
                <button
                  onClick={() => setRevealLevel(revealLevel + 1)}
                  className="flex w-full items-center gap-2 rounded-lg border border-dashed border-purple-300 px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-purple-500 hover:text-purple-700"
                >
                  <Eye className="h-4 w-4" />
                  Reveal {hint.label}
                </button>
              ) : null}
            </div>
          ))}
          {revealLevel >= hints.length && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              All hints revealed! See the full answers below.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
