'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface TaskFormProps {
  onAdd: () => void
}

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setIsSubmitting(false); return }

    const { error } = await supabase.from('tasks').insert({
      user_id: user.id,
      title: title.trim(),
      status: 'mine',
      order: 0,
    })

    if (!error) {
      setTitle('')
      onAdd()
    }
    setIsSubmitting(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="新しいタスクを追加..."
        className="flex-1 text-sm border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-300"
      />
      <button
        type="submit"
        disabled={isSubmitting || !title.trim()}
        className="bg-gray-900 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-700 disabled:opacity-30 transition-colors whitespace-nowrap"
      >
        追加
      </button>
    </form>
  )
}
