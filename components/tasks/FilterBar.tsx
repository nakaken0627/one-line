'use client'

import { TaskStatus, STATUS_CONFIG } from '@/lib/types'

type FilterValue = 'all' | TaskStatus

interface FilterBarProps {
  value: FilterValue
  onChange: (value: FilterValue) => void
  counts: Record<TaskStatus, number>
}

const filters: { value: FilterValue; label: string }[] = [
  { value: 'all', label: '全て' },
  { value: 'mine', label: STATUS_CONFIG.mine.emoji },
  { value: 'waiting', label: STATUS_CONFIG.waiting.emoji },
  { value: 'check', label: STATUS_CONFIG.check.emoji },
]

export default function FilterBar({ value, onChange, counts }: FilterBarProps) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {filters.map((f) => {
        const count = f.value === 'all'
          ? Object.values(counts).reduce((a, b) => a + b, 0)
          : counts[f.value as TaskStatus] ?? 0

        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              value === f.value
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <span>{f.label}</span>
            <span className={`rounded-full px-1.5 py-0.5 text-xs leading-none ${
              value === f.value ? 'bg-white/20' : 'bg-gray-100'
            }`}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
