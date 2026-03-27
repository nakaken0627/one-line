interface ProgressBarProps {
  completed: number
  total: number
}

export default function ProgressBar({ completed, total }: ProgressBarProps) {
  if (total === 0) return null

  const percent = Math.round((completed / total) * 100)

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-blue-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 shrink-0">
        {completed}/{total}
      </span>
    </div>
  )
}
