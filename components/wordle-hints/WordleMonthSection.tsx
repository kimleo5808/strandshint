import type { WordlePuzzle } from '@/types/wordle-hint'
import { WordlePuzzleCard } from './WordlePuzzleCard'
import dayjs from 'dayjs'

interface WordleMonthSectionProps {
  yearMonth: string
  puzzles: WordlePuzzle[]
  latestId?: number
  showAnswers?: boolean
}

export function WordleMonthSection({
  yearMonth,
  puzzles,
  latestId,
  showAnswers = false,
}: WordleMonthSectionProps) {
  const label = dayjs(yearMonth + '-01').format('MMMM YYYY')

  return (
    <section id={yearMonth} className="scroll-mt-20">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="font-heading text-lg font-bold text-foreground">{label}</h2>
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          {puzzles.length} puzzle{puzzles.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {puzzles.map((puzzle) => (
          <WordlePuzzleCard
            key={puzzle.printDate}
            puzzle={puzzle}
            isLatest={puzzle.id === latestId}
            showAnswer={showAnswers}
          />
        ))}
      </div>
    </section>
  )
}
