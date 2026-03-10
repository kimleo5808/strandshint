import type { ConnectionsPuzzle } from '@/types/connections'
import { DIFFICULTY_COLORS } from '@/types/connections'

interface ConnectionsGridProps {
  puzzle: ConnectionsPuzzle
}

/** Static 4×4 grid showing the solved Connections puzzle */
export function ConnectionsGrid({ puzzle }: ConnectionsGridProps) {
  const sorted = [...puzzle.categories].sort((a, b) => a.difficulty - b.difficulty)

  return (
    <div className="w-full space-y-2">
      {sorted.map((cat, i) => {
        const colors = DIFFICULTY_COLORS[cat.difficulty]
        const words = cat.cards.map((c) => c.content)

        return (
          <div key={i} className={`rounded-lg ${colors.bg} p-3`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${colors.text}`}>
              {colors.label} — {cat.title}
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {words.map((word) => (
                <div
                  key={word}
                  className="rounded-md bg-white/20 px-2 py-1.5 text-center"
                >
                  <span className={`text-xs font-bold uppercase tracking-wide ${colors.text}`}>
                    {word}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
