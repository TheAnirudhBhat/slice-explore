// Single source of truth for slice avatars across the proto. Replaces the four
// hand-rolled implementations (AppBar trailing photo, Activity list monogram,
// Valentino home photo, Profile photo).
//
// Sizes in use: 40 (Activity list), 44 (AppBar + Valentino home), 128 (Profile).
//
// `tone` drives the ring and (for monograms) the letter colour:
//   • plain    — no ring. Photo avatars in chrome (AppBar, Valentino home).
//   • subtle   — 1px rgba(0,0,0,0.05) ring. Profile photo.
//   • outlined — 1px rgba(0,0,0,0.1) ring + primary letter on white. Activity list default.
//   • received — 1px #00A63E ring + green letter on white. Activity received/cashback rows.
//
// Content precedence: photo (src) → children (custom node) → initial (letter).
// `onTap` turns it into a button; `hit` expands the tap target to 48 while the
// visual stays `size` (DLS 2.0 minimum touch target). box-sizing is left to the
// global `* { box-sizing: border-box }` so ringed sizes keep their exact footprint.

import React from 'react';

const TONES = {
  plain:    { ring: 'none',                            bg: 'transparent', fg: null },
  subtle:   { ring: '1px solid var(--outline-subtle)', bg: 'transparent', fg: null },
  // `chip` = the Activity list avatar: a THEMED surface disc (white in light,
  // rgba(255,255,255,0.05) card-bg in dark — NOT a constant white fill) + a faint
  // outline-subtle ring + a tertiary monogram letter that themes (dark-grey in
  // light, light in dark). Verified vs Figma dark node 6591:60485.
  chip:     { ring: '1px solid var(--outline-subtle)', bg: 'var(--surface)', fg: 'var(--text-tertiary)' },
};

export default function Avatar({
  size,
  photo,
  initial,
  children,
  tone = 'plain',
  fg,            // optional monogram-letter colour override (e.g. brand-red 'Z')
  hit = false,
  onTap,
  ariaLabel,
}) {
  const t = TONES[tone] || TONES.plain;
  const isMonogram = photo == null && children == null && initial != null;

  const inner = (
    <div
      aria-hidden={isMonogram && !onTap && !ariaLabel ? 'true' : undefined}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        border: t.ring,
        background: t.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontFamily: 'Rubik, sans-serif',
        fontWeight: 500,
        // Canonical DLS monogram: ~half the avatar (20px on a 40px avatar),
        // -0.2px tracking, leading-none.
        fontSize: Math.round(size * 0.5),
        lineHeight: 1,
        letterSpacing: '-0.2px',
        color: fg || t.fg || undefined,
      }}
    >
      {photo != null ? (
        <img
          src={photo}
          alt=""
          aria-label={!onTap ? ariaLabel : undefined}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : children != null ? (
        children
      ) : (
        initial
      )}
    </div>
  );

  if (!onTap) return inner;

  const target = hit ? 48 : size;
  return (
    <button
      onClick={onTap}
      aria-label={ariaLabel || 'open profile'}
      style={{
        width: target,
        height: target,
        padding: 0,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {inner}
    </button>
  );
}
