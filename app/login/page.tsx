'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async () => {
    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('メールアドレスまたはパスワードが正しくありません')
    } else {
      router.push('/tasks')
      router.refresh()
    }

    setIsLoading(false)
  }

  const handleSignUp = async () => {
    setIsLoading(true)
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
    } else {
      setMessage('確認メールを送信しました。メールボックスを確認してリンクをクリックしてください。')
    }

    setIsLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        {/* ロゴ */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">one-line</h1>
          <p className="text-gray-400 text-sm mt-1">メモ感覚のタスク管理</p>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* 成功メッセージ */}
        {message && (
          <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4">
            {message}
          </div>
        )}

        {/* フォーム */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="6文字以上"
              autoComplete="current-password"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading || !email || !password}
            className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            {isLoading ? '処理中...' : 'ログイン'}
          </button>

          <button
            onClick={handleSignUp}
            disabled={isLoading || !email || !password}
            className="w-full border border-gray-200 text-gray-600 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            新規登録
          </button>
        </div>
      </div>
    </div>
  )
}
