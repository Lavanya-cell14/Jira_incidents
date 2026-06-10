import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_BACKEND_URL

  if (!backendUrl) {
    throw new Error('VITE_BACKEND_URL is required. Add it to .env.')
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        'shared-ui': fileURLToPath(new URL('./shared-ui/src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/jira': {
          target: backendUrl,
          changeOrigin: true,
        },
      },
      fs: {
        allow: [
          fileURLToPath(new URL('.', import.meta.url)),
          fileURLToPath(new URL('./shared-ui', import.meta.url)),
        ],
      },
    },
  }
})
