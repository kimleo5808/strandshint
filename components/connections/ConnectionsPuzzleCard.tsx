import type { ConnectionsPuzzle } from '@/types/connections'
import { DIFFICULTY_COLORS } from '@/types/connections'
import dayjs from 'dayjs'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface ConnectionsPuzzleCardProps {
  puzzle: ConnectionsPuzzle
  isLatest?: boolean
}

export function ConnectionsPuzzleCard({ puzzle, isLatest }: ConnectionsPuzzleCardProps) {
  const formattedDate = dayjs(puzzle.printDate).format('MMMM D, YYYY')
  const sorted = [...puzzle.categories].sort((a, b) => a.difficulty - b.difficulty)

  return (
    <Link
      href={`/connections-hint/${puzzle.printDate}`}
      className="group block rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-purple-400/40 hover:shadow-md"
    >
      <div className="flex items-center gap-2">
        <span className="inline-block rounded-md bg-purple-600 px-3 py-1 text-xs font-bold text-white">
          Puzzle #{puzzle.id}
        </span>
        {isLatest && (
          <span className="inline-block rounded-md bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white">
            Latest
          </span>
        )}
      </div>

      <div className="mt-3 flex gap-1">
        {sorted.map((cat) => {
          const colors = DIFFICULTY_COLORS[cat.difficulty]
          return (
            <div
              key={cat.difficulty}
              className={`h-2 flex-1 rounded-sm ${colors.bg}`}
              title={`${colors.label}: ${cat.title}`}
            />
          )
        })}
      </div>

      <div className="mt-2 space-y-1">
        {sorted.slice(0, 2).map((cat) => {
          const colors = DIFFICULTY_COLORS[cat.difficulty]
          return (
            <p key={cat.difficulty} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className={`h-2 w-2 rounded-full ${colors.bg}`} />
              <span className="truncate">{cat.title}</span>
            </p>
          )
        })}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{formattedDate}</span>
        <span className="flex items-center gap-1 text-xs font-medium text-purple-600">
          View Hints
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

export function ConnectionsPuzzleCardCompact({ puzzle }: { puzzle: ConnectionsPuzzle }) {
  return (
    <Link
      href={`/connections-hint/${puzzle.printDate}`}
      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-purple-50"
    >
      <div className="flex gap-0.5">
        {[0, 1, 2, 3].map((d) => {
          const colors = DIFFICULTY_COLORS[d as 0 | 1 | 2 | 3]
          return <span key={d} className={`h-2 w-2 rounded-full ${colors.bg}`} />
        })}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          #{puzzle.id} — {dayjs(puzzle.printDate).format('MMM D')}
        </p>
      </div>
      <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-purple-600" />
    </Link>
  )
}
