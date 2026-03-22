import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'one-line',
  description: 'メモ感覚で使えるタスク管理アプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
