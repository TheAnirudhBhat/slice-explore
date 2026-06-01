// Horizontal page pager — swipe to switch pods.
//
// User direction (R23): "I should be able to swipe between pages — drag the
// page (anywhere empty area), the adjacent page pushes in. The bottom nav
// updates in real time as I drag, not after release."
//
// Architecture:
//   • All pages laid out in a horizontal flex row (5 × pageWidth = 1950px)
//   • Drag the row horizontally via framer-motion `drag="x"`
//   • Track the row's x via useMotionValue
//   • `onIndexChange(idx)` fires in REAL TIME as the user drags (fires
//     whenever the nearest page-to-center changes). Parent uses this to
//     update the bottom nav visually.
//   • `onCommit(idx)` fires on drag release with the snapped index.
//   • If the parent's `activeIndex` changes externally (e.g. via nav tap),
//     the row animates to that target with a spring.

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, animate, useMotionValueEvent } from 'framer-motion';

const SPRING = { type: 'spring', stiffness: 320, damping: 32, mass: 0.85 };

export default function Pager({
  activeIndex,
  pageCount,
  pageWidth,
  onIndexChange, // real-time during drag (and on commit)
  onCommit,      // post-release with snapped index
  externalX,     // optional external motion value (so other components can read drag position)
  children,
}) {
  // Use external x if provided so App can share it with the StatusBar overlay.
  const localX = useMotionValue(-activeIndex * pageWidth);
  const x = externalX || localX;
  const isDraggingRef = useRef(false);
  // Tracks the LAST emitted index so bidirectional drag fires correctly.
  // Without this, comparing against `activeIndex` (committed) means going BACK
  // to the original pod after passing midpoint wouldn't re-fire onIndexChange.
  const lastEmittedRef = useRef(activeIndex);

  // External activeIndex change → snap INSTANTLY to target (R23 fix-it-2-cont-16:
  // user direction — "when scroll the bottom bar and leave the page should
  // update instantly rather than the pushing animation happening"). Was using
  // SPRING animation; now `x.set(...)` for an instant jump. Applies both to
  // nav-drag-release commits and nav-tap commits.
  useEffect(() => {
    if (!isDraggingRef.current) {
      x.set(-activeIndex * pageWidth);
      lastEmittedRef.current = activeIndex;
    }
  }, [activeIndex, pageWidth]); // eslint-disable-line react-hooks/exhaustive-deps

  // While dragging, compute nearest-to-center page index and report it.
  // Fires in BOTH directions — going forward past midpoint AND going back past it.
  useMotionValueEvent(x, 'change', (currentX) => {
    if (!isDraggingRef.current) return;
    const containerCenter = pageWidth / 2;
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < pageCount; i++) {
      const pageCenter = currentX + (i + 0.5) * pageWidth;
      const dist = Math.abs(pageCenter - containerCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    if (bestIdx !== lastEmittedRef.current) {
      lastEmittedRef.current = bestIdx;
      if (onIndexChange) onIndexChange(bestIdx);
    }
  });

  // Drag bounds: don't go past first or last page
  const minX = -(pageCount - 1) * pageWidth;
  const maxX = 0;

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: minX, right: maxX }}
      dragElastic={0.08}
      dragMomentum={false}
      style={{
        x,
        display: 'flex',
        flexDirection: 'row',
        width: pageCount * pageWidth,
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        willChange: 'transform',
      }}
      onDragStart={() => {
        isDraggingRef.current = true;
        lastEmittedRef.current = activeIndex; // reset before drag starts
      }}
      onDragEnd={(event, info) => {
        isDraggingRef.current = false;
        const currentX = x.get();
        // MOMENTUM: project the release position forward by the throw velocity
        // (like a real scroll fling), then snap to the nearest page — so a quick
        // flick carries to the next page even with little travel, and a slow drag
        // settles where it is. Never skip more than one page per gesture.
        const projectedX = currentX + info.velocity.x * 0.18;
        let bestIdx = Math.round(-projectedX / pageWidth);
        bestIdx = Math.max(activeIndex - 1, Math.min(activeIndex + 1, bestIdx));
        bestIdx = Math.max(0, Math.min(pageCount - 1, bestIdx));
        if (onCommit) onCommit(bestIdx);
        // Velocity-aware spring so the settle continues the throw's momentum
        // instead of a dead stop.
        animate(x, -bestIdx * pageWidth, { ...SPRING, velocity: info.velocity.x });
      }}
    >
      {React.Children.map(children, (child, i) => (
        <div
          key={i}
          style={{
            width: pageWidth,
            height: '100%',
            flexShrink: 0,
            overflow: 'hidden',
            position: 'relative',
            // pan-y = browser owns VERTICAL scroll, but a HORIZONTAL touch gesture is
            // handed to JS so the framer drag (page swipe) fires. Without this, on
            // TOUCH the pods' vertical scroll containers swallowed the horizontal
            // swipe and you couldn't change pods by swiping (mouse-drag still worked,
            // so it only showed on mobile). Set on every page so all pods swipe, not
            // just Activity (which had its own pan-y). (cont-38 QA)
            touchAction: 'pan-y',
          }}
        >
          {child}
        </div>
      ))}
    </motion.div>
  );
}
