import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

function readDotEnvValue(key: string) {
  const envFile = readFileSync(fileURLToPath(new URL('./.env', import.meta.url)), 'utf8')
  const line = envFile
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(`${key}=`))

  if (!line) return undefined

  return line
    .slice(line.indexOf('=') + 1)
    .trim()
    .replace(/^['"]|['"]$/g, '')
}

// https://vite.dev/config/
export default defineConfig(() => {
  const backendUrl = readDotEnvValue('VITE_BACKEND_URL')

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
