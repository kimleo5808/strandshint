import type { WordlePuzzle } from '@/types/wordle-hint'
import dayjs from 'dayjs'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface WordlePuzzleCardProps {
  puzzle: WordlePuzzle
  isLatest?: boolean
  showAnswer?: boolean
}

export function WordlePuzzleCard({ puzzle, isLatest, showAnswer }: WordlePuzzleCardProps) {
  const formattedDate = dayjs(puzzle.printDate).format('MMMM D, YYYY')

  return (
    <Link
      href={`/wordle-hint/${puzzle.printDate}`}
      className="group block rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-400/40 hover:shadow-md"
    >
      <div className="flex items-center gap-2">
        <span className="inline-block rounded-md bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
          Wordle #{puzzle.id}
        </span>
        {isLatest && (
          <span className="inline-block rounded-md bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">
            Latest
          </span>
        )}
      </div>

      <div className="mt-3">
        {showAnswer ? (
          <div className="flex gap-1.5">
            {puzzle.answer.split('').map((letter, i) => (
              <div
                key={i}
                className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-500 text-sm font-bold text-white"
              >
                {letter}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-1.5">
            {puzzle.answer.split('').map((_, i) => (
              <div
                key={i}
                className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-muted bg-muted/30 text-sm font-bold text-muted-foreground"
              >
                ?
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
          View Hints
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

export function WordlePuzzleCardCompact({ puzzle }: { puzzle: WordlePuzzle }) {
  return (
    <Link
      href={`/wordle-hint/${puzzle.printDate}`}
      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-emerald-50"
    >
      <div className="flex gap-0.5">
        {puzzle.answer.split('').map((_, i) => (
          <span key={i} className="h-2 w-2 rounded-sm bg-emerald-500" />
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          #{puzzle.id} — {dayjs(puzzle.printDate).format('MMM D')}
        </p>
      </div>
      <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-600" />
    </Link>
  )
}
