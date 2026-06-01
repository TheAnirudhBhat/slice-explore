// Canonical slice DLS 2.0 chevron-back — Interface/Chevron, Direction=left
// (DLS 2.0 file ncGqxiE6wUOqgOURwHx6Hp, node 582:580; vector asset exported
// 2026-05-30). IMPORTANT: the DLS chevron is a FILLED glyph (natural 10×16),
// NOT a thin stroke. The earlier strokeWidth-2 "V" read too thin next to the
// rest of the app-bar chrome — user: "the back button looks too thin, match
// figma". The canonical mark is a solid chevron with rounded joints.
//
// The exported base glyph points RIGHT (">"); the DLS left variant mirrors it
// with scale(-1,1). We center the 10×16 glyph inside a 24×24 icon box via
// `translate(17 4) scale(-1 1)` — matching the DLS app-bar nav-icon inset
// (16.67% top/bottom = 4px, 29.17% left/right = 7px). Colour inherits via
// currentColor so the AppBar IconButton tone applies.

import React from 'react';

export function ChevronBackGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        transform="translate(17 4) scale(-1 1)"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.396716 0.368306C0.925653 -0.122784 1.78321 -0.122767 2.31212 0.368346L9.60333 7.13845C10.1322 7.62956 10.1322 8.42577 9.60331 8.91687L2.37143 15.6317C1.84251 16.1228 0.984952 16.1228 0.456023 15.6317C-0.0729062 15.1406 -0.0729115 14.3443 0.456011 13.8532L6.73022 8.02764L0.396673 2.14674C-0.132241 1.65563 -0.132222 0.859397 0.396716 0.368306Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default ChevronBackGlyph;
