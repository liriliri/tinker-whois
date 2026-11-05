import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'),
  )

  return {
    base: '',
    plugins: [react()],
    build: {
      outDir: path.dirname(pkg.tinker.main),
      rollupOptions: {
        input: {
          app: 'index.html',
        },
      },
    },
  }
})
