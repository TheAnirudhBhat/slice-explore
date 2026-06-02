// Root: iPhone shell + fixed-overlay status bar (text re-tints per element as
// pages slide under it) + dynamic island (hardware chrome) + page pager + bottom nav.
//
// R23 fix-it pass:
//   • Phone shell rock-solid centered via position:fixed + 50/50 + translate(-50%,-50%)
//   • Banking + Explore page bg → slate-10 so 0.05 alpha card shadows actually show

import React, { useEffect, useState } from 'react';
import { useMotionValue, motion, AnimatePresence } from 'framer-motion';
import BottomNav from './components/BottomNav.jsx';
import MotionStatusBar from './components/StatusBar.jsx';
import { MoonIcon, BulbIcon } from './icons/ThemeIcons.jsx';
import Pager from './components/Pager.jsx';
import BankingL0 from './pods/banking/L0.jsx';
import PaymentsL0 from './pods/payments/L0_valentinoHome.jsx';
import ActivityL0 from './pods/activity/L0.jsx';
import ExploreL0 from './pods/explore/L0.jsx';
import CreditL0 from './pods/credit/L0.jsx';
import ProfileL1 from './pods/profile/L1.jsx';
import TxnDetailL1 from './pods/activity/TxnDetailL1.jsx';
import AppSettingsL1 from './pods/profile/AppSettingsL1.jsx';
import L1Stack from './components/L1Stack.jsx';
import { ThemeContext } from './theme-context.js';

// L1 registry — name → component or { Component, slideFrom }. Each L0 calls
// `useL1().push(name, props)` to open an L1; L1 components receive `onClose`
// to dismiss themselves. Profile slides up from BOTTOM (identity sheet);
// txnDetail slides from RIGHT (canonical L1 push).
const L1_REGISTRY = {
  profile: { Component: ProfileL1, slideFrom: 'bottom' },
  txnDetail: { Component: TxnDetailL1, slideFrom: 'right' },
  appSettings: { Component: AppSettingsL1, slideFrom: 'right' },
};

const PODS = ['banking', 'explore', 'pay', 'credit', 'activity'];

// Page bgs. Pure WHITE for every non-immersive pod — slice has no gray surfaces.
// Pay alone is the V-500 immersive surface.
const PAGE_BG = {
  banking: 'var(--page-bg)',
  explore: 'var(--page-bg)',
  pay: 'var(--brand-bg)', // Valentino immersive — V-500 light, #090B0C dark (Figma Background/Brand)
  credit: 'var(--page-bg)',
  activity: 'var(--page-bg)',
};

const STATUS_VARIANT = {
  banking: 'light',
  explore: 'light',
  pay: 'dark',
  credit: 'light',
  activity: 'light',
};

// Theme-switch reveal — CANONICAL from Figma "App visual fix" node 3309:13267.
// A full-screen Valentino-gradient cover carries the DESTINATION celestial
// illustration (moon → dark, sun → light) + a "Switching to … mode" caption,
// holds briefly so it reads, then slides off in the reveal direction (up = dark
// fills from the bottom; down = light fills from the top). Gradient stops + caption
// type + the two SVGs are pulled verbatim from the canonical transition frames.
// Theme-switch reveal — EXACT canonical gradient (Figma 4586:10407). A TALL
// gradient rectangle (3× screen) SLIDES top→bottom. BOTH ends are 0 OPACITY: the
// leading (bottom) end is the blue-violet Valentino #9341FF at 0 opacity → #621FFF
// (semi) → SOLID target colour through the middle → 0-opacity target at the
// trailing (top) end. The glow is blue-violet (NOT magenta/pink) and ramps
// GRADUALLY, so there is NO hard edge and the slide reads very smooth (user-
// directed). It slides until the solid middle covers the screen and PAUSES
// (all-target-colour; destination icon + type-on caption shown; data-theme flips
// behind it), then eases on down and exits. Same direction both ways.
const REVEAL_SLIDE = {
  toDark: 'linear-gradient(to top, rgba(147,65,255,0) 2%, rgba(98,31,255,0.4) 18%, #090B0C 30%, #090B0C 70%, rgba(9,11,12,0) 96%)',
  toLight: 'linear-gradient(to top, rgba(147,65,255,0) 2%, rgba(98,31,255,0.4) 18%, #FFFFFF 30%, #FFFFFF 70%, rgba(255,255,255,0) 96%)',
};
const REVEAL_ICON = { toDark: '/assets/theme_moon.svg', toLight: '/assets/theme_sun.svg' };
const REVEAL_LABEL = { toDark: 'Switching to dark mode', toLight: 'Switching to light mode' };
const REVEAL_TEXT = { toDark: 'rgba(255,255,255,0.95)', toLight: 'rgba(0,0,0,0.9)' }; // caption over the solid fill

// R24 cont-13: map from pod → component constructor (not pre-instantiated JSX)
// so we can hand each L0 a per-pod `onScrollChange` callback at render time.
// The callback lifts the L0's scroll state up to App.jsx so the 54px status
// reserve sitting ABOVE the L0 can also paint white when the L0 is scrolled.
const PAGES_BY_POD = {
  banking: BankingL0,
  explore: ExploreL0,
  pay: PaymentsL0,
  credit: CreditL0,
  activity: ActivityL0,
};

// Theme-switch caption types on letter-by-letter (per user: "text type animation
// on 'switching to…'"). Opacity stagger — every char pre-occupies its space so the
// centred line never jitters as it reveals. delayChildren waits for the overlay to
// cover; staggerChildren paces the type-on.
function TypeCaption({ text, color, delay = 0.4 }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { delayChildren: delay, staggerChildren: 0.032 } } }}
      style={{
        fontFamily: 'Rubik, sans-serif',
        fontWeight: 400,
        fontSize: 16,
        lineHeight: '24px',
        letterSpacing: '0.32px',
        textAlign: 'center',
        maxWidth: 240,
        color,
      }}
    >
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={{ duration: 0.18 }}
          style={{ whiteSpace: 'pre' }}
        >
          {ch}
        </motion.span>
      ))}
    </motion.div>
  );
}

// Dev control: small bottom-left toggle that flips the proto between light/dark
// (sets data-theme on the stage). Sun in dark (tap → light), moon in light
// (tap → dark). White pill so it reads as slice chrome on the white stage.
function ThemeToggle({ theme, onToggle }) {
  const dark = theme === 'dark';
  return (
    <button
      onClick={onToggle}
      aria-label={dark ? 'switch to light mode' : 'switch to dark mode'}
      style={{
        position: 'fixed',
        left: 20,
        bottom: 20,
        zIndex: 100,
        width: 44,
        height: 44,
        borderRadius: 100,
        background: '#FFFFFF',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0px 4px 16px rgba(0,0,0,0.12)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        // Tertiary icon. The toggle pill is always white (it lives on the white
        // proto stage, which doesn't theme), so this is the on-light tertiary value
        // — NOT var(--text-tertiary), which would flip to white-on-white in dark.
        color: 'rgba(0,0,0,0.5)',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* moon in light (tap → dark), bulb in dark (tap → light) — DLS Objects icons */}
      {dark ? <BulbIcon /> : <MoonIcon />}
    </button>
  );
}

// Device frame = the iPhone 17 Pro Silver bezel PNG exported from Figma
// (file cMITYopAqGfe4JC6gIkrIE, node 8402:7). The art is 450×920 with a
// TRANSPARENT screen cut-out inset ~24px L/R and ~23px T/B (measured from the
// PNG alpha) → a 402×874 screen. Rim + Dynamic Island + side buttons are baked
// into the PNG; screen content shows through the transparent cut-out.
const PHONE_OUTER_WIDTH = 450; // bezel art width
const PHONE_OUTER_HEIGHT = 920; // bezel art height
const PHONE_WIDTH = 402; // screen cut-out width
const PHONE_HEIGHT = 874; // screen cut-out height
const SCREEN_INSET_LEFT = 24; // rim+bezel thickness L/R (from PNG alpha)
const SCREEN_INSET_TOP = 23; // rim+bezel thickness T/B
const SCREEN_RADIUS = 50; // screen corner radius

function PhoneFrame({ children, bare = false }) {
  // bare = full-bleed device mode (mobile / installed PWA): no bezel, no inset or
  // corner radius — this 402×874 screen IS the viewport (the wrapper scales it to
  // COVER the device), and the real OS status bar + home indicator show over it.
  if (bare) {
    return (
      <div
        style={{
          position: 'relative',
          width: PHONE_WIDTH,
          height: PHONE_HEIGHT,
          overflow: 'hidden',
          background: 'var(--page-bg)',
          flexShrink: 0,
        }}
      >
        {children}
      </div>
    );
  }
  return (
    <div style={{ position: 'relative', width: PHONE_OUTER_WIDTH, height: PHONE_OUTER_HEIGHT, flexShrink: 0 }}>
      {/* Screen content sits in the transparent cut-out, BEHIND the bezel art. */}
      <div
        style={{
          position: 'absolute',
          top: SCREEN_INSET_TOP,
          left: SCREEN_INSET_LEFT,
          width: PHONE_WIDTH,
          height: PHONE_HEIGHT,
          borderRadius: SCREEN_RADIUS,
          overflow: 'hidden',
          background: 'var(--page-bg)',
          zIndex: 1,
        }}
      >
        {children}
      </div>
      {/* iPhone 17 Pro Silver bezel from Figma — rim + Dynamic Island + side
         buttons baked in. drop-shadow follows the device silhouette (alpha) so
         it floats on the white stage. pointer-events:none → taps pass through. */}
      <img
        src="/assets/iphone17_bezel.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          pointerEvents: 'none',
          filter: 'drop-shadow(0px 20px 50px rgba(0,0,0,0.18)) drop-shadow(0px 4px 14px rgba(0,0,0,0.10))',
        }}
      />
    </div>
  );
}

// R23 fix-it-2-cont-9 (corrected): phone stays at native 440×952 or smaller
// (never upscaled). The user's "proto page should be as big as the view area"
// refers to the OUTER STAGE — the black background that fills the browser
// viewport — not the phone itself. The stage already fills the viewport via
// position:fixed inset:0. Phone scales DOWN to fit if browser is smaller; at
// browser ≥ 440×952 the phone renders at native and the black stage extends
// to all four edges around it.
function useFitScale(targetWidth, targetHeight, padding = 8, cover = false) {
  const compute = () => {
    if (typeof window === 'undefined') return 1;
    // Prefer visualViewport (the truly-visible area on iOS, shrinks/grows with the
    // Safari toolbar) so the phone always fits without the bottom being clipped.
    const vv = window.visualViewport;
    const w = Math.max(1, (vv?.width ?? window.innerWidth) - padding * 2);
    const h = Math.max(1, (vv?.height ?? window.innerHeight) - padding * 2);
    // cover = FILL the viewport (full-bleed mobile, may exceed 1); contain = fit
    // the phone inside the stage (desktop shell, capped at 1 so it never upscales).
    const s = cover
      ? Math.max(w / targetWidth, h / targetHeight)
      : Math.min(1, w / targetWidth, h / targetHeight);
    return s > 0.05 ? s : 1;
  };
  const [scale, setScale] = useState(compute);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScale(compute()));
    };
    update();
    window.addEventListener('resize', update);
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(update);
      ro.observe(document.documentElement);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', update);
      if (ro) ro.disconnect();
    };
  }, [targetWidth, targetHeight, padding, cover]);
  return scale;
}

// Full-bleed device mode: true on a phone-sized viewport OR when launched as an
// installed PWA (Add to Home Screen → display-mode: standalone). Drives the
// bezel-less, OS-chrome render in App.
function useIsMobile() {
  const query = '(max-width: 600px), (display-mode: standalone)';
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches;
  const [mobile, setMobile] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMobile(get());
    mq.addEventListener?.('change', on);
    window.addEventListener('resize', on);
    return () => {
      mq.removeEventListener?.('change', on);
      window.removeEventListener('resize', on);
    };
  }, []);
  return mobile;
}

const PAGES_META = PODS.map((pod) => ({ pod, variant: STATUS_VARIANT[pod] }));

// EXTENSION SEAM (R24 cont-35): a derived project wraps this App and injects its
// feature WITHOUT forking — so it inherits the whole shell, theme, and every pod
// live. Props (all default to the standalone skill proto, so the skill itself is
// unchanged):
//   • extraL1            — extra L1 routes merged into the registry ({ name: {Component, slideFrom} })
//   • exploreExtraCards  — extra full-width cards injected into Explore (after Recharge & bills)
//   • initialPod         — landing pod (default 'pay' = Valentino home)
// Usage (project App.jsx): <App extraL1={{insurance:{Component,slideFrom:'right'}}}
//   exploreExtraCards={[<InsuranceEntryCard/>]} initialPod="explore" />
// NOTE: to OWN a whole pod (swap its L0), a project does that in ITS OWN wrapper by
// materialising/unlinking the component — NOT via a prop on the upstream skill proto.
export default function App({ extraL1 = {}, exploreExtraCards = [], initialPod = 'pay' } = {}) {
  const [active, setActive] = useState(initialPod);
  const [visuallyActive, setVisuallyActive] = useState(initialPod);
  const [theme, setTheme] = useState('light'); // light | dark — flips data-theme on the stage
  // Theme-switch reveal: flip data-theme instantly, then play the canonical
  // gradient-cover reveal (see REVEAL_* above) — moon/"to dark" slides up, sun/
  // "to light" slides down. `dir` drives the gradient, icon, caption + direction.
  const [themeAnim, setThemeAnim] = useState(null);
  const [l1Open, setL1Open] = useState(false);
  // R24 cont-13: per-pod scroll state lifted up so the 54px status reserve
  // (sitting OUTSIDE each L0 in App.jsx) can paint white when that L0 is
  // scrolled. Without this, the cards scrolling under the AppBar visually
  // bled into the transparent status reserve above it (drop shadows showed
  // through). Now reserve + AppBar both transition to white together.
  const [scrolledByPod, setScrolledByPod] = useState({});
  const handlePodScroll = (pod, isScrolled) => {
    setScrolledByPod((prev) =>
      prev[pod] === isScrolled ? prev : { ...prev, [pod]: isScrolled }
    );
  };

  // Shared motion value for the page pager's x-translation. Drives:
  // (1) the Pager itself; (2) the StatusBar overlay's per-element color.
  const pagerX = useMotionValue(-PODS.indexOf(initialPod) * PHONE_WIDTH);

  const activeIndex = PODS.indexOf(active);
  // In dark theme every pod surface is dark → force the "dark" status/nav variant
  // (light icons + white-alpha nav medallions) across all slots.
  const [exploreDarkTop, setExploreDarkTop] = useState(false);
  const pagesMeta = theme === 'dark' ? PODS.map((p) => ({ pod: p, variant: 'dark' })) : PAGES_META;
  // Status-bar-only variant: Explore reports when a DARK bleed hero (F/N/L) fills
  // the top, so the time/icons go white over it. The NAV keeps pagesMeta (it sits
  // at the BOTTOM over the white page body, not the hero), so this override is used
  // ONLY by MotionStatusBar — flipping pagesMeta would wrongly re-style the nav too.
  const statusPagesMeta = theme === 'dark'
    ? pagesMeta
    : PODS.map((p) => ({ pod: p, variant: (p === 'explore' && exploreDarkTop) ? 'dark' : STATUS_VARIANT[p] }));
  const fitScale = useFitScale(PHONE_OUTER_WIDTH, PHONE_OUTER_HEIGHT);
  // Full-bleed device mode (phone viewport / installed PWA): scale the 402×874
  // SCREEN to COVER the viewport (no bezel, no white stage) so the proto runs
  // edge-to-edge with the real OS status bar + home indicator. Desktop keeps the
  // bezel + contain-fit. (cont-38)
  const isMobile = useIsMobile();
  const coverScale = useFitScale(PHONE_WIDTH, PHONE_HEIGHT, 0, true);

  const handlePageIndexChange = (idx) => {
    const newPod = PODS[idx];
    if (newPod !== visuallyActive) setVisuallyActive(newPod);
  };
  const handlePageCommit = (idx) => {
    const newPod = PODS[idx];
    setActive(newPod);
    setVisuallyActive(newPod);
  };
  const handleNavChange = (pod) => {
    setActive(pod);
    setVisuallyActive(pod);
  };
  const handleNavVisualChange = (pod) => {
    setVisuallyActive(pod);
  };
  const handleThemeToggle = () => {
    if (themeAnim) return; // ignore taps while a switch is mid-flight
    const goingDark = theme !== 'dark';
    setThemeAnim({ dir: goingDark ? 'toDark' : 'toLight', id: Date.now() });
    // Flip the mode during the PAUSE (solid middle fully covers the screen) so the
    // exit slide reveals the already-flipped new theme.
    window.setTimeout(() => setTheme(goingDark ? 'dark' : 'light'), 1700);
  };

  // R23 fix-it-2-cont-10: simplified to 2-div scaffold. Outer is the App
  // container — width:100vw height:100vh — visibly the full browser viewport.
  // Inner is the phone chassis at native 440×952 with transform-scale around
  // its own center. Flex centers the un-scaled layout box; visual phone
  // appears centered. App-pointed agentation feedback now correctly identifies
  // the OUTER as width-responsive (100vw).

  return (
    <div
      data-theme={theme}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        // dvh = the VISIBLE viewport on iOS. 100vh is the larger "toolbar-hidden"
        // height, so on a real iPhone the phone's bottom (nav + home indicator) got
        // pushed behind the Safari toolbar and looked cut off. dvh tracks what's
        // actually visible. (cont-38: iPhone bottom-safe-area cutoff fix.)
        height: '100dvh',
        // Desktop stage = white (phone floats on it). Full-bleed mobile = page bg,
        // so the cover-scaled screen blends edge-to-edge (no white sliver).
        background: isMobile ? 'var(--page-bg)' : '#FFFFFF',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: isMobile ? PHONE_WIDTH : PHONE_OUTER_WIDTH,
          height: isMobile ? PHONE_HEIGHT : PHONE_OUTER_HEIGHT,
          transform: `scale(${isMobile ? coverScale : fitScale})`,
          transformOrigin: 'center center',
          flexShrink: 0,
        }}
      >
        <PhoneFrame bare={isMobile}>
          {/* ThemeContext lets L1 screens (App Settings "Dark mode" switch) trigger
             the same theme-switch transition as the dev toggle. */}
          <ThemeContext.Provider value={{ theme, toggleTheme: handleThemeToggle }}>
          {/* L1Stack provides useL1() to all descendants. L1 overlays render
             above the L0 pager via AnimatePresence + slide-in motion. */}
          <L1Stack registry={{ ...L1_REGISTRY, ...extraL1 }} onOpenChange={setL1Open}>
            {/* Horizontal page pager — each page renders FULL HEIGHT (no per-page
               status bar). The slide edge appears top-to-bottom because pages
               span the full phone screen. */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10,
                overflow: 'hidden',
              }}
            >
              <Pager
                activeIndex={activeIndex}
                pageCount={PODS.length}
                pageWidth={PHONE_WIDTH}
                externalX={pagerX}
                onIndexChange={handlePageIndexChange}
                onCommit={handlePageCommit}
              >
                {PODS.map((pod) => {
                  const PodPage = PAGES_BY_POD[pod];
                  const podScrolled = !!scrolledByPod[pod];
                  // Pay (V-500 immersive) keeps a transparent reserve so the
                  // V-500 page bg shows through. Non-Pay pods now fill the reserve
                  // with the page bg ALWAYS (not just on scroll) — at rest the
                  // transparent reserve left a thin see-through strip above the
                  // app bar on the scrolling pods (Explore/Activity).
                  const reserveBg = pod === 'pay' ? 'transparent' : 'var(--page-bg)';
                  void podScrolled;
                  return (
                    <div
                      key={pod}
                      style={{
                        width: '100%',
                        height: '100%',
                        background: PAGE_BG[pod],
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* 54px status-bar reserve — paints white on scroll for
                         non-Pay pods so the cards scrolling under the AppBar
                         don't visibly bleed past it. */}
                      <div
                        style={{
                          // Desktop/web: flat 54px to match the MotionStatusBar
                          // overlay. Mobile (incl. iOS standalone PWA): an 88px floor
                          // PLUS env+28. On the installed PWA env(safe-area-inset-top)
                          // measured as ~0 (it does NOT resolve reliably there), so the
                          // FIXED FLOOR carries the gap: 88 − ~59px Dynamic Island ≈ a
                          // 29px gap below the status bar, matching the canonical airy
                          // header spacing. env+28 only takes over if a device reports a
                          // larger inset. MUST stay in lockstep with the explore-pod
                          // bleed pull (explore/L0.jsx) so bleed heroes still reach y=0.
                          height: isMobile
                            ? 'max(44px, env(safe-area-inset-top, 0px))'
                            : '54px',
                          flexShrink: 0,
                          background: reserveBg,
                          // Instant (no transition): must opacify with the AppBar so
                          // cards never bleed through the reserve mid-scroll. (cont-38)
                        }}
                      />
                      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                        <PodPage
                          onScrollChange={(s) => handlePodScroll(pod, s)}
                          {...(pod === 'explore' ? { extraCards: exploreExtraCards, onDarkTopChange: setExploreDarkTop } : {})}
                        />
                      </div>
                    </div>
                  );
                })}
              </Pager>
            </div>

            {/* Fixed status bar overlay — text/icons stay put, recolor per-element
               based on which page is under each element. HIDDEN in full-bleed device
               mode: the real OS status bar shows over the screen's top reserve. */}
            {!isMobile && (
              <MotionStatusBar
                pagerX={pagerX}
                pages={statusPagesMeta}
                pageWidth={PHONE_WIDTH}
                forceVariant={theme === 'dark' ? 'dark' : l1Open ? 'light' : null}
              />
            )}

            {/* Bottom nav floats above pager — pagerX + pages shared so each
               nav slot can compute its own variant based on what's under it */}
            <BottomNav
              active={active}
              visuallyActive={visuallyActive}
              onChange={handleNavChange}
              onVisualChange={handleNavVisualChange}
              balance="₹3K"
              pagerX={pagerX}
              pages={pagesMeta}
            />

            {/* Theme-switch reveal (canonical Figma 4586:10407 / 3315:7279). A TALL
               (3× screen) gradient overlay SLIDES top→bottom: Valentino glow leading
               edge → solid target middle → transparent trailing edge. It slides in
               until the solid middle covers the screen, PAUSES (destination icon +
               type-on caption shown; data-theme flips behind it), then eases on down
               and exits off the bottom, revealing the new theme. */}
            <AnimatePresence>
              {themeAnim && (
                <motion.div
                  key={themeAnim.id}
                  style={{ position: 'absolute', inset: 0, zIndex: 999, pointerEvents: 'none', overflow: 'hidden' }}
                >
                  {/* sliding overlay rectangle: enter (to -33.3% = solid covers) →
                     PAUSE → exit (to +33.3% = top edge at screen bottom) */}
                  <motion.div
                    initial={{ y: '-100%' }}
                    animate={{ y: ['-100%', '-33.333%', '-33.333%', '33.333%'] }}
                    transition={{ duration: 3.2, times: [0, 0.26, 0.64, 1], ease: 'easeInOut' }}
                    onAnimationComplete={() => setThemeAnim(null)}
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 0,
                      height: '300%',
                      background: REVEAL_SLIDE[themeAnim.dir],
                    }}
                  />
                  {/* centre destination icon (no morph) + type-on caption — shown
                     only during the pause, while the solid middle covers the screen */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0, 1, 1, 0] }}
                    transition={{ duration: 3.2, times: [0, 0.22, 0.3, 0.62, 0.68], ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 24,
                    }}
                  >
                    <img
                      src={REVEAL_ICON[themeAnim.dir]}
                      alt=""
                      aria-hidden="true"
                      style={{ width: 80, height: 80, objectFit: 'contain', display: 'block' }}
                    />
                    <TypeCaption text={REVEAL_LABEL[themeAnim.dir]} color={REVEAL_TEXT[themeAnim.dir]} delay={0.95} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </L1Stack>
          </ThemeContext.Provider>
        </PhoneFrame>
      </div>
      {/* Dev-only control — hidden in full-bleed device/mobile view so it reads as a
         real app (toggle theme there via App Settings → Dark mode). */}
      {!isMobile && <ThemeToggle theme={theme} onToggle={handleThemeToggle} />}
    </div>
  );
}
