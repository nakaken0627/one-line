'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import TodoForm from '@/components/TodoForm'
import TodoList from '@/components/TodoList'

export interface Todo {
  id: string
  user_id: string
  title: string
  is_completed: boolean
  created_at: string
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Todoを取得する関数（追加・削除・更新後に呼び出す）
  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Todoの取得に失敗しました:', error.message)
      return
    }

    setTodos(data ?? [])
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const completedCount = todos.filter((t) => t.is_completed).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Todo</h1>
            {!loading && (
              <p className="text-gray-400 text-xs mt-0.5">
                {completedCount} / {todos.length} 完了
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ログアウト
          </button>
        </div>

        {/* 入力フォーム */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
          <TodoForm onAdd={fetchTodos} />
        </div>

        {/* Todo一覧 */}
        {loading ? (
          <div className="text-center text-gray-400 text-sm py-12">読み込み中...</div>
        ) : (
          <TodoList todos={todos} onUpdate={fetchTodos} />
        )}
      </div>
    </div>
  )
}
