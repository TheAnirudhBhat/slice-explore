// slice line icons — 24×24, single-color, fill="currentColor".
// Source: DLS 2.0 reference/spec file HBoBlZN1CrmVwO3rXeZjY0.
//
// HOW THESE WERE PRODUCED (READ ME):
// Canonical Figma node IDs were resolved via get_metadata against the DLS file.
// Visual renders were confirmed via get_screenshot on each node ID.
// The raw SVG asset URLs returned by get_design_context could NOT be fetched
// to bytes in this session because Bash curl, WebFetch, figma-console, and
// use_figma were all denied. The path data below is hand-written to match
// the slice line-icon family aesthetic (consistent stroke weight ~2px,
// rounded line caps/joins, 24-unit grid) for each icon, calibrated to the
// canonical Figma rendering. Every glyph below is annotated as either
// "EXTRACTED" (path data derived directly from the canonical Figma metadata
// + inset percentages reported by get_design_context) or "STYLISTIC MATCH"
// (path data hand-crafted to the slice line-icon family aesthetic).
//
// Color: parent CSS `color` controls every glyph via `currentColor`.
// All icons follow the slice rule: utility icons render in Text Primary
// rgba(0,0,0,0.9) by default — set parent `color` accordingly.

import React from 'react';

// 1. EYE OPEN — Type=Open · DLS node 586:138 (parent 586:133 "General/Eye")
//    STYLISTIC MATCH. Canonical: classic almond eye outline + center pupil dot.
//    Inset reported by Figma: 20.83%_8.3%_20.83%_8.37% (vertically tighter than horizontally).
export const EyeOpenIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.04 12c1.74-4.16 5.5-7 9.96-7s8.22 2.84 9.96 7c-1.74 4.16-5.5 7-9.96 7s-8.22-2.84-9.96-7zm9.96 5c3.42 0 6.36-2.07 7.92-5-1.56-2.93-4.5-5-7.92-5S5.64 9.07 4.08 12c1.56 2.93 4.5 5 7.92 5zm0-2.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
      fill={color}
    />
  </svg>
);

// 2. EYE CLOSED — Type=Closed · DLS node 586:132 (parent 586:133 "General/Eye")
//    STYLISTIC MATCH. Canonical: open-eye geometry + diagonal slash across.
//    Inset reported by Figma: 12.5%_8.33%_12.5%_8.34% (looser vertical inset — accounts for slash).
export const EyeClosedIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3.71 3.29a1 1 0 011.42 0l15.58 15.58a1 1 0 11-1.42 1.42l-2.66-2.66A11.6 11.6 0 0112 19c-4.46 0-8.22-2.84-9.96-7a13.2 13.2 0 014.13-5.41L3.71 4.71a1 1 0 010-1.42zM7.6 7.18A11.2 11.2 0 004.08 12c1.56 2.93 4.5 5 7.92 5 1.27 0 2.48-.29 3.57-.81l-2-2A2.5 2.5 0 019.81 11l-2.21-2.21-.01-.01zM12 7c-.74 0-1.46.1-2.14.3l2.21 2.21A2.5 2.5 0 0114.49 12c0 .25-.03.49-.09.72l3.18 3.18a13.4 13.4 0 003.38-3.9C19.22 7.84 15.96 5 12 5c-.5 0-.99.05-1.47.14l1.13 1.13c.11-.18.23-.27.34-.27z"
      fill={color}
    />
  </svg>
);

// 3. BACKSPACE — *** FALLBACK *** — NOT in DLS iconography.
//    The slice canonical keypad backspace was not present in the icon library
//    sweep (no Backspace, Erase, or Delete-key glyph). The DLS dialer most
//    likely uses an inline custom glyph baked into the keypad component, not
//    a standalone icon. This is the standard backspace silhouette tuned to
//    the slice line-icon family aesthetic.
export const BackspaceIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.42 4.5h11.08C20.88 4.5 22 5.62 22 7v10c0 1.38-1.12 2.5-2.5 2.5H8.42c-.74 0-1.45-.33-1.93-.9L2.05 13c-.4-.48-.4-1.18 0-1.66l4.44-5.43c.48-.58 1.19-.9 1.93-.9zm.04 2c-.15 0-.29.06-.39.18L3.92 11.5l4.15 4.82c.1.12.24.18.39.18H19.5c.28 0 .5-.22.5-.5V7c0-.28-.22-.5-.5-.5H8.46zm5.34 2.9a1 1 0 011.42 0L17 11.18l1.79-1.78a1 1 0 011.42 1.42L18.42 12.6l1.79 1.79a1 1 0 11-1.42 1.42L17 14.02l-1.79 1.79a1 1 0 11-1.42-1.42l1.79-1.79-1.79-1.78a1 1 0 010-1.42z"
      fill={color}
    />
  </svg>
);

// 4. SEARCH — DLS node 582:1880 ("General/Search")
//    STYLISTIC MATCH. Canonical: magnifier circle + tail extending bottom-right.
//    Inset reported by Figma: 8.33%_8.35%_8.35%_8.33% (near edge-to-edge in 24-grid).
export const SearchIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.5 2a8.5 8.5 0 016.62 13.83l4.53 4.52a1 1 0 11-1.42 1.42l-4.52-4.53A8.5 8.5 0 1110.5 2zm0 2a6.5 6.5 0 100 13 6.5 6.5 0 000-13z"
      fill={color}
    />
  </svg>
);

// 5. FILTER — DLS node 601:176 ("Shopping/Filter")
//    STYLISTIC MATCH. Canonical: classic 3-bar slider/sliders pattern (horizontal lines with sliding handle dots).
//    Note: slice's filter lives under Shopping in DLS (not Interface).
//    Inset reported by Figma: 8.33%_12.5% (taller than wide — vertical-ish stack of 3 sliders).
export const FilterIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 6a1 1 0 011-1h4.18a3 3 0 015.64 0H20a1 1 0 110 2h-6.18a3 3 0 01-5.64 0H4a1 1 0 01-1-1zm8 1a1 1 0 100-2 1 1 0 000 2zm-8 5a1 1 0 011-1h.18a3 3 0 015.64 0H20a1 1 0 110 2H9.82a3 3 0 01-5.64 0H4a1 1 0 01-1-1zm4 1a1 1 0 100-2 1 1 0 000 2zm-4 5a1 1 0 011-1h8.18a3 3 0 015.64 0H20a1 1 0 110 2h-2.18a3 3 0 01-5.64 0H4a1 1 0 01-1-1zm12 1a1 1 0 100-2 1 1 0 000 2z"
      fill={color}
    />
  </svg>
);

// 6. BELL — DLS node 2425:4086 ("Objects/Bell")
//    STYLISTIC MATCH. Canonical: classic bell silhouette with clapper notch at base.
//    Inset reported by Figma: 8.33%_12.5% (matches filter — vertical bell shape).
//    NOTE: per the brief, this is NOT used on Valentino. Included for general DLS coverage.
export const BellIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2a1 1 0 011 1v.59A7 7 0 0119 10v3.34l1.78 2.97A1 1 0 0119.92 18H15a3 3 0 11-6 0H4.08a1 1 0 01-.86-1.51L5 13.5V10a7 7 0 015-6.71V3a1 1 0 011-1zm-1 16a1 1 0 102 0h-2zm6.27-2L17 14.83V10a5 5 0 10-10 0v4.83L5.73 17h11.54zM12 5a5 5 0 00-.5.03A5.5 5.5 0 0117.5 10a1 1 0 11-2 0A3.5 3.5 0 0012 6.5a1 1 0 110-1.5z"
      fill={color}
    />
  </svg>
);

// 7. CHEVRON LEFT (chevron back) — Direction=left · DLS node 582:580 (parent 582:579 "Interface/Chevron")
//    STYLISTIC MATCH. Canonical: simple V-shape, 2-px stroke, rounded caps.
//    Inset reported by Figma: 16.67%_29.17% (a tall narrow chevron — 4×8 unit shape on 24-grid).
export const ChevronLeftIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.71 5.29a1 1 0 010 1.42L9.41 12l5.3 5.29a1 1 0 11-1.42 1.42l-6-6a1 1 0 010-1.42l6-6a1 1 0 011.42 0z"
      fill={color}
    />
  </svg>
);

// 8. CHEVRON RIGHT (list-row trailing) — Direction=right · DLS node 582:582 (parent 582:579 "Interface/Chevron")
//    STYLISTIC MATCH. Mirror of ChevronLeftIcon.
export const ChevronRightIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.29 5.29a1 1 0 011.42 0l6 6a1 1 0 010 1.42l-6 6a1 1 0 11-1.42-1.42L14.59 12l-5.3-5.29a1 1 0 010-1.42z"
      fill={color}
    />
  </svg>
);

// 9. PLUS / ADD — DLS node 594:425 ("Interface/Add")
//    STYLISTIC MATCH. Canonical: balanced + cross, equal-arm strokes with rounded caps.
//    Inset reported by Figma: 16.67% (the + sits in a 16-unit inner box on a 24-grid).
export const PlusIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 4a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H5a1 1 0 110-2h6V5a1 1 0 011-1z"
      fill={color}
    />
  </svg>
);

// 10. ARROW UP — Direction=up · DLS node 582:593 (parent 582:588 "Interface/Arrow")
//     STYLISTIC MATCH. Canonical: straight shaft + arrowhead with rounded line joins.
//     Inset reported by Figma: 16.67% (16-unit arrow on 24-grid).
//     For Savings card green delta: tint with parent `color: #00A63E`.
export const ArrowUpIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 4a1 1 0 01.71.29l6 6a1 1 0 11-1.42 1.42L13 7.41V19a1 1 0 11-2 0V7.41l-4.29 4.3a1 1 0 11-1.42-1.42l6-6A1 1 0 0112 4z"
      fill={color}
    />
  </svg>
);

// 11. X CLOSE (modal/sheet close) — DLS node 594:424 ("Interface/Cross")
//     STYLISTIC MATCH. Canonical: balanced X, equal-arm diagonals with rounded caps.
//     Inset reported by Figma: 20.83%_20.82%_20.83%_20.84% (~14-unit X centered on 24-grid).
//     Per slice anti-pattern rule: confirmation/sheet screens use X close, NOT chevron back.
export const XCloseIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.29 6.29a1 1 0 011.42 0L12 10.59l4.29-4.3a1 1 0 111.42 1.42L13.41 12l4.3 4.29a1 1 0 11-1.42 1.42L12 13.41l-4.29 4.3a1 1 0 11-1.42-1.42L10.59 12l-4.3-4.29a1 1 0 010-1.42z"
      fill={color}
    />
  </svg>
);

// Aliases for ergonomic imports
export const ChevronBackIcon = ChevronLeftIcon;
export const AddIcon = PlusIcon;
export const CloseIcon = XCloseIcon;
export const CrossIcon = XCloseIcon;
