'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Task } from '@/lib/types'
import AppShell from '@/components/layout/AppShell'
import StatusBadge from '@/components/ui/StatusBadge'

export default function ArchivePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [openWeeks, setOpenWeeks] = useState<Set<string>>(new Set())

  const fetchArchivedTasks = useCallback(async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .not('archived_at', 'is', null)
      .order('archived_at', { ascending: false })

    if (error) {
      console.error('アーカイブの取得に失敗しました:', error.message)
      return
    }

    setTasks(data ?? [])
    setLoading(false)

    // Latest week is open by default
    if (data && data.length > 0) {
      const latestWeek = data[0].week_label ?? ''
      setOpenWeeks(new Set([latestWeek]))
    }
  }, [])

  useEffect(() => {
    fetchArchivedTasks()
  }, [fetchArchivedTasks])

  const filtered = search.trim()
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          (t.memo ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : tasks

  // Group by week_label
  const grouped = filtered.reduce(
    (acc, task) => {
      const week = task.week_label ?? '日付不明'
      if (!acc[week]) acc[week] = []
      acc[week].push(task)
      return acc
    },
    {} as Record<string, Task[]>
  )

  const weeks = Object.keys(grouped)

  const toggleWeek = (week: string) => {
    setOpenWeeks((prev) => {
      const next = new Set(prev)
      if (next.has(week)) next.delete(week)
      else next.add(week)
      return next
    })
  }

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-semibold text-gray-700">アーカイブ</h1>
          <span className="text-xs text-gray-400">{tasks.length}件</span>
        </div>

        {/* Search */}
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="タスクを検索..."
          className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-300 bg-white"
        />

        {loading ? (
          <div className="text-center text-gray-400 text-sm py-16">読み込み中...</div>
        ) : weeks.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-16">
            {search ? '検索結果がありません' : 'アーカイブがありません'}
          </div>
        ) : (
          <div className="space-y-3">
            {weeks.map((week) => (
              <div key={week} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleWeek(week)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">{week}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                      {grouped[week].length}件
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {openWeeks.has(week) ? '▲' : '▼'}
                  </span>
                </button>

                {openWeeks.has(week) && (
                  <div className="border-t border-gray-50 divide-y divide-gray-50">
                    {grouped[week].map((task) => (
                      <div key={task.id} className="px-4 py-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 line-through">{task.title}</p>
                            {task.memo && (
                              <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{task.memo}</p>
                            )}
                          </div>
                          <StatusBadge status={task.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
