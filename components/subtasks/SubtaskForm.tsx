'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface SubtaskFormProps {
  taskId: string
  currentCount: number
  onAdd: () => void
}

export default function SubtaskForm({ taskId, currentCount, onAdd }: SubtaskFormProps) {
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)

    const { error } = await supabase.from('subtasks').insert({
      task_id: taskId,
      title: title.trim(),
      status: 'mine',
      order: currentCount,
    })

    if (!error) {
      setTitle('')
      onAdd()
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="サブタスクを追加..."
        className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-300"
      />
      <button
        type="submit"
        disabled={isSubmitting || !title.trim()}
        className="text-sm px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-30 transition-colors font-medium"
      >
        追加
      </button>
    </form>
  )
}
