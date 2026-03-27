import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Next.js Proxy（旧称 Middleware）
 * Next.js 16 より "Middleware" から "Proxy" にリネームされた（機能は同じ）。
 *
 * すべてのページリクエストの前に実行される。
 * - 未ログイン → /login にリダイレクト
 * - ログイン済みで /login にアクセス → /tasks にリダイレクト
 * - セッションのCookieを自動更新する（期限切れ防止）
 */
export async function proxy(request: NextRequest) {
  // レスポンスを初期化（後でCookieを付与するために変数に保持する）
  let supabaseResponse = NextResponse.next({ request })

  // サーバー側でSupabaseを使うには createServerClient を使う
  // Cookieの操作が必要なのでgetAll / setAllを手動で実装する
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // リクエストのCookieを更新
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          // レスポンスも作り直してCookieを付与する
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // ユーザーのセッションを確認する
  // ※ getSession() ではなく getUser() を使う（セキュリティ上の推奨）
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // 未ログインで /login 以外にアクセスした場合 → /login にリダイレクト
  if (!user && pathname !== '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // ログイン済みで /login にアクセスした場合 → /tasks にリダイレクト
  if (user && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/tasks'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

// Proxyを適用するパスの設定
// 静的ファイル（画像・JS・CSS等）には適用しない
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
