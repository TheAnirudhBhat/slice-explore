import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// explore-base is now a STANDALONE snapshot: the inherited kit (components,
// icons, utils, tokens.js, index.css, theme-context.js), the app shell
// (AppBase.jsx) and the base pods (banking/payments/credit/activity/profile)
// were vendored as REAL files so the repo builds anywhere (e.g. Vercel) with no
// symlinks to a local machine. The old symlink-seam config (absolute SKILL_PROTO
// fs.allow + explore-pod resolver) is therefore gone — everything resolves from
// src/. `dedupe` kept as a harmless single-React safety net.
export default defineConfig({
  plugins: [react()],
  resolve: { dedupe: ['react', 'react-dom', 'framer-motion'] },
  server: { port: 8765 },
});
