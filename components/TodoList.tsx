import { Todo } from '@/app/todos/page'
import TodoItem from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  onUpdate: () => void
}

export default function TodoList({ todos, onUpdate }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-400 text-sm py-12">
        Todoがありません。追加してみましょう！
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onUpdate={onUpdate} />
      ))}
    </div>
  )
}
