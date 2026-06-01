// Bottom fade overlay — content scrolls behind it; cards fade into the page-bg
// just above the floating bottom nav. Reusable across white-page pods.
//
// Usage:
//   <div style={{position:'relative', width:'100%', height:'100%', overflow:'hidden'}}>
//     <ScrollContent ... />
//     <BottomFade color="#F6F9FC" />
//   </div>
//
// `color` should match the underlying page bg so the gradient resolves cleanly.

import React from 'react';

// R23 fix-it-2-cont-14: default height bumped 140 → 200 per user — fade must
// fully obscure scrolling content behind the floating nav (transactions in
// Activity were peeking through the gap above the dock).
export default function BottomFade({ color = 'var(--page-bg)', height = 200, bottom = 0 }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        // `bottom` lets a pod lift the fade off the screen edge (e.g. 12px on the
        // white L0s so it sits a touch above the floating nav).
        bottom,
        height,
        // `transparent` start stop works for BOTH hex and var(--token) colors, in
        // light AND dark (modern browsers interpolate transparent→color in
        // premultiplied space — no grey midpoint). The old colorWithAlpha() only
        // parsed #RRGGBB and silently fell back to white-transparent, which broke
        // the fade on var(--page-bg) / dark bg (cal:2026-05-30 cont-37 code review).
        background: `linear-gradient(to bottom, transparent 0%, ${color} 60%)`,
        pointerEvents: 'none',
        zIndex: 5,
      }}
      aria-hidden="true"
    />
  );
}
