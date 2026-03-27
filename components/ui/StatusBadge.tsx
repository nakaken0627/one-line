import { TaskStatus, STATUS_CONFIG } from '@/lib/types'

interface StatusBadgeProps {
  status: TaskStatus
  size?: 'sm' | 'md'
}

const colorMap = {
  blue: 'bg-blue-50 text-blue-700',
  red: 'bg-red-50 text-red-700',
  amber: 'bg-amber-50 text-amber-700',
  gray: 'bg-gray-100 text-gray-500',
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${colorMap[config.color]} ${sizeClass}`}>
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  )
}
