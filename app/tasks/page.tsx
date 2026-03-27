'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Task, TaskStatus } from '@/lib/types'
import AppShell from '@/components/layout/AppShell'
import TaskList from '@/components/tasks/TaskList'
import TaskForm from '@/components/tasks/TaskForm'
import FilterBar from '@/components/tasks/FilterBar'

type FilterValue = 'all' | TaskStatus

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterValue>('all')

  const fetchTasks = useCallback(async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, subtasks(*)')
      .is('archived_at', null)
      .order('order', { ascending: true })

    if (error) {
      console.error('タスクの取得に失敗しました:', error.message)
      return
    }

    const sorted = (data ?? []).map((task) => ({
      ...task,
      subtasks: [...(task.subtasks ?? [])].sort((a, b) => a.order - b.order),
    }))

    setTasks(sorted)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter)

  const counts = tasks.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] ?? 0) + 1
      return acc
    },
    {} as Record<TaskStatus, number>
  )

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Filter */}
        {!loading && tasks.length > 0 && (
          <FilterBar
            value={filter}
            onChange={setFilter}
            counts={{
              mine: counts.mine ?? 0,
              waiting: counts.waiting ?? 0,
              check: counts.check ?? 0,
              done: counts.done ?? 0,
            }}
          />
        )}

        {/* Task list */}
        {loading ? (
          <div className="text-center text-gray-400 text-sm py-16">読み込み中...</div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onUpdate={fetchTasks}
            onReorder={(reordered) => {
              if (filter === 'all') {
                setTasks(reordered)
              }
            }}
          />
        )}

        {/* Add task form */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <TaskForm onAdd={fetchTasks} />
        </div>
      </div>
    </AppShell>
  )
}
