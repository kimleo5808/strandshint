import { ChevronUp } from 'lucide-react'

interface Rung {
  label: string
  dot: string
  bar: string
  descriptor: string
}

// Ordered easiest → hardest (display is reversed so purple sits on top).
const RUNGS: Rung[] = [
  { label: 'Yellow', dot: 'bg-yellow-400', bar: 'w-1/4', descriptor: 'Easiest — a plain, obvious shared meaning.' },
  { label: 'Green', dot: 'bg-green-500', bar: 'w-2/4', descriptor: 'Easy — a clear category with a small twist.' },
  { label: 'Blue', dot: 'bg-blue-500', bar: 'w-3/4', descriptor: 'Hard — a more specific or less common link.' },
  { label: 'Purple', dot: 'bg-purple-600', bar: 'w-full', descriptor: 'Hardest — usually wordplay or a deliberately loose connection.' },
]

/**
 * The Connections difficulty ladder. A compact visual that anchors purple as
 * the top rung. Pure server component — no interactivity.
 */
export function DifficultyLadder() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
        <ChevronUp className="h-4 w-4 text-purple-600" />
        Difficulty climbs Yellow → Green → Blue → Purple
      </div>
      <ol className="space-y-2.5">
        {[...RUNGS].reverse().map((rung) => (
          <li key={rung.label} className="flex items-center gap-3">
            <div className="flex w-20 shrink-0 items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${rung.dot}`} />
              <span className="text-xs font-bold text-foreground">{rung.label}</span>
            </div>
            <div className="hidden h-2 flex-1 overflow-hidden rounded-full bg-muted/40 sm:block">
              <div className={`h-full rounded-full ${rung.dot} ${rung.bar}`} />
            </div>
            <p className="flex-1 text-xs text-muted-foreground sm:flex-[2]">
              {rung.descriptor}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
        The color is only revealed <em>after</em> you solve a group — difficulty is
        assigned by the editors, not by how rare the words are.
      </p>
    </div>
  )
}
