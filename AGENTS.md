# AGENTS.md

Guidelines for developing a TINKER plugin.

## Project layout

```
src/
  common/          # Shared types and utilities
  preload/         # Node APIs (index.ts entry)
  renderer/
    main.tsx       # React entry
    store.ts       # MobX state
    components/    # UI components
    i18n/          # Locale strings
index.html
vite.config.ts     # Renderer build
vite.preload.ts    # Preload build
package.json
icon.png
```

## Coding style

- React + TypeScript + Tailwind.
- Small, focused components.
- Avoid unnecessary comments.

## UI design

When doing a broad visual refresh (overall style, typography, layout) or rebuilding the plugin around new functionality, read and follow `skills/frontend-design/SKILL.md` to guide interface work. That skill helps with aesthetic direction and deliberate design choices so the UI does not read as generic defaults.

## TINKER configuration

Declare `tinker` in `package.json`:

```
"tinker": {
  "name": "Template",
  "description": "Short description shown in the plugin list",
  "main": "dist/renderer/index.html",
  "icon": "icon.png",
  "preload": "dist/preload/index.mjs",
  "locales": {
    "zh-CN": {
      "name": "模板",
      "description": "插件列表中显示的中文描述"
    }
  }
}
```

Field roles by stage:

- **Publish** — `package.json` `"name"` should use the `tinker-xxx` prefix; `"files"` should include `dist/` and `icon.png` so only build artifacts are packaged.
- **Listing** — `name`, `description`, and `icon` are shown when browsing or searching plugins in Tinker; `locales` overrides `name` and `description` for the matching user language.
- **Runtime** — `main` is the renderer entry loaded when the plugin window opens; `preload` runs first to expose Node-only APIs to the renderer (omit if not needed).

## Tinker API

Global `tinker` is available in both **preload** and **renderer** — call it directly in either layer without going through `contextBridge`. Refer to `node_modules/tinker-api-types/tinker.d.ts` for signatures and types.

Covers theme/locale, file dialogs and I/O, system UI, media/disk utilities, AI calls, and events such as `changeTheme` / `changeLanguage`.

## Preload

Only needed when the plugin uses Node-only modules or logic that cannot run in the renderer. `tinker` is already available in renderer — do not wrap or re-expose it through preload.

- Keep Node-only code in `preload/`.
- Expose minimal APIs via `contextBridge.exposeInMainWorld()`.

```ts
import { contextBridge } from 'electron'
import { query } from './nodeOnlyModule'

contextBridge.exposeInMainWorld('api', {
  query: (input: string) => query(input),
})
```

## Debugging

### Local development

```bash
npm link
```

Restart Tinker after `npm link` to load the global plugin.

### Tinker skill

Lets agents control the running Tinker app from the CLI — open and restart plugins, inspect running state, and debug the plugin UI. Install the [tinker skill](https://github.com/liriliri/agent-skills):

```bash
npx skills add liriliri/agent-skills --skill tinker
```

The `tinker` CLI is installed from the Tinker app tray menu. Detailed workflows live in bundled skills — load them via `tinker skills list` and `tinker skills path <name>` (e.g. `core`, `debug`, `mcp`).
