// L1 routing scaffold — stack of full-screen L1 overlays that slide in from
// the right over the L0 pager. Any L0 calls `useL1().push(name, props)` to
// open an L1; the L1 component calls `useL1().pop()` (or its provided
// `onClose`) to dismiss.
//
// Pattern:
//   • Single stack at App.jsx level (this provider).
//   • Each L1 = { key, name, props }.
//   • Render: stack.map → L1Slide (framer-motion slide-in from right).
//   • The newest entry sits on top; pop removes the top.
//   • Status bar STAYS the same throughout L1 navigation (it's a chrome
//     element, not part of any L0 / L1).
//
// Canonical motion per slice DLS: slide-in from right at iOS-NATURAL pacing —
// ~400ms, ease cubic-bezier(0.32, 0.72, 0, 1) (the iOS push/sheet decelerate
// curve). Slide-out reverses. (cal:2026-05-30 cont-32: the old 280ms +
// easeOutExpo [0.16,1,0.3,1] read too fast/snappy — "pace to iOS natural speed".)

import React, { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const L1Context = createContext({
  push: () => {},
  pop: () => {},
  popAll: () => {},
  depth: 0,
});

export function useL1() {
  return useContext(L1Context);
}

// R24 cont-3: per-L1 slide direction. Profile slides up from the BOTTOM
// (like an account/identity sheet); other L1s slide from the RIGHT (the
// canonical L1 push). Each registry entry can be either:
//   • a Component (defaults to right-slide), or
//   • an object { Component, slideFrom: 'right'|'bottom' }.
const MOTION_VARIANTS = {
  right: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
  },
  bottom: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    transition: { duration: 0.45, ease: [0.32, 0.72, 0, 1] },
  },
};

export default function L1Stack({ registry, children, onOpenChange }) {
  const [stack, setStack] = useState([]);

  const push = useCallback((name, props = {}) => {
    setStack((s) => [...s, { key: `${name}-${Date.now()}-${s.length}`, name, props }]);
  }, []);

  const pop = useCallback(() => {
    setStack((s) => s.slice(0, -1));
  }, []);

  const popAll = useCallback(() => setStack([]), []);

  // Notify App when stack depth changes so chrome (status bar) can adapt.
  React.useEffect(() => {
    if (onOpenChange) onOpenChange(stack.length > 0);
  }, [stack.length, onOpenChange]);

  const ctx = { push, pop, popAll, depth: stack.length };

  return (
    <L1Context.Provider value={ctx}>
      {children}
      <AnimatePresence>
        {stack.map((entry) => {
          const reg = registry[entry.name];
          if (!reg) return null;
          // Normalize: bare Component → { Component, slideFrom: 'right' }
          const Component = typeof reg === 'function' ? reg : reg.Component;
          const slideFrom = (typeof reg === 'object' && reg.slideFrom) || 'right';
          const variant = MOTION_VARIANTS[slideFrom] || MOTION_VARIANTS.right;
          return (
            <motion.div
              key={entry.key}
              {...variant}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 200, // above BottomNav (z=100); below the status bar (z=250)
                background: 'var(--page-bg)',
              }}
            >
              <Component {...entry.props} onClose={pop} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </L1Context.Provider>
  );
}
