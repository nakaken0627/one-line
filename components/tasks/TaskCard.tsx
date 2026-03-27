'use client'

import Link from 'next/link'
import { useSortable } from '@dnd-kit/react/sortable'
import { Task } from '@/lib/types'
import StatusBadge from '@/components/ui/StatusBadge'
import ProgressBar from '@/components/ui/ProgressBar'
import { supabase } from '@/lib/supabaseClient'

interface TaskCardProps {
  task: Task
  index: number  // 新API: リスト内の位置番号が必要
  onUpdate: () => void
}

export default function TaskCard({ task, index, onUpdate }: TaskCardProps) {
  // 新API: ref（カード全体）と handleRef（ドラッグハンドル）を分けて受け取る
  // 旧API: setNodeRef + CSS.Transform + attributes + listeners が必要だった
  // 新API: refを当てるだけ、transformはライブラリが自動で管理する
  const { ref, handleRef, isDragging } = useSortable({
    id: task.id,
    index,
  })

  const subtasks = task.subtasks ?? []
  const completedCount = subtasks.filter((s) => s.status === 'done').length
  const incompleteCount = subtasks.length - completedCount
  const canComplete = subtasks.length === 0 || incompleteCount === 0

  const handleComplete = async () => {
    if (!canComplete) return

    const now = new Date()
    const weekLabel = getWeekLabel(now)

    const { error } = await supabase
      .from('tasks')
      .update({
        status: 'done',
        archived_at: now.toISOString(),
        week_label: weekLabel,
      })
      .eq('id', task.id)

    if (!error) onUpdate()
  }

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Top row: drag handle + status + complete button */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        {/* ドラッグハンドル: handleRef を当てることでこのボタンだけドラッグ可能になる */}
        <button
          ref={handleRef as React.RefCallback<HTMLButtonElement>}
          className="text-gray-200 hover:text-gray-400 cursor-grab active:cursor-grabbing touch-none"
          aria-label="並び替え"
        >
          <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
            <rect x="0" y="2" width="4" height="2" rx="1" />
            <rect x="8" y="2" width="4" height="2" rx="1" />
            <rect x="0" y="7" width="4" height="2" rx="1" />
            <rect x="8" y="7" width="4" height="2" rx="1" />
            <rect x="0" y="12" width="4" height="2" rx="1" />
            <rect x="8" y="12" width="4" height="2" rx="1" />
          </svg>
        </button>

        <StatusBadge status={task.status} />

        <div className="flex-1" />

        <button
          onClick={handleComplete}
          disabled={!canComplete}
          title={
            !canComplete
              ? `${incompleteCount}件のサブタスクが未完了です`
              : 'タスクを完了してアーカイブへ'
          }
          className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${
            canComplete
              ? 'border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white'
              : 'border-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          完了
        </button>
      </div>

      {/* Title - clickable link to detail */}
      <Link href={`/tasks/${task.id}`} className="block px-4 pb-3 group">
        <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
          {task.title}
        </p>
        {task.memo && (
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{task.memo}</p>
        )}
      </Link>

      {/* Progress bar */}
      {subtasks.length > 0 && (
        <div className="px-4 pb-3">
          <ProgressBar completed={completedCount} total={subtasks.length} />
        </div>
      )}
    </div>
  )
}

function getWeekLabel(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d)
  monday.setDate(diff)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const fmt = (dt: Date) =>
    `${dt.getFullYear()}/${String(dt.getMonth() + 1).padStart(2, '0')}/${String(dt.getDate()).padStart(2, '0')}`
  return `${fmt(monday)}〜${fmt(sunday)}`
}
