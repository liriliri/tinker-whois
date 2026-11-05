import fs from 'node:fs'
import path from 'node:path'
import { builtinModules } from 'node:module'
import { defineConfig, type UserConfig } from 'vite'

export default defineConfig((): UserConfig => {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'),
  )

  const external = builtinModules.filter((e) => !e.startsWith('_'))
  external.push(
    'electron',
    ...Object.keys(pkg.dependencies || {}),
    ...external.map((m) => `node:${m}`),
  )

  return {
    base: '',
    build: {
      outDir: path.dirname(pkg.tinker.preload),
      lib: {
        entry: 'src/preload/index.ts',
        name: 'Main',
        fileName: 'index',
        formats: ['es'],
      },
      rollupOptions: {
        external,
      },
    },
  }
})
