// Single source for the slice DLS 2.0 palette, now CSS-variable-backed so the
// proto can theme (light/dark) at runtime. Light values live in index.css
// `:root`; dark overrides in `[data-theme="dark"]`. Toggling `data-theme` on the
// phone root re-themes everything that reads a token — no JS re-render needed.
//
// Constants (WHITE, V_500, WHITE_10/20/30) do NOT change across themes:
//   • WHITE — true white (e.g. glyphs on the V-500 immersive surface)
//   • V_500 — brand purple (Pay/Valentino stays V-500 in dark too)
//   • WHITE_10/20/30 — white-alpha chrome that always sits on V-500
//
// ⚠️ DARK VALUES ARE PLACEHOLDERS (2026-05-30) — pending the real DLS dark-mode
// variables from Figma (get_variable_defs on a selected dark frame). Swap them in
// index.css `[data-theme="dark"]`; this file and all call sites stay unchanged.

// Constants (theme-invariant)
export const WHITE = '#FFFFFF';
export const V_500 = '#D30AD7';
export const WHITE_10 = 'rgba(255,255,255,0.10)';
export const WHITE_20 = 'rgba(255,255,255,0.20)';
export const WHITE_30 = 'rgba(255,255,255,0.30)';

// Themed surfaces
export const PAGE_BG = 'var(--page-bg)';   // page background (white → dark)
export const SURFACE = 'var(--surface)';   // card / elevated surface
export const BRAND_BG = 'var(--brand-bg)'; // Pay/Valentino immersive — V-500 light, #090B0C dark (Figma Background/Brand)

// Themed text
export const TEXT_PRIMARY = 'var(--text-primary)';
export const TEXT_SECONDARY = 'var(--text-secondary)';
export const TEXT_TERTIARY = 'var(--text-tertiary)';

// Themed hairline
export const OUTLINE_SUBTLE = 'var(--outline-subtle)';

// Themed brand tints
export const V_100 = 'var(--v-100)';
export const V_50 = 'var(--v-50)';

// Themed semantic + tints
export const POSITIVE = 'var(--positive)';
export const POSITIVE_50 = 'var(--positive-50)';
export const NEGATIVE = 'var(--negative)';
export const NEGATIVE_50 = 'var(--negative-50)';
export const AMBER = 'var(--amber)';
export const AMBER_50 = 'var(--amber-50)';
export const AMBER_700 = 'var(--amber-700)';

// Themed slate
export const SLATE_10 = 'var(--slate-10)';
export const SLATE_30 = 'var(--slate-30)';
export const SLATE_100 = 'var(--slate-100)';
export const SLATE_400 = 'var(--slate-400)';
export const SLATE_900 = 'var(--slate-900)';

// Themed accent
export const BLUE_500 = 'var(--blue-500)';
