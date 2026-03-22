import { createBrowserClient } from '@supabase/ssr'

// Supabaseへの接続クライアント（ブラウザ用）
// NEXT_PUBLIC_ がついた環境変数はブラウザ側でも読める
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
