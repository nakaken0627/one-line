'use client'

import { useState } from 'react'
import { Subtask } from '@/lib/types'
import { supabase } from '@/lib/supabaseClient'
import StatusSelect from '@/components/ui/StatusSelect'
import { TaskStatus } from '@/lib/types'

interface SubtaskItemProps {
  subtask: Subtask
  onUpdate: () => void
}

export default function SubtaskItem({ subtask, onUpdate }: SubtaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [memo, setMemo] = useState(subtask.memo ?? '')

  const handleStatusChange = async (status: TaskStatus) => {
    await supabase
      .from('subtasks')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', subtask.id)
    onUpdate()
  }

  const handleMemoBlur = async () => {
    if (memo === (subtask.memo ?? '')) return
    await supabase
      .from('subtasks')
      .update({ memo: memo || null, updated_at: new Date().toISOString() })
      .eq('id', subtask.id)
    onUpdate()
  }

  const handleDelete = async () => {
    await supabase.from('subtasks').delete().eq('id', subtask.id)
    onUpdate()
  }

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <StatusSelect value={subtask.status} onChange={handleStatusChange} />
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 text-left text-sm text-gray-700 hover:text-gray-900 transition-colors"
        >
          <span className={subtask.status === 'done' ? 'line-through text-gray-400' : ''}>
            {subtask.title}
          </span>
          {subtask.memo && !isExpanded && (
            <span className="ml-1 text-xs text-gray-400">📝</span>
          )}
        </button>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-300 hover:text-gray-500 transition-colors text-xs"
          aria-label={isExpanded ? '閉じる' : 'メモを展開'}
        >
          {isExpanded ? '▲' : '▼'}
        </button>
        <button
          onClick={handleDelete}
          className="text-gray-200 hover:text-red-400 transition-colors text-xs ml-1"
          aria-label="削除"
        >
          ✕
        </button>
      </div>

      {isExpanded && (
        <div className="px-3 pb-3 border-t border-gray-50">
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            onBlur={handleMemoBlur}
            placeholder="メモを追加..."
            rows={3}
            className="w-full mt-2 text-xs text-gray-600 border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none placeholder:text-gray-300 transition"
          />
        </div>
      )}
    </div>
  )
}
