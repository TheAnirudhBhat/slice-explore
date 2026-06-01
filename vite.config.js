import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_PROTO = '/Users/anirudhbhat/.claude/skills/slice-design/proto';

// EXTENSION SEAM — the skill proto stays READ-ONLY (governance).
// src/AppBase.jsx is a symlink → skill src/App.jsx, so with preserveSymlinks
// false (Vite default) AppBase's relative imports resolve against the skill's
// REAL path → the whole app shell, status bar, bottom nav, phone-view and the
// Banking/Pay/Credit/Activity pods are inherited LIVE (and update when the
// skill updates). This project OWNS exactly ONE pod — Explore — so we redirect
// ONLY the skill App's `./pods/explore/L0.jsx` import to this project's own
// explore pod. Nothing in the skill proto is modified to make this work.
const skillExploreL0 = path.join(SKILL_PROTO, 'src/pods/explore/L0.jsx');
const projectExploreL0 = path.join(__dirname, 'src/pods/explore/L0.jsx');
function overrideExplorePod() {
  return {
    name: 'override-explore-pod',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!importer || !source.includes('pods/explore/L0')) return null;
      const resolved = path.resolve(path.dirname(importer), source);
      // Only the skill App's explore import is redirected — never our own.
      if (resolved === skillExploreL0) return projectExploreL0;
      return null;
    },
  };
}

export default defineConfig({
  plugins: [overrideExplorePod(), react()],
  // Single React / framer-motion instance across the symlink boundary. Without
  // dedupe the skill's files (resolved from the skill's node_modules) and ours
  // (resolved from here) load separate copies → "invalid hook call".
  resolve: { dedupe: ['react', 'react-dom', 'framer-motion'] },
  // fs.allow lets Vite serve the symlinked kit + AppBase from outside the root.
  server: { port: 8765, fs: { allow: ['.', SKILL_PROTO] } },
});
