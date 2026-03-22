// Tailwind v4 では @tailwindcss/postcss プラグインを使う
// v3 までの tailwindcss + autoprefixer の組み合わせは不要になった
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
