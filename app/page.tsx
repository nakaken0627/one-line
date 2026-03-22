// ミドルウェアが認証状態に応じて /login か /todos にリダイレクトする。
// / へのアクセスは /todos へ転送する。
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/todos')
}
