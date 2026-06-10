import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/jira': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
    fs: {
      allow: [
        fileURLToPath(new URL('.', import.meta.url)),
        fileURLToPath(new URL('../shared-ui', import.meta.url)),
      ],
    },
  },
})
