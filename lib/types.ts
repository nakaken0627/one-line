export type TaskStatus = 'mine' | 'waiting' | 'check' | 'done'

export const STATUS_CONFIG = {
  mine: { label: '自分のタスク', emoji: '🔵', color: 'blue' },
  waiting: { label: '確認待ち', emoji: '🔴', color: 'red' },
  check: { label: '人に確認', emoji: '🟡', color: 'amber' },
  done: { label: '完了', emoji: '☑', color: 'gray' },
} as const

export interface Subtask {
  id: string
  task_id: string
  title: string
  memo: string | null
  status: TaskStatus
  order: number
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  memo: string | null
  status: TaskStatus
  order: number
  archived_at: string | null
  week_label: string | null
  created_at: string
  updated_at: string
  subtasks?: Subtask[]
}
