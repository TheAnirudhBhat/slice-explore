/** @type {import('tailwindcss').Config} */
export default {
  // Scan BOTH this project's src AND the inherited skill proto's src — the skill
  // shell/pods live in the skill dir, so any Tailwind utility classes they (or
  // this project's explore pod) use must be generated here. Theme mirrors the
  // skill's so custom tokens (v-500, font-rubik, nav-active) resolve identically.
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    '/Users/anirudhbhat/.claude/skills/slice-design/proto/src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'v-500': '#D30AD7',
        'v-400': '#E14ED7',
        'v-100': '#F4E5F8',
        'v-50': '#FAF2FC',
        'slate-10': 'rgba(0,0,0,0.1)',
        'slate-40': 'rgba(0,0,0,0.4)',
        'slate-60': 'rgba(0,0,0,0.6)',
      },
      fontFamily: { rubik: ['Rubik', 'system-ui', 'sans-serif'] },
      boxShadow: { 'nav-active': '0px 0px 16px rgba(0,0,0,0.12)' },
    },
  },
  plugins: [],
};
