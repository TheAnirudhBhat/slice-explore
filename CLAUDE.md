# explore-react

React + Vite port of the slice Explore page proto. Direct successor to `../explore-base/` (single-file React 18 + Tailwind CDN). Migrated 2026-05-16 to enable Agentation 2.0 integration and component-level isolation.

## Run
```
npm install
npm run dev       # http://localhost:8765
npm run build     # production bundle into dist/
```

## Stack
- Vite 6 + React 18 + Tailwind 3 (PostCSS)
- All proto code currently lives in `src/App.jsx` (one big file, ported 1:1 from `explore-base/index.html`). To-do: split into per-section component files.
- Global styles in `src/index.css` (Tailwind directives + the slice DLS CSS that was inline in `<style>`).
- Assets in `public/assets/` — served from `/assets/...` paths.

## Stack vs `explore-base`
| | explore-base | explore-react (this) |
|---|---|---|
| Build step | None (Babel CDN) | Vite build |
| React | UMD CDN | npm module |
| Tailwind | CDN script | PostCSS build |
| Asset paths | `./assets/foo.png` | `/assets/foo.png` |
| File layout | 1 × `index.html` (5k LOC) | `src/App.jsx` + `src/index.css` (same content, properly split) |

## Migration notes
- `const { useState } = React;` → `import React, { useState } from 'react'` at top of App.jsx.
- `ReactDOM.createRoot(...).render(<App />)` lives in `src/main.jsx` now.
- Tailwind utility classes used in the proto need to be referenced from `src/App.jsx` for the JIT to pick them up — `tailwind.config.js` `content` covers this.
- `ReactDOM` import kept for any legacy calls (TODO: audit + remove if unused).

## Agentation integration

`agentation@3.0.2` is wired into `src/main.jsx` as a top-level sibling of `<App />`. The toolbar appears in the bottom-right corner. Click → activate → click any element on the page → annotate → copy structured markdown.

Currently using callback-only mode (`onAnnotationAdd`, `onSubmit` log to console). To enable Agent Sync with a local server, add `endpoint="http://localhost:4747"` to the `<Agentation />` props. Available callbacks live in `src/main.jsx`.

## Still pending after migration
- Split `App.jsx` into per-section modules: `src/sections/ForYou/*`, `src/sections/Rewards/*`, etc. Right now it's a 4k-line file.
- Decide whether to delete `../explore-base/` once parity is verified, or keep it as the no-build reference.
