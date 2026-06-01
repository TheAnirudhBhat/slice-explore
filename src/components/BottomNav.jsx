// Bottom nav — slice DLS 2.0 · R23 fix-it-2-cont-7 (flex+gap layout)
//
// Architecture change (R23 fix-it-2-cont-7):
//   Earlier rounds used a uniform SLOT_WIDTH grid (85 → 83 → 81). User
//   observed: "the space between 2 deselected bottom nav tabs seems more
//   than the space between the center selected one and the ones besides it".
//   Math: uniform slots with different circle sizes (44 inactive, 64 active)
//   means uniform CENTER-to-CENTER but ASYMMETRIC EDGE-to-EDGE distances.
//   The only fix is flex+gap layout where the GAP is the constant and items
//   have their natural widths.
//
//   Now: row uses `display: flex; gap: GAP`. Each item is its natural circle
//   diameter (44 inactive / 64 active / 72 pay-committed). Edge-to-edge gap
//   between any two adjacent items is exactly GAP regardless of which is
//   active. Matches the canonical dock layout pattern.

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate, useMotionValueEvent } from 'framer-motion';
import './BottomNav.css';
import {
  BankingActive,
  ExploreActive, ExploreInactive,
  CreditActive, CreditInactive,
  ActivityActive, ActivityInactive,
  PayInactive,
} from '../icons/NavIcons.jsx';

const NATURAL_ORDER = ['banking', 'explore', 'pay', 'credit', 'activity'];
export const PODS = NATURAL_ORDER;

const LABELS = {
  banking: 'Banking',
  explore: 'Explore',
  pay: 'Pay',
  credit: 'Credit',
  activity: 'Activity',
};

const ACTIVE_GLYPHS = {
  banking: BankingActive,
  explore: ExploreActive,
  pay: PayInactive,
  credit: CreditActive,
  activity: ActivityActive,
};

const INACTIVE_GLYPHS = {
  explore: ExploreInactive,
  pay: PayInactive,
  credit: CreditInactive,
  activity: ActivityInactive,
};

// Item dimensions per state. INACTIVE_W and ACTIVE_W are the circle diameters;
// the flex item box is exactly the circle (no surrounding slot padding).
const INACTIVE_W = 44;
const ACTIVE_W = 64;
const PAY_SPECIAL_W = 72; // Pay-active-committed ring
// R23 fix-it-2-cont-8: GAP 20 → 24 per user direction. Matches the canonical
// Banking dock spacing (gap-24 in Figma).
const GAP = 24;            // edge-to-edge gap between adjacent items
// MUST match App.jsx PHONE_WIDTH (the phone screen cut-out width). App moved to
// the iPhone-17 bezel (402 CSS px); this had drifted at 393 (old iPhone-16),
// throwing the active-item centering + per-slot variant lookup off by 9px
// (cal:2026-05-30 cont-37 code review). Keep these two in lockstep.
const PHONE_WIDTH = 402;
const CONTAINER_CENTER = PHONE_WIDTH / 2;

// Compute item widths + center positions for a given "visually active" pod
// and a "committed active" pod (because pay shows the 72px ring only when
// committed-active; while merely visually-active mid-drag it uses 64).
function getLayout(visualActive, committedActive) {
  const items = [];
  let pos = 0;
  NATURAL_ORDER.forEach((pod) => {
    let width;
    if (pod === visualActive) {
      width = pod === 'pay' && committedActive === 'pay' ? PAY_SPECIAL_W : ACTIVE_W;
    } else {
      width = INACTIVE_W;
    }
    items.push({ pod, left: pos, width, center: pos + width / 2 });
    pos += width + GAP;
  });
  // Last item: subtract trailing GAP (no item after it)
  const totalWidth = pos - GAP;
  return { items, totalWidth };
}

function targetXFor(visualActive, committedActive) {
  // R24 cont-8: REVERTED the R24 cont-5 clamp. Earlier I misread feedback
  // ("fif icons cropped on the top") as 5 bottom-nav icons getting cropped on
  // the right, and clamped the row offset so all 5 stayed inside the phone.
  // That broke the canonical behavior — slice's bottom nav ALWAYS centers the
  // active item horizontally in the phone, no matter which pod it is. With
  // the clamp, Banking-active and Activity-active no longer slid to center
  // because the row couldn't extend past the phone edge. The real feedback
  // was the wifi-icon crop, fixed separately. Nav goes back to natural
  // center-the-active behavior; whichever icons on the opposite edge slide
  // off-screen are masked by the phone's overflow:hidden as intended.
  const { items } = getLayout(visualActive, committedActive);
  const activeItem = items.find((it) => it.pod === visualActive);
  return CONTAINER_CENTER - activeItem.center;
}

function PayCenter() {
  return (
    <div className="slice-bnav-pay-special">
      <svg
        className="slice-bnav-pay-ring"
        width="72"
        height="72"
        viewBox="0 0 72 72"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="36" cy="36" r="34" stroke="white" strokeWidth="4" />
      </svg>
      <div className="slice-bnav-pay-inner">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path fillRule="evenodd" clipRule="evenodd" d="M3.22 9.305C3.89 9.305 4.44 8.755 4.44 8.086V6.786C4.44 5.487 5.49 4.437 6.8 4.437H8.11C8.78 4.437 9.33 3.888 9.33 3.218C9.33 2.548 8.78 1.999 8.11 1.999H6.8C4.15 1.999 2 4.147 2 6.786V8.086C2 8.755 2.55 9.305 3.22 9.305Z" fill="currentColor" />
          <path fillRule="evenodd" clipRule="evenodd" d="M8.11 19.548H6.8C5.49 19.548 4.44 18.489 4.44 17.189V15.89C4.44 15.22 3.89 14.671 3.22 14.671C2.55 14.671 2 15.22 2 15.89V17.189C2 19.838 4.15 21.977 6.8 21.977H8.11C8.78 21.977 9.33 21.427 9.33 20.758C9.33 20.088 8.78 19.538 8.11 19.538V19.548Z" fill="currentColor" />
          <path fillRule="evenodd" clipRule="evenodd" d="M20.78 14.682C20.11 14.682 19.56 15.232 19.56 15.902V17.201C19.56 18.5 18.51 19.56 17.2 19.56H15.89C15.22 19.56 14.67 20.11 14.67 20.779C14.67 21.449 15.22 21.999 15.89 21.999H17.2C19.85 21.999 22 19.85 22 17.211V15.912C22 15.242 21.45 14.692 20.78 14.692V14.682Z" fill="currentColor" />
          <path fillRule="evenodd" clipRule="evenodd" d="M17.2 1.999H15.89C15.22 1.999 14.67 2.548 14.67 3.218C14.67 3.888 15.22 4.438 15.89 4.438H17.2C18.51 4.438 19.56 5.497 19.56 6.786V8.086C19.56 8.755 20.11 9.305 20.78 9.305C21.45 9.305 22 8.755 22 8.086V6.786C22 4.138 19.85 1.999 17.2 1.999Z" fill="currentColor" />
          <path d="M7.2 12H16.8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

function Slot({
  pod,
  width,
  itemCenter,
  isActive,
  isCommitted,
  onTap,
  balance,
  navX,
  pagerX,
  pages,
}) {
  const ActiveGlyph = ACTIVE_GLYPHS[pod];
  const InactiveGlyph = INACTIVE_GLYPHS[pod];
  const showPaySpecial = pod === 'pay' && isActive && isCommitted;
  const slotRef = useRef(null);

  // Per-slot variant: which page is under this slot's viewport center?
  // R23 fix-it-2-cont-15: clamp the slot center to the VISIBLE viewport
  // [0, PHONE_WIDTH-1] before looking up which page is under it. Why: when a
  // committed non-Pay pod (e.g. Credit at idx 3) translates the nav row such
  // that the leftmost slot (Banking) ends up at viewport x ≈ -1, the raw
  // lookup would say "Pay (idx 2) is under Banking" because Pay's page-range
  // is at viewport [-425, 0]. But Pay isn't actually VISIBLE — it's off-screen
  // left. User direction: "when Valentino is not on the screen, the leftmost/
  // rightmost edge icons should be grey [standard]". Clamping the slot center
  // to the visible viewport range fixes this — off-screen slots inherit the
  // variant of whichever visible page they're "edge-touching".
  const updateVariant = () => {
    if (!slotRef.current) return;
    const navOffset = navX ? navX.get() : 0;
    const pagerOffset = pagerX ? pagerX.get() : 0;
    const rawCenterX = itemCenter + navOffset;
    // Clamp to visible viewport so off-screen slots inherit the visible
    // page's variant (FX53).
    const clampedCenterX = Math.max(0, Math.min(PHONE_WIDTH - 1, rawCenterX));
    const idx = Math.floor((clampedCenterX - pagerOffset) / PHONE_WIDTH);
    const clampedIdx = Math.max(0, Math.min(pages.length - 1, idx));
    const variant = pages[clampedIdx]?.variant === 'dark' ? 'immersive' : 'standard';
    if (slotRef.current.getAttribute('data-slot-variant') !== variant) {
      slotRef.current.setAttribute('data-slot-variant', variant);
    }
  };

  useMotionValueEvent(navX, 'change', updateVariant);
  useMotionValueEvent(pagerX, 'change', updateVariant);
  // R23 fix-it-2-cont-16: useLayoutEffect runs SYNCHRONOUSLY before paint, so
  // the data-slot-variant attribute is updated before the browser renders the
  // new layout. With async useEffect there was a one-frame gap where the new
  // layout was painted with the OLD variant attribute — visible as the "last
  // icon changes slightly after the page settled" lag.
  useLayoutEffect(updateVariant, [itemCenter, isActive, isCommitted]);

  return (
    <button
      ref={slotRef}
      className="slice-bnav-slot"
      data-pod={pod}
      data-state={isActive ? 'active' : 'inactive'}
      data-slot-variant="standard"
      onClick={() => onTap(pod)}
      aria-label={LABELS[pod]}
      aria-current={isActive ? 'page' : undefined}
      style={{ width, height: width }}
    >
      <div className="slice-bnav-circle-wrap">
        {showPaySpecial ? (
          <PayCenter />
        ) : (
          <div className="slice-bnav-circle" style={{ width, height: width }}>
            <span className="slice-bnav-glyph slice-bnav-glyph--inactive">
              {pod === 'banking' ? (
                <span className="slice-bnav-balance">{balance}</span>
              ) : (
                <InactiveGlyph size={24} />
              )}
            </span>
            {ActiveGlyph && (
              <span className="slice-bnav-glyph slice-bnav-glyph--active">
                <ActiveGlyph size={32} />
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}

const SPRING = { type: 'spring', stiffness: 320, damping: 32, mass: 0.85 };

export default function BottomNav({
  active,
  visuallyActive: visuallyActiveProp,
  onChange,
  onVisualChange,
  balance = '₹3K',
  pagerX,
  pages = [],
}) {
  const [internalVisual, setInternalVisual] = useState(active);
  const visuallyActive = visuallyActiveProp ?? internalVisual;
  const setVisuallyActive = onVisualChange ?? setInternalVisual;

  const x = useMotionValue(targetXFor(visuallyActiveProp || active, active));
  const isDraggingRef = useRef(false);

  // R23 fix-it-2-cont-20 (revert): simple SPRING-on-everything model. Previous
  // tap-pending + drag-vs-commit branching made the nav feel disjointed. Now:
  // any external change to visualActive or active animates the nav row with a
  // spring. The Pager itself still snaps instantly (FX55) so the SCREEN is
  // instant; only the nav row gets the slide. Single useEffect, single
  // animation kind.
  useEffect(() => {
    if (isDraggingRef.current) return;
    animate(x, targetXFor(visuallyActive, active), SPRING);
    if (!visuallyActiveProp) setInternalVisual(active);
  }, [visuallyActiveProp, active]); // eslint-disable-line react-hooks/exhaustive-deps

  const lastEmittedRef = useRef(active);
  useEffect(() => { lastEmittedRef.current = active; }, [active]);

  useMotionValueEvent(x, 'change', (currentX) => {
    if (!isDraggingRef.current) return;
    // Find which item's center is closest to CONTAINER_CENTER under currentX
    const { items } = getLayout(visuallyActive, active);
    let bestPod = items[0].pod;
    let bestDist = Infinity;
    items.forEach((it) => {
      const viewportCenter = it.center + currentX;
      const dist = Math.abs(viewportCenter - CONTAINER_CENTER);
      if (dist < bestDist) {
        bestDist = dist;
        bestPod = it.pod;
      }
    });
    if (bestPod !== lastEmittedRef.current) {
      lastEmittedRef.current = bestPod;
      setVisuallyActive(bestPod);
    }
  });

  const handleDragStart = () => { isDraggingRef.current = true; };
  const handleDragEnd = () => {
    isDraggingRef.current = false;
    if (visuallyActive !== active) {
      onChange(visuallyActive);
    } else {
      animate(x, targetXFor(active, active), SPRING);
    }
  };

  // Bounds: row.x at extremes (banking-active or activity-active layouts)
  const maxX = targetXFor('banking', active);
  const minX = targetXFor('activity', active);

  const { items, totalWidth } = getLayout(visuallyActive, active);
  const isImmersive = active === 'pay';

  return (
    <nav
      className="slice-bnav"
      data-variant={isImmersive ? 'immersive' : 'standard'}
      aria-label="Pod navigation"
    >
      <div className="slice-bnav-content">
        <div className="slice-bnav-viewport">
          <motion.div
            className="slice-bnav-row"
            drag="x"
            dragConstraints={{ left: minX, right: maxX }}
            dragElastic={0.08}
            dragMomentum={false}
            style={{
              x,
              width: totalWidth,
              gap: GAP,
            }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {items.map((it) => (
              <Slot
                key={it.pod}
                pod={it.pod}
                width={it.width}
                itemCenter={it.center}
                isActive={visuallyActive === it.pod}
                isCommitted={active === it.pod}
                onTap={onChange}
                balance={balance}
                navX={x}
                pagerX={pagerX}
                pages={pages}
              />
            ))}
          </motion.div>
        </div>
        <div className="slice-bnav-gesture" aria-hidden="true">
          <div className="slice-bnav-gesture-bar" />
        </div>
      </div>
    </nav>
  );
}
