'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Task, TaskStatus } from '@/lib/types'
import AppShell from '@/components/layout/AppShell'
import StatusSelect from '@/components/ui/StatusSelect'
import SubtaskItem from '@/components/subtasks/SubtaskItem'
import SubtaskForm from '@/components/subtasks/SubtaskForm'

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string

  const [task, setTask] = useState<Task | null>(null)
  const [title, setTitle] = useState('')
  const [memo, setMemo] = useState('')
  const [status, setStatus] = useState<TaskStatus>('mine')
  const [loading, setLoading] = useState(true)

  const fetchTask = useCallback(async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, subtasks(*)')
      .eq('id', taskId)
      .single()

    if (error || !data) {
      router.push('/tasks')
      return
    }

    const sorted = {
      ...data,
      subtasks: [...(data.subtasks ?? [])].sort((a, b) => a.order - b.order),
    }

    setTask(sorted)
    setTitle(data.title)
    setMemo(data.memo ?? '')
    setStatus(data.status as TaskStatus)
    setLoading(false)
  }, [taskId, router])

  useEffect(() => {
    fetchTask()
  }, [fetchTask])

  const handleTitleBlur = async () => {
    if (!title.trim() || title === task?.title) return
    await supabase
      .from('tasks')
      .update({ title: title.trim(), updated_at: new Date().toISOString() })
      .eq('id', taskId)
  }

  const handleMemoBlur = async () => {
    if (memo === (task?.memo ?? '')) return
    await supabase
      .from('tasks')
      .update({ memo: memo || null, updated_at: new Date().toISOString() })
      .eq('id', taskId)
  }

  const handleStatusChange = async (newStatus: TaskStatus) => {
    setStatus(newStatus)
    await supabase
      .from('tasks')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', taskId)
  }

  const handleDelete = async () => {
    if (!confirm('このタスクを削除しますか？')) return
    await supabase.from('tasks').delete().eq('id', taskId)
    router.push('/tasks')
  }

  if (loading) {
    return (
      <AppShell>
        <div className="text-center text-gray-400 text-sm py-16">読み込み中...</div>
      </AppShell>
    )
  }

  if (!task) return null

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Back + actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/tasks"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            ← タスク一覧
          </Link>
          <button
            onClick={handleDelete}
            className="text-xs text-gray-300 hover:text-red-400 transition-colors"
          >
            削除
          </button>
        </div>

        {/* Task card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          {/* Status */}
          <StatusSelect value={status} onChange={handleStatusChange} />

          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="w-full text-lg font-semibold text-gray-900 border-0 focus:outline-none focus:ring-0 placeholder:text-gray-300 bg-transparent"
            placeholder="タスク名"
          />

          {/* Memo */}
          <div>
            <p className="text-xs font-medium text-gray-400 mb-1.5">メモ</p>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              onBlur={handleMemoBlur}
              rows={4}
              placeholder="メモを追加..."
              className="w-full text-sm text-gray-700 border border-gray-100 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none placeholder:text-gray-300 transition bg-gray-50"
            />
          </div>
        </div>

        {/* Subtasks */}
        <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-2">
            サブタスク
            {task.subtasks && task.subtasks.length > 0 && (
              <span className="ml-1.5 text-gray-400 font-normal">
                ({task.subtasks.filter((s) => s.status === 'done').length}/{task.subtasks.length})
              </span>
            )}
          </h2>

          <div className="space-y-1.5">
            {(task.subtasks ?? []).map((subtask) => (
              <SubtaskItem key={subtask.id} subtask={subtask} onUpdate={fetchTask} />
            ))}
          </div>

          <SubtaskForm
            taskId={taskId}
            currentCount={task.subtasks?.length ?? 0}
            onAdd={fetchTask}
          />
        </div>
      </div>
    </AppShell>
  )
}
