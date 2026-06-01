// Canonical slice DLS 2.0 App bar — matching Figma node 3:38 spec.
//
// Two variants:
//   • L0 (node 678:454): pod home — title H2 left + optional eye/balance toggle
//     + photo Avatar trailing. Use on Banking, Explore, Credit, Activity L0.
//   • Standard (node 679:2330): L1+ — chevron back left + title H3 (left,
//     after chevron) + 0–2 trailing icons. Use on every screen below L0.
//
// Anatomy (both variants):
//   • Total height: 64px (status bar is separately rendered by PhoneFrame)
//   • Bg: white. Scroll elevation: when content scrolls under, bottom shadow
//     `0 6px 8px rgba(0,0,0,0.05)` appears.
//   • Icon buttons: 48×48 hit area with 24×24 glyph (the inner glyph is
//     padded by 12px on all sides).
//
// L0 specifics:
//   • padding: 24px left, 20px right, 8px vertical
//   • title: Rubik Medium 24/32, letter-spacing 0.48
//   • gap between items: 8px
//   • trailing: optional eye icon (48×48) then Avatar container (48×48 with
//     40×40 photo inside)
//
// Standard specifics:
//   • padding: 12px horizontal, 8px vertical
//   • title: Rubik Medium 20/24, letter-spacing 0.4
//   • justify-between row: nav-icon | title (flex-1) | icons cluster
//   • nav-icon: 48×48 with 24×24 chevron-back (default; pass null to hide)
//   • icons: 0–2 trailing 48×48 buttons with 24×24 glyphs
//
// Immersive variant is NOT in this canonical spec — it's a per-pod exception
// (Pay/Valentino home keeps its own immersive app bar with white-alpha pills).

import React, { useEffect, useRef, useState } from 'react';
import Avatar from './Avatar.jsx';
import { ChevronBackGlyph } from '../icons/ChevronBack.jsx';

/**
 * usePageScroll — attach to a scrollable container ref, returns true once it has
 * scrolled past `threshold` px. Use to drive AppBar elevation.
 *
 *   const ref = useRef(null);
 *   const scrolled = usePageScroll(ref);
 *   return <div ref={ref}><AppBar scroll={scrolled} />…</div>
 */
export function usePageScroll(ref, threshold = 1) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const isScrolled = el.scrollTop > threshold;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [ref, threshold]);
  return scrolled;
}

export function AppBar({
  variant = 'l0',
  title,
  leading,         // Standard: nav icon (default chevron-back). Pass null to hide.
  actions = [],    // Trailing icon buttons (React nodes). Up to 2 for Standard, 1+ avatar for L0.
  avatar,          // L0 specific: Avatar React node — renders in a 48×48 hit container with 40×40 inner
  onAvatarTap,     // L0 specific: tap handler for avatar (opens Profile L1). When given, avatar becomes a button with 48×48 hit area surrounding the 40×40 image.
  onBack,          // Standard: chevron-back tap handler (default leading)
  scroll = false,  // When true, elevation shadow appears
  background = 'transparent', // R23 fix-it-2-cont-4: per-pod override. Activity uses white.
}) {
  const isL0 = variant === 'l0';
  // R24 cont-13: on scroll, the AppBar background becomes white regardless of
  // its default. User feedback: "when scrolled this part should become white
  // with the status bar above it, right now it's transparent, so you can see
  // cards below it ... it cuts the card drop shadow". The card shadows now
  // get fully covered by the white AppBar fill once they slide under it.
  const effectiveBg = scroll ? 'var(--page-bg)' : background;
  return (
    <div
      style={{
        position: 'sticky',  // FIXED at top of its scrollable parent — content scrolls UNDER it
        top: 0,
        width: '100%',
        height: 64,
        background: effectiveBg,
        boxShadow: scroll ? '0 6px 8px rgba(0,0,0,0.05)' : 'none',
        // Background swap is INSTANT (no transition on it): a fading bg lets cards
        // show THROUGH the half-opaque bar while scrolling. Only the elevation
        // shadow eases. (cont-38 — app bar must opacify instantly on scroll.)
        transition: 'box-shadow 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        zIndex: 20,
      }}
    >
      {isL0 ? (
        // L0: title H2 left + optional eye + avatar trailing
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            paddingLeft: 24,
            paddingRight: 20,
            paddingTop: 8,
            paddingBottom: 8,
            width: '100%',
          }}
        >
          <div
            style={{
              flex: '1 1 0',
              minWidth: 0,
              fontFamily: 'Rubik, sans-serif',
              fontWeight: 500,
              fontSize: 24,
              lineHeight: '32px',
              letterSpacing: '0.48px',
              color: 'var(--text-primary)',
            }}
          >
            {title}
          </div>

          {actions.map((action, i) => (
            <ActionSlot key={`a-${i}`}>{action}</ActionSlot>
          ))}

          {avatar && (
            <Avatar size={44} hit onTap={onAvatarTap}>
              {avatar}
            </Avatar>
          )}
        </div>
      ) : (
        // Standard: chevron-back + title (left-after-chevron) + 0–2 trailing icons
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 8,
            paddingBottom: 8,
            width: '100%',
          }}
        >
          <IconButton onClick={onBack} ariaLabel="back" tone="primary">
            {leading === undefined ? <ChevronBackGlyph /> : leading}
          </IconButton>

          <div
            style={{
              flex: '1 1 0',
              minWidth: 0,
              fontFamily: 'Rubik, sans-serif',
              fontWeight: 500,
              fontSize: 20,
              lineHeight: '24px',
              letterSpacing: '0.4px',
              color: 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {actions.map((action, i) => (
              <ActionSlot key={`a-${i}`}>{action}</ActionSlot>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ----- Subcomponents -----

function IconButton({ children, onClick, ariaLabel, tone = 'primary' }) {
  // R24 cont-4: tone determines glyph color (via parent CSS color → SVG
  // currentColor). leading chevron/close = 'primary' (0.9); trailing actions
  // like 3-dot menu, eye, share = 'tertiary' (0.5).
  const color = tone === 'tertiary' ? 'var(--text-tertiary)' : 'var(--text-primary)';
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: 48,
        height: 48,
        padding: 12,
        background: 'transparent',
        color,
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
      {children}
    </button>
  );
}

// R24 cont-5/11: ActionSlot replaces the old IconButton wrapper for trailing
// AppBar actions. Each action passed in is typically already an interactive
// element (a <button> with its own onClick) — wrapping it in another <button>
// caused React's button-in-button DOM-nesting warning. ActionSlot is a plain
// 48×48 div that just sizes/centers the action; the inner action handles its
// own interaction.
//
// Tertiary tinting: uses opacity:0.5 instead of color:rgba(0,0,0,0.5) so it
// works on BOTH inline SVG glyphs (whose strokes/fills inherit `currentColor`)
// AND raster PNG glyphs (like /assets/icons/slice_eye_open.png) that can't
// respond to a CSS color value. Color stays solid black so SVG paint stays
// at 100% black before opacity drops it to ≈ tertiary (0.5). PNG renders
// natively, then the same 0.5 opacity drops it to tertiary too. User
// direction: "tertiary colour fill, [on] any icons on the app bar which is
// on the right".
function ActionSlot({ children }) {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        padding: 0,
        // Themed tertiary so inline-SVG action glyphs (currentColor) read in BOTH
        // light and dark — was a hardcoded black + opacity:0.5 which, with the old
        // opaque PNG eye, showed a white box on the dark page.
        color: 'var(--text-tertiary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

// ----- Glyphs (inline slice DLS line icons) -----

// Official slice DLS eye (open) — paths from dls_eye.svg (Figma node 586:138),
// INLINED with `currentColor` so the parent themes it (tertiary in light, white-
// tertiary in dark). The earlier slice_eye_*.png were 100% opaque → a white box
// on the dark page.
// Artboard normalised to 24×24 to OPTICALLY MATCH EyeClosedGlyph (also 24×24): the
// source drawing is 20.4×14 with no padding, so it's centred via viewBox "-2 -5 24
// 24" (≈1.8px side padding, same as the eye-off). Paths are byte-identical — only
// the canvas is reframed so hide↔unhide don't change size on toggle. (cont-39)
export function EyeOpenGlyph() {
  return (
    <svg width="22" height="22" viewBox="-2 -5 24 24" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{ display: 'block' }}>
      <path d="M19.4144 5.24481C16.9817 1.96291 13.4531 0 9.97487 0C6.49661 0 3.17919 1.87982 0.565469 5.28635C-0.18849 6.273 -0.18849 7.74777 0.565469 8.77596C2.97813 12.089 6.41618 14 9.98492 14C13.5537 14 17.0018 12.089 19.4345 8.75519C20.1885 7.71662 20.1885 6.273 19.4345 5.24481H19.4144ZM17.4139 7.18694C15.4637 9.86647 12.7494 11.3932 9.97487 11.3932C7.2003 11.3932 4.50616 9.86647 2.56597 7.20772C2.4956 7.10386 2.4956 6.94807 2.53581 6.89614C4.667 4.12315 7.30083 2.59644 9.97487 2.59644C12.6489 2.59644 15.4637 4.17507 17.4139 6.81306C17.4843 6.90653 17.4843 7.08309 17.4139 7.18694Z" fill="currentColor" />
      <path d="M9.98511 9.03565C11.0955 9.03565 11.9957 8.10568 11.9957 6.9585C11.9957 5.81132 11.0955 4.88135 9.98511 4.88135C8.87471 4.88135 7.97456 5.81132 7.97456 6.9585C7.97456 8.10568 8.87471 9.03565 9.98511 9.03565Z" fill="currentColor" />
    </svg>
  );
}

export function EyeClosedGlyph() {
  // Official slice DLS eye-OFF — General/Eye, Figma node 6601:61065 (the proper
  // slashed eye). Replaces the earlier open-eye + a HAND-DRAWN diagonal line (not
  // slice). Inlined with currentColor (same official geometry) so the ActionSlot
  // themes it. viewBox 24×24.
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{ display: 'block' }}>
      <path d="M21.374 10.2947C19.16 7.69369 16.0807 6.05675 12.9208 5.79565C12.2163 5.72535 11.6226 6.2576 11.5622 6.9405C11.5018 7.63343 12.0151 8.23598 12.7094 8.29624C14.9737 8.48705 17.1977 9.58168 18.9286 11.4094C19.2707 11.771 19.2305 12.3534 18.8883 12.7049C18.5965 12.9961 18.2946 13.2773 17.9726 13.5284C17.4291 13.9602 17.3486 14.7536 17.7814 15.2959C18.0329 15.6072 18.3952 15.7578 18.7575 15.7578C19.0393 15.7578 19.311 15.6675 19.5424 15.4767C20.2167 14.9344 20.8507 14.3117 21.4142 13.6389C22.2193 12.6647 22.1891 11.2487 21.3639 10.2847L21.374 10.2947Z" fill="currentColor" />
      <path d="M6.89279 3.47578C6.46007 2.93348 5.67513 2.8431 5.12164 3.26488C4.57822 3.69671 4.47759 4.48003 4.91031 5.03237L6.59089 7.17143C5.14177 7.9447 3.81341 9.01926 2.61587 10.385C1.80074 11.319 1.79068 12.7049 2.61587 13.679C5.03107 16.5813 8.45261 18.2383 12.005 18.2383C13.0214 18.2383 14.0277 18.0977 15.0139 17.8266L17.1373 20.518C17.3888 20.8293 17.7511 21 18.1235 21C18.3952 21 18.6669 20.9096 18.8983 20.7289C19.4418 20.297 19.5424 19.5137 19.1097 18.9614L6.89279 3.47578ZM5.15183 11.3491C6.08772 10.4252 7.11418 9.70215 8.20102 9.17994L13.2729 15.6172C10.3848 16.0189 7.3859 14.9644 5.15183 12.725C4.76943 12.3433 4.76943 11.7307 5.15183 11.3491Z" fill="currentColor" />
    </svg>
  );
}

export function SearchGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function FilterGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 17H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default AppBar;
