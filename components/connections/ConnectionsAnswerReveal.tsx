'use client'

import type { ConnectionsPuzzle } from '@/types/connections'
import { DIFFICULTY_COLORS } from '@/types/connections'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface ConnectionsAnswerRevealProps {
  puzzle: ConnectionsPuzzle
}

export function ConnectionsAnswerReveal({ puzzle }: ConnectionsAnswerRevealProps) {
  const sorted = [...puzzle.categories].sort((a, b) => a.difficulty - b.difficulty)

  return (
    <div className="space-y-3">
      {sorted.map((cat, i) => (
        <CategoryRevealCard key={i} category={cat} index={i} />
      ))}
    </div>
  )
}

function CategoryRevealCard({
  category,
  index,
}: {
  category: ConnectionsPuzzle['categories'][number]
  index: number
}) {
  const [showWords, setShowWords] = useState(false)
  const colors = DIFFICULTY_COLORS[category.difficulty]
  const words = category.cards.map((c) => c.content)

  return (
    <div className={`rounded-lg border-2 ${colors.border} overflow-hidden`}>
      <button
        onClick={() => setShowWords(!showWords)}
        className={`flex w-full items-center justify-between px-4 py-3 ${showWords ? colors.bg : 'bg-card'} transition-colors`}
      >
        <div className="flex items-center gap-3">
          <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${colors.badge}`}>
            {colors.label}
          </span>
          <span className={`font-semibold text-sm ${showWords ? 'text-white' : 'text-foreground'}`}>
            {category.title}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${showWords ? 'rotate-180 text-white' : 'text-muted-foreground'}`}
        />
      </button>
      {showWords && (
        <div className="px-4 py-3 flex flex-wrap gap-2 border-t border-current/10 bg-card">
          {words.map((word) => (
            <span
              key={word}
              className={`rounded-md px-3 py-1.5 text-sm font-bold uppercase tracking-wide ${colors.badge}`}
            >
              {word}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
