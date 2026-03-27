'use client'

import { TaskStatus, STATUS_CONFIG } from '@/lib/types'

interface StatusSelectProps {
  value: TaskStatus
  onChange: (status: TaskStatus) => void
  disabled?: boolean
}

const statuses: TaskStatus[] = ['mine', 'waiting', 'check', 'done']

const colorMap = {
  blue: 'border-blue-200 bg-blue-50 text-blue-700 focus:ring-blue-500',
  red: 'border-red-200 bg-red-50 text-red-700 focus:ring-red-500',
  amber: 'border-amber-200 bg-amber-50 text-amber-700 focus:ring-amber-500',
  gray: 'border-gray-200 bg-gray-50 text-gray-500 focus:ring-gray-400',
}

export default function StatusSelect({ value, onChange, disabled }: StatusSelectProps) {
  const config = STATUS_CONFIG[value]

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as TaskStatus)}
      disabled={disabled}
      className={`text-xs font-medium rounded-full px-2.5 py-1 border cursor-pointer focus:outline-none focus:ring-2 transition ${colorMap[config.color]}`}
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {STATUS_CONFIG[s].emoji} {STATUS_CONFIG[s].label}
        </option>
      ))}
    </select>
  )
}
