'use client'

import { supabase } from '@/lib/supabaseClient'
import { Todo } from '@/app/todos/page'

interface TodoItemProps {
  todo: Todo
  onUpdate: () => void
}

export default function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const handleToggle = async () => {
    const { error } = await supabase
      .from('todos')
      .update({ is_completed: !todo.is_completed })
      .eq('id', todo.id)

    if (error) {
      console.error('更新に失敗しました:', error.message)
      return
    }
    onUpdate()
  }

  const handleDelete = async () => {
    const { error } = await supabase.from('todos').delete().eq('id', todo.id)

    if (error) {
      console.error('削除に失敗しました:', error.message)
      return
    }
    onUpdate()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-3 group">
      {/* 完了チェックボックス */}
      <input
        type="checkbox"
        checked={todo.is_completed}
        onChange={handleToggle}
        className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer accent-blue-600"
      />

      {/* タイトル */}
      <span
        className={`flex-1 text-sm ${
          todo.is_completed ? 'text-gray-300 line-through' : 'text-gray-800'
        }`}
      >
        {todo.title}
      </span>

      {/* 削除ボタン（ホバー時に表示） */}
      <button
        onClick={handleDelete}
        className="text-gray-200 hover:text-red-400 transition-colors text-xs opacity-0 group-hover:opacity-100"
        aria-label="削除"
      >
        削除
      </button>
    </div>
  )
}
