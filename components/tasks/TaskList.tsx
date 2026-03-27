'use client'

import { useState, useEffect, useRef } from 'react'
import { Task } from '@/lib/types'
import TaskCard from './TaskCard'
import { DragDropProvider } from '@dnd-kit/react'
import { move } from '@dnd-kit/helpers'
import { supabase } from '@/lib/supabaseClient'

interface TaskListProps {
  tasks: Task[]
  onUpdate: () => void
  onReorder: (tasks: Task[]) => void
}

export default function TaskList({ tasks, onUpdate, onReorder }: TaskListProps) {
  // ドラッグ中の表示のために、ローカルでitems stateを管理する
  // 親の tasks が変わったときも同期する
  const [items, setItems] = useState<Task[]>(tasks)
  // stale closure問題を回避するため、最新のitemsをrefでも保持する
  const itemsRef = useRef<Task[]>(tasks)

  useEffect(() => {
    setItems(tasks)
    itemsRef.current = tasks
  }, [tasks])

  // ドラッグ中にリアルタイムで並び替えを反映（楽観的更新）
  const handleDragOver = (event: any) => {
    setItems((prev) => {
      const next = move(prev, event) as Task[]
      itemsRef.current = next
      return next
    })
  }

  // ドラッグ完了時にDBに保存する
  const handleDragEnd = async (event: any) => {
    // キャンセル（Escキー等）された場合は元の順番に戻す
    if (event.canceled) {
      setItems(tasks)
      itemsRef.current = tasks
      return
    }

    const reordered = itemsRef.current
    onReorder(reordered) // 親のstateを更新

    // 全タスクのorderをDBに一括保存（並列処理）
    await Promise.all(
      reordered.map((task, index) =>
        supabase.from('tasks').update({ order: index }).eq('id', task.id)
      )
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center text-gray-400 text-sm py-16">
        タスクがありません
      </div>
    )
  }

  return (
    <DragDropProvider onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="space-y-2">
        {items.map((task, index) => (
          <TaskCard key={task.id} task={task} index={index} onUpdate={onUpdate} />
        ))}
      </div>
    </DragDropProvider>
  )
}
