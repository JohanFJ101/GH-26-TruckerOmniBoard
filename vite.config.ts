import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

declare const process: { cwd(): string }

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/ollama': {
          target: env.VITE_OLLAMA_URL || 'http://localhost:11434',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ollama/, ''),
        },
        '/navpro-proxy': {
          target: 'https://api.truckerpath.com/navpro',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/navpro-proxy/, ''),
        },
      },
    },
  }
})
