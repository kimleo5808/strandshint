import type { ConnectionsPuzzle } from '@/types/connections'
import { ConnectionsPuzzleCard } from './ConnectionsPuzzleCard'
import dayjs from 'dayjs'

interface ConnectionsMonthSectionProps {
  yearMonth: string
  puzzles: ConnectionsPuzzle[]
  latestId?: number
}

export function ConnectionsMonthSection({
  yearMonth,
  puzzles,
  latestId,
}: ConnectionsMonthSectionProps) {
  const label = dayjs(yearMonth + '-01').format('MMMM YYYY')

  return (
    <section id={yearMonth} className="scroll-mt-20">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="font-heading text-lg font-bold text-foreground">{label}</h2>
        <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
          {puzzles.length} puzzle{puzzles.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {puzzles.map((puzzle) => (
          <ConnectionsPuzzleCard
            key={puzzle.printDate}
            puzzle={puzzle}
            isLatest={puzzle.id === latestId}
          />
        ))}
      </div>
    </section>
  )
}
