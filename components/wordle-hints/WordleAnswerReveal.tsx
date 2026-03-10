'use client'

import type { WordlePuzzle } from '@/types/wordle-hint'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface WordleAnswerRevealProps {
  puzzle: WordlePuzzle
}

export function WordleAnswerReveal({ puzzle }: WordleAnswerRevealProps) {
  const [revealed, setRevealed] = useState(false)
  const word = puzzle.answer.toUpperCase()

  return (
    <div className="rounded-xl border-2 border-emerald-200 bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <span className="font-semibold text-sm text-foreground">Today&apos;s Answer</span>
        <button
          onClick={() => setRevealed(!revealed)}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
        >
          {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {revealed ? 'Hide Answer' : 'Reveal Answer'}
        </button>
      </div>

      <div className="px-5 py-6 flex justify-center">
        {revealed ? (
          <div className="flex gap-2">
            {word.split('').map((letter, i) => (
              <div
                key={i}
                className="flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-500 text-2xl font-bold text-white shadow-sm"
              >
                {letter}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-2">
            {word.split('').map((_, i) => (
              <div
                key={i}
                className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-muted bg-muted/30 text-2xl font-bold text-transparent select-none"
              >
                ?
              </div>
            ))}
          </div>
        )}
      </div>

      {revealed && (
        <div className="px-5 pb-5 text-center">
          <p className="text-sm text-muted-foreground">
            The answer is{' '}
            <span className="font-bold text-emerald-700">{word}</span> — a{' '}
            {word.length}-letter English word.
          </p>
        </div>
      )}
    </div>
  )
}
