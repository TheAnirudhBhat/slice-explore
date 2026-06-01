import { useRef } from 'react';

// useTapGuard — tap-vs-drag guard for tappable elements that sit ON a swipeable
// pager (L0 cards, list rows, entry cards). Without it, dragging to swipe pages
// fires a synthetic click on the element under the finger (e.g. accidentally
// opening an L1). Spread the returned handlers onto the element; pass your tap
// action:
//
//   const tap = useTapGuard(() => push('insurance'));
//   <button {...tap}>…</button>
//
// Uses the native onClick (so keyboard + programmatic activation still work) but
// cancels it when a pointermove since pointerdown exceeded `threshold` px.
//
// R24 cont-31: extracted from the Activity TxnRow inline guard so EVERY
// tappable-on-pager element reuses ONE implementation. ALWAYS use this for cards
// / rows that live inside the Pager — otherwise a swipe registers as a tap.
export default function useTapGuard(onTap, threshold = 10) {
  const downRef = useRef(null);
  return {
    onPointerDown(e) {
      downRef.current = { x: e.clientX, y: e.clientY, dragged: false };
    },
    onPointerMove(e) {
      const d = downRef.current;
      if (!d || d.dragged) return;
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) >= threshold) d.dragged = true;
    },
    onClick(e) {
      const d = downRef.current;
      downRef.current = null;
      if (d && d.dragged) return;
      onTap && onTap(e);
    },
  };
}
