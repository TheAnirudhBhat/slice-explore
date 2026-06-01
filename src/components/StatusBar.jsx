// iPhone status bar — FIXED OVERLAY at the top of the phone screen.
// Time + icons stay in place during page swipes. Their COLOR is computed
// per-element based on WHICH page is under each element at this drag offset.
//
// R23 fix-it-2 (2026-05-29): the earlier span-overlap algorithm was wrong —
// it flipped icons to LIGHT as soon as ANY part overlapped a dark page, so
// the icons on the white side prematurely became invisible. The user wants
// each element to track WHAT IS UNDER IT: dark over white, light over Valentino.
// Pick the page that contains the element's CENTER POINT.

import React from 'react';
import { motion, useTransform } from 'framer-motion';

// Center x-coordinate of each status bar element in the 402-wide phone screen
// (iPhone 17 Pro screen cut-out). Used only for per-page colour sampling during
// a pager drag; the visual L/R position is set by the padding below.
const TIME_CENTER = 60;          // "9:41" near the left edge
const ICONS_CENTER = 402 - 62;   // icons cluster near the right edge

const DARK = 'rgba(0,0,0,0.85)';
const LIGHT = '#FFFFFF';

// Find which page is under the element's center. Pager translates the row by
// `currentX`; page i then covers viewport [i*pageWidth + currentX, +pageWidth].
function variantUnderCenter(currentX, centerX, pages, pageWidth) {
  for (let i = 0; i < pages.length; i++) {
    const pageStart = i * pageWidth + currentX;
    const pageEnd = pageStart + pageWidth;
    if (centerX >= pageStart && centerX < pageEnd) {
      return pages[i].variant; // 'light' | 'dark'
    }
  }
  // Fallback (shouldn't normally happen): use the first/last page as we drift past edges.
  return centerX < 0 ? pages[0].variant : pages[pages.length - 1].variant;
}

function colorForCenter(currentX, centerX, pages, pageWidth) {
  return variantUnderCenter(currentX, centerX, pages, pageWidth) === 'dark' ? LIGHT : DARK;
}

function SignalGlyph({ color }) {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
      <rect x="0" y="8" width="3.2" height="4" rx="0.6" fill={color} />
      <rect x="5" y="5.5" width="3.2" height="6.5" rx="0.6" fill={color} />
      <rect x="10" y="3" width="3.2" height="9" rx="0.6" fill={color} />
      <rect x="15" y="0" width="3.2" height="12" rx="0.6" fill={color} />
    </svg>
  );
}
function WifiGlyph({ color }) {
  // R24 cont-7: completely rebuilt WiFi glyph. The old version used 4 thin
  // filled "band" paths (gap between concentric arcs ≈ 1.1 SVG units) which
  // made the icon visually MUCH thinner than the chunky signal bars and the
  // thick-stroked battery sitting next to it. User: "this wifi logo is off,
  // it doesn't look right, thinner than the other icons".
  //
  // New design: 3 stroked Bézier arcs + 1 filled dot — matching iOS native
  // wifi visual weight. Consistent strokeWidth 1.8 keeps the arcs as bold as
  // the signal bars (≈ 3 SVG units wide) without thickening into a blob.
  // The outermost arc's peak sits at y ≈ 0.4 inside viewBox `0 -1 17 13`,
  // so no clipping (and no need for the prior `-2` offset).
  return (
    <svg width="17" height="13" viewBox="0 -1 17 13" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="10.5" r="1.5" fill={color} />
      <path
        d="M5.4 7.7 C 6.4 6.7 10.6 6.7 11.6 7.7"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M3 5.2 C 5 3.2 12 3.2 14 5.2"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M0.7 2.7 C 3.7 -0.3 13.3 -0.3 16.3 2.7"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
function BatteryGlyph({ color }) {
  return (
    <svg width="28" height="14" viewBox="0 0 28 14" fill="none" aria-hidden="true">
      <rect x="0.5" y="0.5" width="23" height="13" rx="3.5" stroke={color} strokeOpacity="0.45" fill="none" />
      <rect x="2.2" y="2.2" width="17" height="9.6" rx="1.6" fill={color} />
      <rect x="25" y="4.5" width="1.6" height="5" rx="0.5" fill={color} fillOpacity="0.45" />
    </svg>
  );
}

export default function MotionStatusBar({ pagerX, pages, pageWidth, time = '9:41', forceVariant = null }) {
  // Each element gets a color motion-value derived from WHICH page is under its center.
  // Dark over white (DARK). Light over Valentino (LIGHT). Hard cut at the page boundary.
  // R24 cont-2: if `forceVariant` is set (e.g. 'light' when an L1 overlay is
  // open on a white bg), the per-page sampling is bypassed and all elements
  // use the forced variant's contrast color.
  const timeColor = useTransform(pagerX, (x) => {
    if (forceVariant) return forceVariant === 'dark' ? LIGHT : DARK;
    return colorForCenter(x, TIME_CENTER, pages, pageWidth);
  });
  const iconColor = useTransform(pagerX, (x) => {
    if (forceVariant) return forceVariant === 'dark' ? LIGHT : DARK;
    return colorForCenter(x, ICONS_CENTER, pages, pageWidth);
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 54,
        // R24 cont-2: z-index above L1Stack (z=200) so status bar shows on
        // top of L1 overlays. DynamicIsland sits even higher (z=260).
        zIndex: 250,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          // Vertically CENTER time + icons on the Dynamic Island. Measured from
          // the bezel PNG: the island pill spans screen-y ~14–50, center ≈ 32
          // (NOT 20 — the earlier value was wrong, which left the icons sitting
          // ~12px too high). Height 64 + alignItems:center → content centers at 32.
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          // Canonical iOS status bar (DLS node 6566:58784): time 40px from the
          // left, icons 30px from the right — balanced inset, matched here.
          paddingLeft: 40,
          paddingRight: 30,
        }}
      >
        <motion.div
          style={{
            // iOS status bar uses the SYSTEM font (SF Pro), not Rubik — match it.
            fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif',
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: '-0.3px',
            color: timeColor,
            lineHeight: 1,
            width: 84,
          }}
        >
          {time}
        </motion.div>

        <motion.div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            width: 84,
            justifyContent: 'flex-end',
            color: iconColor,
          }}
        >
          <SignalGlyph color="currentColor" />
          <WifiGlyph color="currentColor" />
          <BatteryGlyph color="currentColor" />
        </motion.div>
      </div>
    </div>
  );
}

// (Removed the standalone DynamicIsland export — cal:2026-05-30 cont-37 code
// review: the current PhoneFrame uses iphone17_bezel.png with the Dynamic Island
// baked into the art, so a separate SVG island would double it. Unused after the
// bezel-PNG migration.)
