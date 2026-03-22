'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface TodoFormProps {
  onAdd: () => void
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)

    // ログイン中のユーザー情報を取得して user_id に使う
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setIsSubmitting(false)
      return
    }

    const { error } = await supabase.from('todos').insert({
      title: title.trim(),
      user_id: user.id,
    })

    if (error) {
      console.error('Todoの追加に失敗しました:', error.message)
    } else {
      setTitle('')
      onAdd()
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="新しいTodoを入力..."
        className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      <button
        type="submit"
        disabled={isSubmitting || !title.trim()}
        className="bg-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors whitespace-nowrap"
      >
        追加
      </button>
    </form>
  )
}
