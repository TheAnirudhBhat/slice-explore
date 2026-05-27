import React, { useState } from 'react';
import ReactDOM from 'react-dom';


    /* ============= TYPOGRAPHY ============= */
    const T = {
      h2: { fontSize: 24, lineHeight: '32px', fontWeight: 500, letterSpacing: '0.48px', color: 'rgba(0,0,0,0.9)' },
      h3: { fontSize: 20, lineHeight: '24px', fontWeight: 500, letterSpacing: '0.40px', color: 'rgba(0,0,0,0.9)' },
      h4: { fontSize: 16, lineHeight: '20px', fontWeight: 500, letterSpacing: '0.32px', color: 'rgba(0,0,0,0.9)' },
      body: { fontSize: 16, lineHeight: '24px', fontWeight: 400, letterSpacing: '0.32px', color: 'rgba(0,0,0,0.9)' },
      bodySm: { fontSize: 14, lineHeight: '20px', fontWeight: 400, letterSpacing: '0.28px', color: 'rgba(0,0,0,0.9)' },
      caption: { fontSize: 12, lineHeight: '16px', fontWeight: 400, letterSpacing: '0.24px', color: 'rgba(0,0,0,0.5)' },
      meta: { fontSize: 10, lineHeight: '12px', fontWeight: 400, letterSpacing: '0.40px', color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase' },
      btnNm: { fontSize: 16, lineHeight: '24px', fontWeight: 500, letterSpacing: '0.32px' },
      btnSm: { fontSize: 14, lineHeight: '20px', fontWeight: 500, letterSpacing: '0.28px' },
      display: { fontSize: 40, lineHeight: '48px', fontWeight: 500, letterSpacing: '-0.4px', color: 'rgba(0,0,0,0.9)' },
    };
    const CARD_SHADOW = '0px 2px 32px 0px rgba(0,0,0,0.05)';
    const CARD_BORDER = '1px solid rgba(0,0,0,0.05)';

    /* ============= CHROME ============= */

    const StatusBar = ({ dark }) => (
      <div className="status-bar" style={{
        color: dark ? '#FFFFFF' : '#000',
        /* Match the app-bar fill/title transition so the whole top
           chrome flips together when the kiosk crosses the threshold. */
        transition: 'color 50ms linear',
      }}>
        <span className="sb-time">9:41</span>
        <span className="sb-right">
          <svg width="18" height="11" viewBox="0 0 18 11" fill="none">
            <rect x="0" y="7" width="3" height="4" rx="0.8" fill="currentColor" />
            <rect x="4.5" y="5" width="3" height="6" rx="0.8" fill="currentColor" />
            <rect x="9" y="2.5" width="3" height="8.5" rx="0.8" fill="currentColor" />
            <rect x="13.5" y="0" width="3" height="11" rx="0.8" fill="currentColor" />
          </svg>
          <svg width="16" height="13" viewBox="0 -2 16 13" fill="currentColor" style={{ overflow: 'visible' }}>
            <path d="M8 11 5.6 8.6a3.4 3.4 0 0 1 4.8 0L8 11z" />
            <path d="M11.6 6.4 13.4 4.6A7.4 7.4 0 0 0 2.6 4.6l1.8 1.8a4.8 4.8 0 0 1 7.2 0z" />
            <path d="M14.6 3.4 16 2A10.6 10.6 0 0 0 0 2l1.4 1.4a8.6 8.6 0 0 1 13.2 0z" />
          </svg>
          <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 2 }}>
            <span style={{
              width: 25, height: 12, position: 'relative',
              border: '1px solid currentColor', opacity: 0.7, borderRadius: 3.5,
              padding: 1.5, boxSizing: 'border-box',
            }}>
              <span style={{ display: 'block', height: '100%', width: '78%', background: 'currentColor', borderRadius: 1.5 }} />
            </span>
            <span style={{
              display: 'inline-block', width: 1.5, height: 4,
              background: 'currentColor', opacity: 0.7, borderRadius: '0 1px 1px 0', marginLeft: 1
            }} />
          </span>
        </span>
      </div>
    );

    /* App bar — transparent at scrollTop=0 when `transparent` prop is set (e.g. FY_A active),
       so the carousel's gradient shows through (including the next-card peek colour on the right).
       Snaps to opaque white + Below shadow as soon as the user scrolls, so content can't bleed past it. */
    /* Bar lives outside the scroll container (position: absolute) so iOS rubber-band can't
       move it. The white fill + DLS 'Below' shadow are flipped via ref the moment
       scrollTop > 0 — no React state, no transition, instant. */
    /* AppBar — `scrolled` is React state (not just a ref-mutated
       inline style) so parent re-renders during a page swipe don't
       reset the visual scroll state mid-tween. Imperative
       `setScrolled` is preserved as a stable callback so existing
       call-sites still work; under the hood it just sets state. */
    const AppBarL0 = React.forwardRef(({ transparent, darkBg }, ref) => {
      const [scrolled, setScrolled] = React.useState(false);
      React.useImperativeHandle(ref, () => ({ setScrolled }), []);
      const opaque = scrolled || !transparent;
      const titleColor = (darkBg && !opaque) ? '#FFFFFF' : 'rgba(0,0,0,0.9)';
      return (
        <div className="app-bar-l0" style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
          paddingTop: 54, height: 54 + 64,
          paddingLeft: 24, paddingRight: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'transparent',
          boxShadow: scrolled ? '0 6px 8px 0 rgba(0,0,0,0.05)' : 'none',
          transition: 'box-shadow 50ms linear',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: '#FFFFFF',
            opacity: opaque ? 1 : 0,
            pointerEvents: 'none', zIndex: 0,
            willChange: 'opacity',
            transition: 'opacity 50ms linear',
          }} />
          <h1 style={{
            ...T.h2, position: 'relative', zIndex: 1,
            color: titleColor,
            transition: 'color 50ms linear',
          }}>Explore</h1>
          <div style={{ width: 56, height: 56, display: 'grid', placeItems: 'center', position: 'relative', zIndex: 1 }}>
            <img src="/assets/avatar_only.png" width={48} height={48} alt=""
              style={{ display: 'block' }} />
          </div>
        </div>
      );
    });

    const BottomNavGradient = () => {
      /* Click anywhere on the nav image opens the debug drawer. We dispatch
         a window event so this component doesn't have to be wired with a prop
         through every parent that uses ScreenShell. */
      const openDebug = () => window.dispatchEvent(new CustomEvent('open-debug-drawer'));
      return (
        /* Wrapper is solid white and extends through iOS home-indicator
           safe area. A short inline band (the previous fix) was leaving a
           1-2px see-through strip below the PNG on mobile when the
           viewport was slightly taller than the wrapper's measured
           height. Painting the wrapper itself white removes the seam
           outright, and `paddingBottom: env(safe-area-inset-bottom)`
           lets the white follow the home indicator on iPhones. */
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          zIndex: 5, pointerEvents: 'none',
          transform: 'translateZ(0)',
        }}>
          {/* The nav PNG has a transparent fade on its top half and
              solid white on its bottom half. We only put white behind
              the BOTTOM 50% so the top fade stays see-through. */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0,
            height: 'calc(50% + env(safe-area-inset-bottom, 0px))',
            background: '#FFFFFF',
          }} />
          <img src="/assets/bottom_nav_v3.png" alt="" onClick={openDebug} style={{
            width: '100%', display: 'block', position: 'relative',
            pointerEvents: 'auto', cursor: 'pointer',
          }} />
          {/* Safe area — overlaps image by 1px to prevent sub-pixel gap */}
          <div style={{
            height: 'calc(env(safe-area-inset-bottom, 0px) + 1px)',
            marginTop: -1,
            background: '#FFFFFF', position: 'relative',
            transform: 'translateZ(0)',
          }} />
        </div>
      );
    };

    /* Full-bleed static page = a reference PNG behind the status bar +
       bottom nav. `topOffset` shifts the image down so the page
       heading clears the status bar; the exposed band is filled by `bg`. */
    const StaticPage = ({ src, bg = '#FFFFFF', alt = '', topOffset = 8 }) => (
      <div style={{ position: 'absolute', inset: 0, background: bg, overflow: 'hidden' }}>
        <img src={src} alt={alt} style={{
          width: '100%', height: 'auto', display: 'block',
          position: 'absolute', top: topOffset, left: 0,
          pointerEvents: 'none', userSelect: 'none',
        }} draggable={false} />
      </div>
    );
    /* DLS Valentino-500 — used for the exposed top band and the iOS
       safe-area fill behind the home bottom nav so the seam to the
       Home poster (which is painted in the same brand magenta) is
       invisible. */
    const HOME_VALENTINO = '#D30AD7';
    const HomePage = () => (
      <StaticPage src="/assets/page_home.png" bg={HOME_VALENTINO} alt="Home — Pay" topOffset={20} />
    );
    const SavingsPage = () => (
      <StaticPage src="/assets/page_savings.png" bg="#FFFFFF" alt="Banking — Savings" />
    );

    /* HorizontalPager — 3 pages side by side; swipe horizontally
       between them. Direction-aware gesture: only initiates a page
       swipe if the touch starts OUTSIDE an inner horizontal scroller
       (each inner carousel has its own scroll container with
       overscroll-behavior: contain so they don't propagate to the
       outer pager). Native CSS scroll-snap handles momentum + edges. */
    /* Each page wrapper gets its own GPU layer + paint containment so
       iOS Safari doesn't re-rasterise on swipe-back (otherwise the
       off-screen page loses its compositor layer and paints after a
       visible ~1s delay on the way back in). */
    /* GPU-layer hint only — `contain: paint` was clipping content that
       legitimately overflows its page bounds (e.g. FY_F's hero bleeds
       up under the app bar via a negative top margin), which on iOS
       Safari caused the bottom fade-to-white to vanish mid-swipe and
       a hard cut to show through. `backface-visibility: hidden` was
       triggering a re-rasterise on mobile when the page swiped back
       into view (app-bar "blink"). Bare `translateZ(0)` is enough to
       keep each page on its own compositor layer. */
    const PAGER_PAGE_STYLE_BASE = {
      height: '100%',
      position: 'relative', flexShrink: 0,
      transform: 'translateZ(0)',
      willChange: 'transform',
    };
    /* Native CSS scroll-snap pager — iOS Safari handles the momentum,
       rubber-band, and snap entirely in the compositor, which is the
       only way this feels truly buttery on mobile. We listen to
       `onScroll` for live fractional progress (used by the bottom-nav
       cross-fade) and read scrollLeft on settle to update activeIndex.
       Programmatic page changes call scrollTo with smooth behavior. */
    const HorizontalPager = ({ pages, activeIndex, onChange, onProgress }) => {
      const trackRef = React.useRef(null);
      const settleTimer = React.useRef(null);
      const programmaticScroll = React.useRef(false);

      /* Sync scroll position to activeIndex (programmatic snap, e.g.
         when a tab is selected externally or on first mount). */
      React.useLayoutEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const target = activeIndex * el.offsetWidth;
        if (Math.abs(el.scrollLeft - target) < 1) return;
        programmaticScroll.current = true;
        /* First mount: jump instantly so the initial page is correct
           without a scroll animation. Subsequent: smooth snap. */
        const isInitial = el.scrollLeft === 0 && activeIndex !== 0;
        el.scrollTo({ left: target, behavior: isInitial ? 'auto' : 'smooth' });
        clearTimeout(settleTimer.current);
        settleTimer.current = setTimeout(() => { programmaticScroll.current = false; }, 500);
      }, [activeIndex]);

      const onScroll = (e) => {
        const el = e.currentTarget;
        const w = el.offsetWidth || 360;
        if (onProgress) onProgress(el.scrollLeft / w);
        if (programmaticScroll.current) return;
        /* Wait for the scroll to settle, then commit the new index. */
        clearTimeout(settleTimer.current);
        settleTimer.current = setTimeout(() => {
          const idx = Math.round(el.scrollLeft / w);
          if (idx !== activeIndex) onChange(idx);
        }, 120);
      };

      React.useEffect(() => () => clearTimeout(settleTimer.current), []);

      return (
        <div ref={trackRef} onScroll={onScroll} style={{
          position: 'absolute', inset: 0,
          overflowX: 'auto', overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }} className="scrollbar-hide">
          <div style={{
            display: 'flex',
            width: `${pages.length * 100}%`,
            height: '100%',
          }}>
            {pages.map((Page, i) => (
              <div key={i} style={{
                ...PAGER_PAGE_STYLE_BASE,
                width: `${100 / pages.length}%`,
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
              }}>
                {Page}
              </div>
            ))}
          </div>
        </div>
      );
    };

    const ScreenShell = ({ children, transparentAppBar, darkBg, scrollThreshold = 0, onPastThreshold }) => {
      const barRef = React.useRef(null);
      const lastScrolled = React.useRef(false);
      const onScroll = (e) => {
        /* `scrollThreshold` defers the "scrolled" state until the user
           has scrolled past a specific pixel (e.g. past the FY_L hero
           before the app bar takes over). For everything else it's 0
           and behaves like the original "any scroll → opaque" rule. */
        const past = e.currentTarget.scrollTop > scrollThreshold;
        if (past !== lastScrolled.current) {
          lastScrolled.current = past;
          barRef.current && barRef.current.setScrolled(past);
          onPastThreshold && onPastThreshold(past);
        }
      };
      return (
        <div className="absolute inset-0 bg-white">
          <AppBarL0 ref={barRef} transparent={transparentAppBar} darkBg={darkBg} />
          <div className="scrollbar-hide screen-scroll" onScroll={onScroll} style={{
            position: 'absolute', inset: 0,
            paddingTop: 'var(--bar-overlap, 118px)',
            paddingBottom: 200,
            overflowY: 'auto'
          }}>
            {children}
          </div>
          {/* BottomNavGradient now rendered at the phone-screen level
             (outside the pager) so it overlays all 3 pages with one
             instance and doesn't slide with them. */}
        </div>
      );
    };

    /* ============= DLS PRIMITIVES ============= */

    const PagePad = ({ children, style }) => (
      <div style={{ paddingLeft: 24, paddingRight: 24, ...style }}>{children}</div>
    );
    /* Spacing system — single source of truth for section/header gaps. Highlight toggle
       paints every Spacer with a translucent Valentino fill + its pixel value so the
       layout's spacing skeleton is visible. */
    const SpacingCtx = React.createContext({
      gapNone: 24, gapHeaderAbove: 32, gapHeaderBelow: 16, highlight: false,
    });
    const useSpacing = () => React.useContext(SpacingCtx);

    const Spacer = ({ h = 16, label }) => {
      const { highlight } = useSpacing();
      if (!highlight) return <div style={{ height: h }} />;
      return (
        <div style={{
          height: h, position: 'relative',
          background: 'rgba(211, 10, 215, 0.12)',
          pointerEvents: 'none',
        }}>
          {h >= 12 && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Rubik', fontSize: 10, fontWeight: 500, color: '#87068A',
              letterSpacing: '0.4px', textTransform: 'uppercase',
            }}>{label ? `${label} · ${h}` : `${h}`}</div>
          )}
        </div>
      );
    };

    const DividerCtx = React.createContext({ hide: false });

    /* Lets the carousel push its current gradient top-colour up to the app bar so the
       bar is ALWAYS opaque (no fast-scroll bleed) but visually merges with the carousel below. */
    const AppBarBgCtx = React.createContext({ setBg: () => { } });
    const DividerBig = () => {
      const { hide } = React.useContext(DividerCtx);
      if (hide) return <div style={{ height: 16 }} />;
      return <div style={{ height: 8, background: '#F6F9FC', width: '100%' }} />;
    };
    const DividerInset = () => {
      const { hide } = React.useContext(DividerCtx);
      if (hide) return null;
      return <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', marginLeft: 76 }} />;
    };
    const DividerFull = () => {
      const { hide } = React.useContext(DividerCtx);
      if (hide) return null;
      return <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }} />;
    };

    /* Bold header — 32px left, 24 right, 16 top, 16 bottom (per latest spacing direction). */
    /* Headers only hold horizontal padding. Vertical spacing comes from SectionWrap's
       Spacers so it's controlled by a single spacing system. */
    const SectionHeaderBold = ({ title, cta }) => (
      <div style={{
        paddingLeft: 32, paddingRight: 24, lineHeight: '18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* 14px medium — 2pt down from T.h4 (16px). Section titles
           now sit a touch quieter, leaving more room for the
           section's hero card to lead. */}
        <span style={{
          fontFamily: 'Rubik', fontSize: 14, fontWeight: 500,
          lineHeight: '18px', letterSpacing: '0.28px',
          color: 'rgba(0,0,0,0.9)',
        }}>{title}</span>
        {cta && <button className="tap" style={{
          background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
          ...T.btnSm, color: '#D30AD7',
        }}>{cta}</button>}
      </div>
    );
    const SectionHeaderList = ({ title, cta, tag }) => (
      <div style={{
        paddingLeft: 28, paddingRight: 24, lineHeight: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={T.meta}>{title}</span>
        {tag && <span style={{
          fontSize: 8, fontFamily: 'Rubik', fontWeight: 500,
          lineHeight: '10px', letterSpacing: '0.3px',
          color: '#00A63E', background: '#E0F4E8',
          borderRadius: 4, padding: '2px 5px',
        }}>{tag}</span>}
        {cta && (
          /* Chevron-only affordance — quieter than a "View all" label
             at this metadata-sized header. The whole title row already
             reads as a section link, so a single icon is enough. */
          <button className="tap" aria-label={cta} style={{
            background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M9 6l6 6-6 6" stroke="rgba(0,0,0,0.7)" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    );



    /* Section gap = 32 between sections (Spacer 16 + header padding-top 16). No DividerBig.
       Header bottom padding = 16 → 16 between header and section content.
       'None' (In-card): title is handled by the section component itself (injected via inCardTitle prop),
       so SectionWrap just renders the spacer + children. */
    const SectionWrap = ({ title, cta, tag, headerStyle, isFirst, children }) => {
      const { gapNone, gapHeaderAbove, gapHeaderBelow } = useSpacing();
      if (headerStyle === 'None') {
        return <>{!isFirst && <Spacer h={gapNone} label="section" />}{children}</>;
      }
      if (headerStyle === 'List') {
        return (
          <>
            {!isFirst && <Spacer h={gapHeaderAbove} label="section" />}
            <SectionHeaderList title={title} cta={cta} tag={tag} />
            <Spacer h={gapHeaderBelow} label="header→content" />
            {children}
          </>
        );
      }
      return (
        <>
          {!isFirst && <Spacer h={gapHeaderAbove} label="section" />}
          <SectionHeaderBold title={title} cta={cta} />
          <Spacer h={gapHeaderBelow} label="header→content" />
          {children}
        </>
      );
    };

    /* In-card title row — reusable header rendered inside a card by section variants
       when headerStyle is 'In-card'. Returns null if no title provided. */
    const InCardTitle = ({ title }) => {
      if (!title) return null;
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={T.h4}>{title}</span>
        </div>
      );
    };

    const Chevron = ({ color = 'rgba(0,0,0,0.3)' }) => (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
        <path d="M7.5 5l5 5-5 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );

    const TagSubtle = ({ children, intent = 'info' }) => {
      const map = {
        info: { color: '#2B6ACF', bg: '#E6EDF9' },
        positive: { color: '#00A63E', bg: '#E0F4E8' },
        warning: { color: '#C27511', bg: '#FFF3E3' },
        negative: { color: '#CE1D26', bg: '#F9E4E5' },
        main: { color: '#D30AD7', bg: '#FAE2FA' },
        neutral: { color: 'rgba(0,0,0,0.7)', bg: '#F0F4F7' },
      };
      const { color, bg } = map[intent];
      return (
        <span style={{ ...T.btnSm, color, background: bg, padding: '4px 8px', borderRadius: 100, whiteSpace: 'nowrap' }}>
          {children}
        </span>
      );
    };

    const Avatar = ({ size = 40, bg = '#FAE2FA', glyph, asset }) => (
      <div style={{
        width: size, height: size, borderRadius: 100, flexShrink: 0,
        background: bg,
        /* 1px white stroke ringing every avatar — lifts the tinted
           circle off whatever surface sits behind it (white card,
           tinted band, gradient hero) so the avatar reads as a
           discrete badge. Outer ring via boxShadow keeps the avatar
           size untouched. */
        boxShadow: '0 0 0 1px #FFFFFF',
        display: 'grid', placeItems: 'center', overflow: 'hidden',
      }}>
        {asset
          ? <img src={`/assets/${asset}`} width={size} height={size} alt="" style={{ display: 'block' }} />
          : glyph}
      </div>
    );

    const GlyphBolt = ({ color = '#D30AD7' }) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M11 2 4 14h6l-1 8 9-12h-6l1-8z" fill={color} />
      </svg>
    );
    const GlyphSpark = ({ color = '#D30AD7' }) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2 13.5 9 22 12 13.5 15 12 22 10.5 15 2 12 10.5 9z" fill={color} />
      </svg>
    );
    const GlyphChart = ({ color = '#D30AD7' }) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 19h16M6 14l3-4 4 3 5-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
    const GlyphMore = ({ color = 'rgba(0,0,0,0.7)' }) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={color}>
        <circle cx="6" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="18" cy="12" r="2" />
      </svg>
    );
    const GlyphSettings = ({ color = 'rgba(0,0,0,0.7)' }) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1c.6.5 1.3.9 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z" />
      </svg>
    );
    const GlyphHelp = ({ color = 'rgba(0,0,0,0.7)' }) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M9 9a3 3 0 0 1 6 0c0 2-3 2.5-3 4.5" />
        <circle cx="12" cy="17" r="0.5" fill={color} />
      </svg>
    );
    const GlyphShield = ({ color = 'rgba(0,0,0,0.7)' }) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3z" />
      </svg>
    );
    const GlyphInfo = ({ color = 'rgba(0,0,0,0.7)' }) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v.5M12 11v6" />
      </svg>
    );
    const GlyphSend = ({ color = 'white' }) => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill={color}>
        <path d="M2 12 22 4 14 22l-2-8-10-2z" />
      </svg>
    );
    const GlyphArrow = ({ color = 'white' }) => (
      <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
        <path d="M1 5h11M9 1l4 4-4 4" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
    const GlyphCard = ({ color = 'rgba(0,0,0,0.7)' }) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
        <path d="M2.5 10h19" />
        <path d="M6 14.5h3" />
      </svg>
    );
    const GlyphMobile = ({ color = 'rgba(0,0,0,0.7)' }) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
        <path d="M11 18.5h2" />
        <path d="M14 7l-2 3h2l-2 3" stroke={color} strokeWidth="1.6" />
      </svg>
    );
    const GlyphPlus = ({ color = 'rgba(0,0,0,0.7)' }) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
    /* Bill-category glyphs — single-stroke line icons matching Figma fix #2's icon
       language. Used inside BillAvatar (grey #F8F8F9 circle, 54×54). */

    /* List items */
    const ListItemAvatar = ({ asset, bg, glyph, title, subtitle, trailing }) => (
      <div className="tap" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 24px' }}>
        <Avatar asset={asset} bg={bg} glyph={glyph} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={T.body}>{title}</div>
          {subtitle && <div style={{ ...T.caption, marginTop: 2 }}>{subtitle}</div>}
        </div>
        {trailing !== undefined ? trailing : <Chevron />}
      </div>
    );

    const ListItemTransaction = ({ asset, bg, glyph, name, sub1, sub2, amount, amountColor, trailing }) => (
      <div className="tap" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 24px' }}>
        <Avatar asset={asset} bg={bg} glyph={glyph} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={T.h4}>{name}</div>
          <div style={{ ...T.caption, marginTop: 2 }}>{sub1}{sub2 ? ' · ' + sub2 : ''}</div>
        </div>
        {trailing !== undefined ? trailing : (
          <div style={{ ...T.h4, color: amountColor || 'rgba(0,0,0,0.9)' }}>{amount}</div>
        )}
      </div>
    );

    /* ============= CARDS ============= */

    /* Vertical-roll text — cycles through items every `intervalMs`. Inherits
       font styling from its parent so it can drop into a caption slot.
       Loops in one direction only: appends a clone of items[0] at the end,
       animates onto it, then snaps back to the real index 0 without
       animation. Without this, the modulo wrap animates *upward* on
       last→first which reads as reverse. */
    const RollingText = ({ items, intervalMs = 2500, lineHeight = 20, transitionMs = 500 }) => {
      const [idx, setIdx] = useState(0);
      const [animate, setAnimate] = useState(true);
      React.useEffect(() => {
        if (items.length < 2) return;
        const t = setInterval(() => {
          setAnimate(true);
          setIdx(i => i + 1);
        }, intervalMs);
        return () => clearInterval(t);
      }, [items.length, intervalMs]);
      React.useEffect(() => {
        if (idx >= items.length) {
          const t = setTimeout(() => {
            setAnimate(false);
            setIdx(0);
          }, transitionMs);
          return () => clearTimeout(t);
        }
      }, [idx, items.length, transitionMs]);
      const rendered = items.concat([items[0]]);
      return (
        <span style={{
          display: 'inline-block', height: lineHeight, overflow: 'hidden',
          verticalAlign: 'middle', whiteSpace: 'nowrap',
        }}>
          <span style={{
            display: 'block',
            transform: `translateY(${-idx * lineHeight}px)`,
            transition: animate ? `transform ${transitionMs}ms cubic-bezier(0.22, 0.61, 0.36, 1)` : 'none',
          }}>
            {rendered.map((s, i) => (
              <span key={i} style={{ display: 'block', height: lineHeight, lineHeight: `${lineHeight}px` }}>{s}</span>
            ))}
          </span>
        </span>
      );
    };

    /* Like RollingText but hosts arbitrary JSX nodes. Loops in one direction
       only — when the last real item finishes, scroll snaps back to the start
       without animation so the next cycle continues downward. Items are
       right-aligned in the column so narrower items hug the right edge. */
    const RollingStack = ({ items, intervalMs = 2500, height = 24, transitionMs = 800 }) => {
      const [idx, setIdx] = useState(0);
      const [animate, setAnimate] = useState(true);
      React.useEffect(() => {
        if (items.length < 2) return;
        const t = setInterval(() => {
          setAnimate(true);
          setIdx(i => i + 1);
        }, intervalMs);
        return () => clearInterval(t);
      }, [items.length, intervalMs]);
      /* When we land on the cloned first item past the end, wait for the
         transition to complete, then jump (no animation) back to index 0. */
      React.useEffect(() => {
        if (idx >= items.length) {
          const t = setTimeout(() => {
            setAnimate(false);
            setIdx(0);
          }, transitionMs);
          return () => clearTimeout(t);
        }
      }, [idx, items.length, transitionMs]);
      const rendered = items.concat([items[0]]);
      const fade = 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)';
      return (
        <span style={{
          display: 'inline-block', height, overflow: 'hidden',
          verticalAlign: 'bottom',
          maskImage: fade,
          WebkitMaskImage: fade,
        }}>
          <span style={{
            display: 'block',
            transform: `translateY(${-idx * height}px)`,
            transition: animate ? `transform ${transitionMs}ms cubic-bezier(0.4, 0, 0.2, 1)` : 'none',
          }}>
            {rendered.map((item, i) => (
              <span key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                height,
              }}>{item}</span>
            ))}
          </span>
        </span>
      );
    };

    /* Spark brand stack: 4 circular brand logos appear right → left, one after
       another, with a small slide+fade entry and a slight stagger overlap.
       Items overlap visually (negative margin-left) to mimic the avatar-stack
       look. `brands` is in animate order (first entry animates first AND ends
       up rightmost); we render the reversed array in normal row direction so
       the negative margin behaves predictably, and use z-index so the leftmost
       (last to animate in) sits on top — classic avatar-stack stacking.

       Each logo is wrapped in a fixed-size circle slot (`overflow: hidden`,
       border-radius 50%) so logos with different intrinsic aspect ratios all
       render as identical circles → equal spacing.

       Animation only starts once the stack is on-screen (IntersectionObserver)
       with a 100ms delay, so the user sees a clean entry every time. */
    const SparkBrandStack = ({
      brands = ['brand_a.png', 'brand_b.png', 'brand_c.png', 'brand_d.png', 'brand_e.png'],
      size = 32,
      /* `iconSize` controls ONLY the initial spark-icon dimension; brand
         circles still use `size`. Lets callers scale the attention-grabbing
         spark up to match adjacent icons (e.g. Fire/Monies at ~52px) without
         widening the cascaded pills stack. */
      iconSize,
      overlap = 10,
      durationMs = 920,
      staggerMs = 130,
      /* Hold the spark icon on-screen for ~450ms after enter-viewport before
         the rotate-and-cascade reveal. Was 650ms — read as a slight delay
         after scroll arrived. 450 fires sooner (still long enough for the
         spark to register as the source) and the longer durationMs +
         SPARK_ROTATE_MS keep the choreography deliberate. */
      startDelayMs = 450,
      /* `animate` controls the spark-icon → brand-pills reveal. Off by default
         for contexts where the stack sits next to static text. Opt in
         explicitly (e.g. the FY/RW hero spark card). When animate=true, the
         initial state shows a single spark icon — it rotates and dissolves,
         and the brand pills cascade in from the same spot.

         The optional `play` prop lets a parent component control timing
         directly (skips the internal observer + hold delay). If `play` is
         undefined, an internal IntersectionObserver + startDelayMs hold runs.
         Trigger fires only when the stack is well clear of the bottom nav
         bar (rootMargin bottom −260px + threshold 0.85). */
      animate = false,
      play: externalPlay,
      /* When `blobs` is true, pills enter via the spark-blob-in keyframe —
         each scales up past 1 and settles with a soft blur drop. Slower,
         springier feel for contexts where the pills should materialise
         rather than slide. */
      blobs = false,
    }) => {
      const externallyControlled = externalPlay !== undefined;
      const rootRef = React.useRef(null);
      const [internalPlay, setInternalPlay] = React.useState(!animate);
      const play = externallyControlled ? externalPlay : internalPlay;
      React.useEffect(() => {
        if (!animate || externallyControlled) return;
        const el = rootRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            const t = setTimeout(() => setInternalPlay(true), startDelayMs);
            obs.disconnect();
            return () => clearTimeout(t);
          }
        }, { threshold: 0.85, rootMargin: '0px 0px -260px 0px' });
        obs.observe(el);
        return () => obs.disconnect();
      }, [animate, externallyControlled, startDelayMs]);
      const display = [...brands].reverse();
      /* Linger-then-snap: ease-in curve holds the spark icon at near-full
         visual state for the first 60-70% of the duration, then accelerates
         it through the rotate-and-shrink so it's GONE by the time the pills
         are settling. Bumped 680 → 820ms — slower, more deliberate spin. */
      const SPARK_ROTATE_MS = 820;
      /* Hold the pills off by ~100ms so the spark's rotation is visible
         before the first pill starts to land. Pills render OVER the spark
         (zIndex), so the handoff is icon-rotates-then-pill-cascade rather
         than overlap-then-fade. */
      const FIRST_PILL_OVERLAP = SPARK_ROTATE_MS - 100;
      const containerW = size + (display.length - 1) * (size - overlap);
      const sparkIconSize = iconSize ?? size;
      /* Container must be tall enough for both the brand pills (size) and
         the (potentially larger) spark icon — take the max so the icon
         doesn't get clipped by the smaller container height. */
      const containerH = Math.max(size, sparkIconSize);
      return (
        <div ref={rootRef} style={{
          position: 'relative',
          width: containerW, height: containerH,
          display: 'flex', flexDirection: 'row', alignItems: 'center',
        }}>
          {/* Initial-state spark icon — rotates + scales down + dissolves
              when `play` flips. When animate=false this is never rendered.
              Rendered at sparkIconSize so it can be sized independently of
              the brand-pill diameter to match adjacent icons. Anchored to
              the right edge so the pivot of the rotate lands where the
              first brand pill will appear. */}
          {animate && (
            <img
              src="/assets/spark_icon.png"
              alt=""
              aria-hidden
              style={{
                position: 'absolute',
                right: 0, top: '50%',
                width: sparkIconSize, height: sparkIconSize,
                marginTop: -sparkIconSize / 2,
                display: 'block',
                opacity: play ? 0 : 1,
                transform: play ? 'rotate(360deg) scale(0)' : 'rotate(0deg) scale(1)',
                transition: `transform ${SPARK_ROTATE_MS}ms cubic-bezier(0.65, 0, 0.35, 1), opacity ${SPARK_ROTATE_MS - 200}ms cubic-bezier(0.7, 0, 0.84, 0) ${200}ms, filter ${SPARK_ROTATE_MS - 150}ms ease-in ${150}ms`,
                filter: play ? 'blur(6px)' : 'blur(0px)',
                transformOrigin: '50% 50%',
                pointerEvents: 'none',
                /* zIndex 0 — pills render ABOVE the spark icon and slide in
                   OVER it. The icon sits behind, fading + rotating out
                   underneath the incoming pills. */
                zIndex: 0,
              }}
            />
          )}
          {display.map((src, di) => {
            const animI = display.length - 1 - di;
            return (
              <div key={src} style={{
                width: size, height: size, borderRadius: '50%',
                overflow: 'hidden',
                marginLeft: di === 0 ? 0 : -overlap,
                zIndex: display.length - di,
                boxShadow: '0 0 0 2px #fff',
                opacity: animate ? 0 : 1,
                animation: animate && play
                  ? (blobs
                    ? `spark-blob-in ${Math.round(durationMs * 1.4)}ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards 1`
                    : `spark-brand-in ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) forwards 1`)
                  : 'none',
                animationDelay: animate && play ? `${(SPARK_ROTATE_MS - FIRST_PILL_OVERLAP) + animI * staggerMs}ms` : '0ms',
              }}>
                <img src={`/assets/${src}`} alt="" style={{
                  width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                }} />
              </div>
            );
          })}
        </div>
      );
    };

    /* SparkBubbleCloud — alternate spark→brands reveal where the brand
       circles aren't a tight row but a SCATTERED cluster anchored bottom-right
       inside a 120×120 area. Sizes vary star-style (one bigger, one smaller)
       and positions are hand-tuned to read as drifting bubbles, not a grid.
       Initial state: spark icon at the bottom-right anchor. On viewport-enter
       + startDelayMs hold, the spark rotates+scales out and the bubbles pop
       in with a soft springy stagger from the same anchor outward. */
    const SparkBubbleCloud = ({
      brands = ['brand_a.png', 'brand_b.png', 'brand_c.png', 'brand_d.png', 'brand_e.png'],
      width = 120, height = 120,
      iconSize = 52,
      startDelayMs = 500,
      animate = false,
    }) => {
      const rootRef = React.useRef(null);
      const [play, setPlay] = React.useState(!animate);
      React.useEffect(() => {
        if (!animate) { setPlay(false); return; }
        const el = rootRef.current;
        if (!el) return;
        /* Skip observer when startDelayMs is 0 — fire immediately */
        if (startDelayMs === 0) { setPlay(true); return; }
        const obs = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            const t = setTimeout(() => setPlay(true), startDelayMs);
            obs.disconnect();
            return () => clearTimeout(t);
          }
        }, { threshold: 0.6, rootMargin: '0px 0px -200px 0px' });
        obs.observe(el);
        return () => obs.disconnect();
      }, [animate, startDelayMs]);
      /* Bubble offsets — balanced quincunx-style cluster with LIGHT corner
         touches, not heavy overlap. B0 (32) anchor at bottom-right. B1
         due-left of B0 with a 4px gap; B2 directly-above with a 4px gap;
         B3 (24) sits in the NW-interior with light corner touches to
         B0/B1/B2 (the "5" dot of the die); B4 (20, smallest) sits cleanly
         upper-right, separated from the rest. Sizes 20-32, all bubbles
         well clear of the text block at card_x ≤ 76. */
      const BUBBLES = [
        { size: 32, right: 0,  bottom: 0,  delay: 0 },
        { size: 24, right: 36, bottom: 4,  delay: 50 },
        { size: 24, right: 4,  bottom: 36, delay: 100 },
        { size: 24, right: 26, bottom: 26, delay: 150 },
        { size: 20, right: 14, bottom: 54, delay: 200 },
      ];
      const SPARK_ROTATE_MS = 600;
      const BLOB_MS = 700;
      return (
        <div ref={rootRef} style={{
          position: 'relative', width, height,
        }}>
          {animate && (
            <img
              src="/assets/spark_icon.png"
              alt="" aria-hidden
              style={{
                position: 'absolute',
                right: 0, bottom: 0,
                width: iconSize, height: iconSize,
                display: 'block',
                opacity: play ? 0 : 1,
                transform: play ? 'rotate(360deg) scale(0)' : 'rotate(0deg) scale(1)',
                transition: `transform ${SPARK_ROTATE_MS}ms cubic-bezier(0.65, 0, 0.35, 1), opacity ${SPARK_ROTATE_MS - 200}ms cubic-bezier(0.7, 0, 0.84, 0) ${200}ms, filter ${SPARK_ROTATE_MS - 150}ms ease-in ${150}ms`,
                filter: play ? 'blur(6px)' : 'blur(0px)',
                /* Rotate + scale about the icon's own center so the spin
                   reads as the icon spinning in place (not pivoting around
                   its bottom-right corner, which made it slide off-anchor
                   during the rotation). */
                transformOrigin: '50% 50%',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
          )}
          {brands.map((src, i) => {
            const b = BUBBLES[i];
            if (!b) return null;
            return (
              <div key={src} style={{
                position: 'absolute',
                right: b.right, bottom: b.bottom,
                width: b.size, height: b.size,
                borderRadius: '50%', overflow: 'hidden',
                boxShadow: '0 0 0 2px #fff, 0 2px 8px rgba(0,0,0,0.08)',
                /* First bubble already visible on play. Rest pop in
                   immediately with just a short stagger — no spark-rotate wait. */
                opacity: (i === 0 && animate) ? (play ? 1 : 0) : (animate ? 0 : 1),
                transition: (i === 0 && animate) ? 'opacity 0s' : 'none',
                animation: animate && play && i > 0
                  ? `spark-blob-in ${BLOB_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards 1`
                  : 'none',
                animationDelay: animate && play && i > 0
                  ? `${b.delay}ms`
                  : '0ms',
                /* Later bubbles render ON TOP — keeps the smaller satellite
                   pills (notably the pink Nykaa at i=4) from getting hidden
                   behind the bigger overlapping bubbles in the cluster. */
                zIndex: i + 1,
              }}>
                <img src={`/assets/${src}`} alt="" style={{
                  width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                }} />
              </div>
            );
          })}
        </div>
      );
    };

    const ExploreMedium = ({ subtext, title, icon }) => (
      <button className="tap bg-white relative overflow-hidden"
        style={{
          boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16,
          width: '100%', height: 148, padding: 16,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
          textAlign: 'left'
        }}>
        <div style={T.caption}>{subtext}</div>
        <div style={{ ...T.h3, marginTop: 4 }}>{title}</div>
        {icon && <div style={{ position: 'absolute', right: 16, bottom: 16 }}>{icon}</div>}
      </button>
    );
    const ExploreSmall = ({ subtext, title, trailing }) => (
      <button className="tap bg-white"
        style={{
          boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16,
          width: '100%', height: 66, padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          textAlign: 'left', gap: 8
        }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={T.caption}>{subtext}</div>
          <div style={{ ...T.h4, marginTop: 4 }}>{title}</div>
        </div>
        {trailing}
      </button>
    );
    const ExploreLarge = ({ intent, subtext, title, icon }) => (
      <button className="tap bg-white relative overflow-hidden"
        style={{
          boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16,
          width: '100%', height: 160, padding: 24,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
          textAlign: 'left'
        }}>
        {intent && <div style={{ marginBottom: 8 }}>{intent}</div>}
        <div style={T.caption}>{subtext}</div>
        <div style={{ ...T.h3, marginTop: 4 }}>{title}</div>
        {icon && <div style={{ position: 'absolute', right: 20, bottom: 20 }}>{icon}</div>}
      </button>
    );

    const L0CardLarge = ({ label, amount, insightText, ctaTitle, ctaSubtitle, ctaText }) => (
      <div style={{
        background: 'white', border: CARD_BORDER, borderRadius: 16, boxShadow: CARD_SHADOW,
        padding: 24, display: 'flex', flexDirection: 'column', gap: 32
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <span style={{ ...T.btnSm, color: 'rgba(0,0,0,0.5)' }}>{label}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={T.display}>{amount}</span>
            {insightText && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ ...T.btnSm, color: '#D30AD7' }}>{insightText}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <DividerFull />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, paddingTop: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...T.btnSm, color: '#D30AD7' }}>{ctaTitle}</div>
              {ctaSubtitle && <div style={{ ...T.caption, marginTop: 4 }}>{ctaSubtitle}</div>}
            </div>
            <button className="tap" style={{
              padding: '8px 16px', background: '#D30AD7', border: 'none', borderRadius: 100,
              ...T.btnSm, color: 'white', cursor: 'pointer', flexShrink: 0,
            }}>{ctaText}</button>
          </div>
        </div>
      </div>
    );

    const L0CardMedium = ({ title, caption, ctaText, illustrationAsset, illustrationGlyph }) => (
      <div style={{
        background: 'white', border: CARD_BORDER, borderRadius: 16, boxShadow: CARD_SHADOW,
        padding: 20, position: 'relative', width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', gap: 16, minHeight: 132
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingRight: illustrationAsset || illustrationGlyph ? 80 : 0 }}>
          <span style={T.h3}>{title}</span>
          <span style={T.caption}>{caption}</span>
        </div>
        {ctaText && (
          <button className="tap" style={{
            alignSelf: 'flex-start',
            padding: '8px 16px', background: '#F0F4F7', border: 'none', borderRadius: 100,
            ...T.btnSm, color: 'rgba(0,0,0,0.9)', cursor: 'pointer',
          }}>{ctaText}</button>
        )}
        {illustrationAsset && (
          <img src={`/assets/${illustrationAsset}`} width={80} height={80} alt=""
            style={{ position: 'absolute', right: 20, bottom: 20 }} />
        )}
        {illustrationGlyph && (
          <div style={{ position: 'absolute', right: 28, bottom: 28 }}>{illustrationGlyph}</div>
        )}
      </div>
    );

    const MarketingCard = ({ title, subtitle, glyph, brand = false }) => (
      <button className="tap" style={{
        background: brand ? 'linear-gradient(135deg, #D30AD7 0%, #2B6ACF 100%)' : 'white',
        border: brand ? 'none' : CARD_BORDER, borderRadius: 16, boxShadow: CARD_SHADOW,
        padding: 20, width: '100%',
        display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', cursor: 'pointer',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 100, flexShrink: 0,
          background: brand ? 'rgba(255,255,255,0.18)' : '#FAE2FA',
          display: 'grid', placeItems: 'center',
        }}>{glyph}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...T.h4, color: brand ? 'white' : 'rgba(0,0,0,0.9)' }}>{title}</div>
          <div style={{
            ...T.caption, marginTop: 2,
            color: brand ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'
          }}>{subtitle}</div>
        </div>
        <Chevron color={brand ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.3)'} />
      </button>
    );

    /* Bills shortcut grid */
    /* Bill tiles: 54px white circle (BillAvatar) holding a 24×24 PNG glyph.
       Icons exported from Figma at native 24px. */
    const BILL_ICONS = [
      { glyph: <img src="/assets/bill_v2_credit.png" width={24} height={24} alt="" style={{ display: 'block' }} />, t: 'Credit\ncard' },
      { glyph: <img src="/assets/bill_v2_electric.png" width={24} height={24} alt="" style={{ display: 'block' }} />, t: 'Electricity\nbill' },
      { glyph: <img src="/assets/bill_v2_mobile.png" width={24} height={24} alt="" style={{ display: 'block' }} />, t: 'Mobile\nrecharge' },
      { glyph: <img src="/assets/bill_v2_more.png" width={24} height={24} alt="" style={{ display: 'block' }} />, t: 'View\nmore' },
    ];

    const BillsCompositeCard = () => (
      <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={T.h4}>Recharge & bills</span>
          <TagSubtle intent="info">₹0 fee</TagSubtle>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 20 }}>
          {BILL_ICONS.map((b, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <BillAvatar>{b.glyph}</BillAvatar>
              <div style={{ ...T.caption, textAlign: 'center', marginTop: 8, whiteSpace: 'pre-line', color: 'rgba(0,0,0,0.7)' }}>
                {b.t}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', margin: '16px 0' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/assets/flame_orange.png" width={40} height={40} alt=""
            style={{ display: 'block', flexShrink: 0, borderRadius: 100 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...T.btnSm, color: 'rgba(0,0,0,0.9)' }}>Get assured ₹10</div>
            <div style={{ ...T.caption, marginTop: 2 }}>Reward on 1st bill payment</div>
          </div>
          <Chevron />
        </div>
      </div>
    );

    /* Unified bill-icon avatar: 54×54. Two variants —
       'tinted'  → slate-10 bg, no stroke (default)
       'outline' → white bg with a 1px #F2F2F2 stroke (DLS subtle outline) +
                   a subtle drop shadow to lift the avatar off the page. */
    const BillAvatar = ({ children, variant = 'tinted' }) => (
      <div style={{
        width: 54, height: 54, borderRadius: 100,
        background: variant === 'outline' ? '#FFFFFF' : '#F6F9FC',
        border: variant === 'outline' ? '1px solid #F2F2F2' : 'none',
        boxShadow: variant === 'outline' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        {children}
      </div>
    );

    /* Labels for the 1-line variant — shorter words so each fits in one row
       at the same caption font-size. Same column count and grid spacing. */
    const BILL_ICONS_SINGLE = ['Credit', 'Power', 'Mobile', 'More'];
    const BillsShortcutGrid = ({ columnGap = 8, avatarVariant = 'tinted', singleLine = false }) => (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: columnGap }}>
        {BILL_ICONS.map((b, i) => (
          <button key={i} className="tap" style={{
            background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <BillAvatar variant={avatarVariant}>{b.glyph}</BillAvatar>
            <div style={{
              ...T.caption, textAlign: 'center', marginTop: 8,
              whiteSpace: singleLine ? 'nowrap' : 'pre-line',
              color: 'rgba(0,0,0,0.7)',
            }}>
              {singleLine ? BILL_ICONS_SINGLE[i] : b.t}
            </div>
          </button>
        ))}
      </div>
    );

    /* overflowX: auto forces the browser to compute overflowY as auto too, which clips
       vertical card shadows. Inner vertical padding gives the shadow room; matching
       negative margins keep the surrounding layout flow unchanged.
       Scroll-snap → cards latch on swipe so vertical-card layouts feel clean. */
    const HScroll = ({ children, gap = 16 }) => (
      <div style={{
        overflowX: 'auto', paddingLeft: 24, paddingRight: 0,
        paddingTop: 24, paddingBottom: 48,
        marginTop: -24, marginBottom: -48,
        scrollSnapType: 'x proximity',
        scrollPaddingLeft: 24, scrollPaddingRight: 24,
        overscrollBehaviorX: 'contain',
      }} className="scrollbar-hide no-page-swipe">
        <div style={{ display: 'flex', gap }}>
          {children}
          {/* Trailing sentinel — browsers ignore padding-right on flex scroll content,
              so a real 24px-wide spacer guarantees the last card never hugs the
              right edge when fully scrolled. */}
          <div style={{ flex: '0 0 24px', alignSelf: 'stretch' }} aria-hidden="true" />
        </div>
      </div>
    );

    /* ============= SECTION VARIANTS — content only ============= */

    /* ----- For You: A:carousel(NEW) B:strip(kept) C:medium(kept) D:hero-large(NEW) E:2-up-smalls(NEW) ----- */

    /* Shared slide data + colour schemes for all For You carousel variants.
       `kind` classifies each slide as a UTILITY action (bill, statement,
       spend insight — things the user must DO) or a PROMOTIONAL drop
       (rewards, offers, launches — things the user can OPT INTO). FY_D and
       FY_K colour their bg from kind so the cool-vs-warm wash signals the
       card category without needing a text tag or intent chip. */
    const FY_SLIDES = [
      {
        title: 'Electricity bill due today', sub: '₹1,240 · due in 3 days', cta: 'Pay now',
        kind: 'utility',
        heroImg: 'fy_3d_bill.png', centeredImg: 'fy_centered_bill.png', bannerImg: 'fy_banner_bill.png'
      },
      {
        title: 'New Spark Drop', sub: 'Fresh rewards just dropped', cta: 'Explore',
        kind: 'promo',
        heroImg: 'fy_3d_drop.png', centeredImg: 'fy_centered_drop.png', bannerImg: 'fy_banner_drop.png'
      },
      {
        title: 'Spent ₹18K last month', sub: '22% higher than usual', cta: 'See report',
        kind: 'utility',
        heroImg: 'fy_3d_spends.png', centeredImg: 'fy_centered_spends.png', bannerImg: 'fy_banner_spends.png'
      },
    ];
    /* Bills belong in the Bills section — filter them out of every
       For You carousel so the two sections don't duplicate content. */
    const FY_SLIDES_NO_BILLS = FY_SLIDES.filter(s => s.heroImg !== 'fy_3d_bill.png');
    const FY_SCHEMES = [
      ['#FCE3FC', '#F5C8F5', '#E5A8E5'],
      ['#E0F4E0', '#C2E6C2', '#9CD49C'],
      ['#FFE7CC', '#FAD0A8', '#F2B884'],
    ];
    /* Per-slide mesh palettes — single-hue triplets at HIGH
       luminance (>= 85%) so black title/sub copy stays legible
       against any point in the mesh. Tones cluster light → very
       light within each hue so the mesh has variation without
       dipping into saturated bands that reduce text contrast.
        · Bill   = pink-coral tones
        · Drop   = Valentino tones (slice brand)
        · Spends = sky-blue tones */
    const FY_SLIDE_SCHEMES = [
      ['#C8F0D5', '#E0F4E8', '#B0E0BD'], // bill — mint green (light only)
      ['#F8D5F8', '#FBEAFB', '#F5C5F5'], // drop — Valentino (light only)
      ['#C8E4F8', '#E7F2FB', '#B0D9F2'], // spends — sky blue (light only)
    ];
    const FY_KIND_SCHEMES = {
      utility: ['#D2E0F0', '#EAF0F8', '#FFFFFF'], // Smooth light cool blue → softer → white
      promo:   ['#F5C5F5', '#FAE2FA', '#FFFFFF'], // Bright Valentino → Valentino-50 → white
    };
    const fySchemeForSlide = (s) => {
      const i = FY_SLIDES.indexOf(s);
      if (i >= 0 && FY_SLIDE_SCHEMES[i]) return FY_SLIDE_SCHEMES[i];
      return FY_KIND_SCHEMES[s.kind] || FY_KIND_SCHEMES.utility;
    };

    /* Hex → rgb → lerp helpers for continuous gradient interpolation between slide schemes. */
    const _hexToRgb = (h) => {
      const v = h.replace('#', '');
      return [parseInt(v.slice(0,2),16), parseInt(v.slice(2,4),16), parseInt(v.slice(4,6),16)];
    };
    const lerpHex = (a, b, t) => {
      const A = _hexToRgb(a), B = _hexToRgb(b);
      const r = Math.round(A[0] + (B[0]-A[0])*t);
      const g = Math.round(A[1] + (B[1]-A[1])*t);
      const bl= Math.round(A[2] + (B[2]-A[2])*t);
      return `rgb(${r},${g},${bl})`;
    };
    const lerpScheme = (a, b, t) => [lerpHex(a[0], b[0], t), lerpHex(a[1], b[1], t), lerpHex(a[2], b[2], t)];

    /* Infinite carousel — pairs with a slide list rendered as
       [cloneLast, ...slides, cloneFirst]. After the snap settles on either clone,
       scrollLeft is reset (without animation) to the equivalent real slide so the
       loop feels continuous in both directions. */
    const useInfiniteCarousel = (slideCount, strideRatio = 1) => {
      const ref = React.useRef(null);
      const [idx, setIdx] = useState(0);
      const [progress, setProgress] = useState(0);
      const paused = React.useRef(false);
      const teleporting = React.useRef(false);
      const scrolling = React.useRef(false);
      const scrollEndTimer = React.useRef(null);

      React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        /* Start on the first real slide (position 1; position 0 is cloneLast).
           Stride = container width × strideRatio so the hook supports
           sub-100% slide widths (peek-card layouts). */
        const setInitial = () => {
          const cw = el.offsetWidth;
          if (cw === 0) { requestAnimationFrame(setInitial); return; }
          el.scrollLeft = cw * strideRatio;
        };
        setInitial();
      }, [strideRatio]);

      React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let settleTimer;
        const teleportTo = (scrollLeft) => {
          teleporting.current = true;
          const prev = el.style.scrollBehavior;
          el.style.scrollBehavior = 'auto';
          el.scrollLeft = scrollLeft;
          requestAnimationFrame(() => {
            el.style.scrollBehavior = prev;
            teleporting.current = false;
          });
        };
        const onScroll = () => {
          /* Track scroll activity — auto-advance skips if scrolling */
          scrolling.current = true;
          clearTimeout(scrollEndTimer.current);
          scrollEndTimer.current = setTimeout(() => { scrolling.current = false; }, 5000);
          const cw = el.offsetWidth * strideRatio;
          if (cw === 0) return;
          const raw = el.scrollLeft / cw; /* 0..N+1 */
          const logical = raw - 1;
          const wrapped = ((logical % slideCount) + slideCount) % slideCount;
          setProgress(wrapped);
          setIdx(Math.round(wrapped) % slideCount);

          if (teleporting.current) return;
          clearTimeout(settleTimer);
          settleTimer = setTimeout(() => {
            const pos = Math.round(raw);
            if (pos <= 0) teleportTo(cw * slideCount);
            else if (pos >= slideCount + 1) teleportTo(cw);
          }, 140);
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        /* Interaction pause: keep paused while the user is touching the
           carousel AND for 7s after they release. Listens on both pointer
           and touch events so mobile swipes are caught reliably. */
        let releaseTimer;
        const onDown = () => {
          paused.current = true;
          clearTimeout(releaseTimer);
        };
        const onUp = () => {
          clearTimeout(releaseTimer);
          releaseTimer = setTimeout(() => { paused.current = false; }, 7000);
        };
        el.addEventListener('pointerdown', onDown);
        el.addEventListener('pointerup', onUp);
        el.addEventListener('pointercancel', onUp);
        el.addEventListener('touchstart', onDown, { passive: true });
        el.addEventListener('touchend', onUp);
        return () => {
          clearTimeout(settleTimer);
          clearTimeout(releaseTimer);
          el.removeEventListener('scroll', onScroll);
          el.removeEventListener('pointerdown', onDown);
          el.removeEventListener('pointerup', onUp);
          el.removeEventListener('pointercancel', onUp);
          el.removeEventListener('touchstart', onDown);
          el.removeEventListener('touchend', onUp);
        };
      }, [slideCount, strideRatio]);

      React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let advancing = false;
        const t = setInterval(() => {
          if (paused.current || scrolling.current || advancing) return;
          const cw = el.offsetWidth * strideRatio;
          if (cw === 0) return;
          advancing = true;
          el.scrollBy({ left: cw, behavior: 'smooth' });
          /* Lock out the next auto-advance until the smooth scroll
             settles (800ms covers even slow mobile browsers). */
          setTimeout(() => { advancing = false; }, 800);
        }, 4000);
        return () => clearInterval(t);
      }, [strideRatio]);

      return [ref, idx, progress];
    };

    /* Dot indicators — quiet pill: thinner inactive dots, slate-toned active. */
    const CarouselDots = ({ count, activeIdx, bottom = 14, align = 'center', light = false }) => (
      <div style={{
        position: 'absolute', bottom, left: 0, right: 0,
        display: 'flex',
        justifyContent: align === 'left' ? 'flex-start' : 'center',
        paddingLeft: align === 'left' ? 28 : 0,
        gap: 4, pointerEvents: 'none', zIndex: 2,
      }}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} style={{
            width: i === activeIdx ? 14 : 4, height: 4, borderRadius: 2,
            background: light
              ? (i === activeIdx ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)')
              : (i === activeIdx ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.12)'),
            transition: 'width 200ms, background 200ms',
          }} />
        ))}
      </div>
    );

    /* For You A — standard large carousel pulling up under the app bar (always Bleed).
       Infinite scroll: slides wrap around in both directions via cloned edge slides. */
    const FY_A = () => {
      const TEXT_TOP_CSS = 'calc(var(--bar-overlap, 118px) + 24px)';
      const MIN_H = 220;
      const SLIDE_PCT = 100;
      const TEXT_BOTTOM = 52;
      const slideBg = (s) => {
        return `linear-gradient(to bottom, #FFFFFF 0%, ${s[0]} 35%, ${s[1]} 60%, #FFFFFF 100%)`;
      };
      const [ref, idx, progress] = useInfiniteCarousel(FY_SLIDES_NO_BILLS.length);
      /* Wrapped progress → lo/hi schemes; hi wraps to 0 when crossing the last slide. */
      const lo = Math.floor(progress) % FY_SCHEMES.length;
      const hi = (lo + 1) % FY_SCHEMES.length;
      const t = progress - Math.floor(progress);
      const scheme = lerpScheme(FY_SCHEMES[lo], FY_SCHEMES[hi], t);
      const renderedSlides = [FY_SLIDES_NO_BILLS[FY_SLIDES_NO_BILLS.length - 1], ...FY_SLIDES_NO_BILLS, FY_SLIDES_NO_BILLS[0]];

      return (
        <>
          <div style={{ position: 'relative', marginTop: 'calc(-1 * var(--bar-overlap, 118px))', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', inset: 0, background: slideBg(scheme),
              pointerEvents: 'none', zIndex: 0,
            }}/>
            <div ref={ref} style={{
              position: 'relative', zIndex: 1,
              display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory',
              overscrollBehavior: 'none',
            }} className="scrollbar-hide no-page-swipe">
              {renderedSlides.map((s, i) => (
                <div key={i} style={{
                  flex: `0 0 ${SLIDE_PCT}%`, scrollSnapAlign: 'start',
                  position: 'relative', minHeight: MIN_H, overflow: 'hidden',
                  background: 'transparent',
                }}>
                  <div style={{
                    position: 'absolute', right: 20, top: TEXT_TOP_CSS, bottom: TEXT_BOTTOM,
                    width: 96, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    pointerEvents: 'none',
                  }}>
                    <img src={`/assets/${s.heroImg}`} alt="" style={{
                      width: 96, height: 96, objectFit: 'contain',
                      borderRadius: 20, display: 'block',
                    }} />
                  </div>
                  <div style={{
                    position: 'relative', width: '100%',
                    paddingTop: TEXT_TOP_CSS, paddingRight: 120, paddingBottom: TEXT_BOTTOM, paddingLeft: 28,
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    minHeight: MIN_H, boxSizing: 'border-box', zIndex: 1,
                  }}>
                    <div>
                      <div style={{ ...T.h4, lineHeight: '20px' }}>{s.title}</div>
                      <div style={{ ...T.caption, color: 'rgba(0,0,0,0.7)', marginTop: 4 }}>{s.sub}</div>
                    </div>
                    <button className="tap" style={{
                      alignSelf: 'flex-start', marginTop: 12,
                      padding: '6px 14px', background: '#000', border: 'none', borderRadius: 100,
                      ...T.btnSm, color: 'white', cursor: 'pointer', whiteSpace: 'nowrap',
                    }}>{s.cta}</button>
                  </div>
                </div>
              ))}
            </div>
            {/* The slide-bg gradient ends in white at its bottom, so no overlay
                is needed — the CTA sits cleanly on the colored portion above. */}
            <CarouselDots count={FY_SLIDES_NO_BILLS.length} activeIdx={idx} bottom={16} />
          </div>
        </>
      );
    };

    /* For You D — same mechanics as FY_A but the slide background starts in
       the scheme colour at the very top (under the transparent app bar)
       instead of fading down from white. In PWA mode (apple-mobile-web-app-
       status-bar-style: black-translucent) the gradient paints THROUGH the
       iOS status bar; in regular Safari the status bar is still white. */
    const FY_D = () => {
      const TEXT_TOP_CSS = 'calc(var(--bar-overlap, 118px) + 24px)';
      /* Carousel grown by ~40px so the gradient has room to:
         (a) hold the slide colour longer through the read zone,
         (b) transition to white right above the paginator, and
         (c) leave a solid-white band beneath the paginator so the
         seam into Bills is invisible (≥20px of pure white). */
      const MIN_H = 260;
      const SLIDE_PCT = 100;
      const TEXT_BOTTOM = 42; // CTA→paginator gap ≈ 24 (paginator bottom 12 + ~6 dot height)
      const slideBg = (s) => {
        /* Linear white overlay: hold the slide colour to 55%, then
           run fully to white by 85%. The bottom 15% (~39px) is pure
           white — paginator sits on white, and the Bills seam below
           gets a clean ≥20px white band. */
        return `
          radial-gradient(ellipse 100% 70% at 8% 6%, ${s[0]} 0%, transparent 85%),
          radial-gradient(ellipse 100% 70% at 95% 10%, ${s[1]} 0%, transparent 85%),
          radial-gradient(ellipse 110% 60% at 50% 22%, ${s[2]} 0%, transparent 90%),
          linear-gradient(to bottom, transparent 70%, #FFFFFF 92%),
          #FFFFFF
        `;
      };
      const [ref, idx, progress] = useInfiniteCarousel(FY_SLIDES_NO_BILLS.length);
      const lo = Math.floor(progress) % FY_SLIDES_NO_BILLS.length;
      const hi = (lo + 1) % FY_SLIDES_NO_BILLS.length;
      const t = progress - Math.floor(progress);
      /* BG scheme is driven by the slide's KIND (utility vs promo), not by a
         positional FY_SCHEMES index. Two-color palette means the wash cleanly
         signals "action item" vs "offer" without any text tag or chip. The
         lerp between adjacent slide schemes keeps the scroll-driven color
         shift smooth. */
      const scheme = lerpScheme(fySchemeForSlide(FY_SLIDES_NO_BILLS[lo]), fySchemeForSlide(FY_SLIDES_NO_BILLS[hi]), t);
      const renderedSlides = [FY_SLIDES_NO_BILLS[FY_SLIDES_NO_BILLS.length - 1], ...FY_SLIDES_NO_BILLS, FY_SLIDES_NO_BILLS[0]];

      return (
        <>
          <div style={{ position: 'relative', marginTop: 'calc(-1 * var(--bar-overlap, 118px))', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', inset: 0, background: slideBg(scheme),
              pointerEvents: 'none', zIndex: 0,
            }}/>
            <div ref={ref} style={{
              position: 'relative', zIndex: 1,
              display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory',
              overscrollBehavior: 'none',
            }} className="scrollbar-hide no-page-swipe">
              {renderedSlides.map((s, i) => {
                const meta = fyAvatarMeta(s.heroImg);
                return (
                <div key={i} style={{
                  flex: `0 0 ${SLIDE_PCT}%`, scrollSnapAlign: 'start',
                  position: 'relative', minHeight: MIN_H, overflow: 'hidden',
                  background: 'transparent',
                }}>
                  <div style={{
                    position: 'absolute', right: 24, top: TEXT_TOP_CSS, bottom: TEXT_BOTTOM,
                    width: 60, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                    pointerEvents: 'none',
                  }}>
                    {/* DLS avatar — subtle (tinted) disc + full-colour
                       icon so avatar + slide mesh read as one unit.
                       Top-aligned with the heading on the left so the
                       two elements share a baseline. */}
                    <FyDlsAvatar heroImg={s.heroImg} size={60} glyphSize={30} tone="subtle" />
                  </div>
                  <div style={{
                    position: 'relative', width: '100%',
                    paddingTop: TEXT_TOP_CSS, paddingRight: 110, paddingBottom: TEXT_BOTTOM, paddingLeft: 28,
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
                    minHeight: MIN_H, boxSizing: 'border-box', zIndex: 1,
                  }}>
                    <div>
                      <div style={{ ...T.h4, lineHeight: '20px' }}>{s.title}</div>
                      <div style={{ ...T.caption, color: 'rgba(0,0,0,0.7)', marginTop: 4 }}>{s.sub}</div>
                    </div>
                    {/* Tertiary CTA — text link in the slide's avatar
                       accent colour (green / Valentino / blue) so the
                       affordance reads as a deepened tone of the slide
                       rather than a Valentino stamp on every variant.
                       Fixed 12px gap below the sub-text (no space-between). */}
                    <button className="tap" style={{
                      alignSelf: 'flex-start', marginTop: 8,
                      background: 'transparent', border: 'none', padding: 0,
                      ...T.btnSm, color: meta.accent,
                      cursor: 'pointer', whiteSpace: 'nowrap',
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                    }}>
                      {s.cta}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M9 6l6 6-6 6" stroke={meta.accent} strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
            <CarouselDots count={FY_SLIDES_NO_BILLS.length} activeIdx={idx} bottom={12} />
          </div>
        </>
      );
    };

    /* Per-slide DLS icon config — official slice DLS icon paths,
       extracted from Electricity.svg / Spark.svg / Analytics.svg.
       Each entry returns an array of paths (some icons are multi-
       path) + an accent colour used by both FY_D (filled colour
       avatar with white icon) and FY_M (bare icon in accent). */
    const fyAvatarMeta = (heroImg) => ({
      'fy_3d_bill.png': {
        accent: '#00A63E', // saturated green to pair with mint scheme
        paths: [
          'M14.235 9.97088C13.8654 9.97088 13.5057 9.97088 13.136 9.97088H13.0461C13.0461 9.97088 13.0661 9.91089 13.0761 9.88089C13.3958 9.16094 13.7155 8.43099 14.0452 7.71105C14.1851 7.40107 14.0053 7.12109 13.6656 7.12109C12.9662 7.12109 12.2568 7.12109 11.5574 7.12109C11.3476 7.12109 11.2177 7.21108 11.1478 7.42107C10.7681 8.56099 10.3884 9.7009 10.0088 10.8408C9.99879 10.8808 9.97881 10.9208 9.97881 10.9608C9.95883 11.2108 10.1387 11.4008 10.3984 11.4008C10.8181 11.4008 11.2377 11.4008 11.6573 11.4008H11.7472C11.7373 11.4608 11.7273 11.5008 11.7173 11.5508C11.5874 12.1507 11.4475 12.7507 11.3176 13.3406C11.2777 13.5106 11.3676 13.6806 11.5174 13.7606C11.6873 13.8506 11.8771 13.8106 12.007 13.6606C12.1569 13.4806 12.3068 13.3006 12.4566 13.1207C13.146 12.3007 13.8254 11.4708 14.5148 10.6408C14.5648 10.5808 14.6147 10.4908 14.6247 10.4009C14.6547 10.1609 14.4748 9.97088 14.2251 9.97088H14.235Z',
          'M17.6119 4.18131C16.0732 2.74141 14.0051 1.96147 11.8769 2.00147C9.73883 2.03146 7.74059 2.8614 6.24192 4.3313C4.75323 5.81119 3.93396 7.80104 4.00389 9.80089C4.06384 11.5908 4.81318 13.3106 6.09205 14.6505C7.00125 15.6005 7.5108 16.8104 7.5108 18.0703C7.5108 20.2401 9.36915 22 11.6671 22H12.3365C14.6345 22 16.4929 20.2401 16.4929 18.0703C16.4929 16.5104 17.3221 15.3005 18.0115 14.5405C19.2904 13.1606 19.9998 11.3908 19.9998 9.56091C19.9998 7.52106 19.1505 5.6112 17.6219 4.18131H17.6119ZM16.0632 12.9307C15.4738 13.5706 15.0142 14.2406 14.6545 14.9505C14.3747 15.5205 14.1649 16.1604 14.045 16.8004C13.9651 17.2403 13.5654 17.5403 13.1158 17.5403H10.8878C10.4382 17.5403 10.0486 17.2303 9.95863 16.7904C9.68887 15.3805 8.99948 14.0306 8.01035 13.0107C7.13113 12.1007 6.62158 10.9408 6.58162 9.7309C6.54165 8.371 7.09117 7.0211 8.10027 6.03117C9.10938 5.03124 10.4582 4.47128 11.8869 4.45129H11.9669C13.4056 4.45129 14.7544 4.98125 15.7835 5.93118C16.8226 6.90111 17.3921 8.20101 17.3921 9.57091C17.3921 10.8108 16.9125 12.0107 16.0532 12.9407L16.0632 12.9307Z',
        ],
      },
      'fy_3d_drop.png': {
        accent: '#D30AD7', // slice Valentino
        paths: [
          'M17.6793 9.94054H13.7196V3.6515C13.7196 2.06335 11.6867 1.39633 10.7445 2.67743L4.31777 11.4334C3.5237 12.5239 4.29659 14.0591 5.64122 14.0591H9.60099V20.3482C9.60099 21.9363 11.6338 22.6033 12.5761 21.3222L19.0028 12.5557C19.7969 11.4652 19.024 9.92995 17.6793 9.92995V9.94054Z',
        ],
      },
      'fy_3d_spends.png': {
        accent: '#2B6ACF', // slice Blue
        paths: [
          'M14.0951 11.9143C12.9864 11.9143 12.0792 11.0066 12.0792 9.89713V3.84569C12.0792 2.8472 11.3435 2 10.396 2C10.2952 2 10.1843 2.01009 10.0735 2.03026C8.79341 2.29249 7.57382 2.79677 6.47518 3.53303C4.82219 4.64246 3.53204 6.21583 2.76602 8.06152C2 9.89713 1.80849 11.9244 2.19151 13.881C2.5846 15.8376 3.54212 17.6329 4.95322 19.0449C6.36431 20.4569 8.15842 21.415 10.1138 21.8084C10.7689 21.9395 11.4241 22 12.0792 22C13.3996 22 14.7099 21.7378 15.9396 21.2335C17.7841 20.467 19.3565 19.176 20.4652 17.5219C21.201 16.4226 21.7049 15.2022 21.967 13.9213C22.1887 12.8321 21.2614 11.9143 20.1527 11.9143H14.0951ZM18.54 15.8477C17.9756 16.7655 17.2398 17.5724 16.3428 18.1674C15.0425 19.0348 13.5911 19.4685 12.0893 19.4685C11.5954 19.4685 11.1016 19.4181 10.6178 19.3273C9.14618 19.0348 7.80564 18.3187 6.74732 17.2597C5.689 16.2007 4.97338 14.8593 4.68108 13.3868C4.39886 11.9445 4.52989 10.472 5.07417 9.10035C5.33623 8.44478 5.71924 7.84972 6.17281 7.30509C7.37224 5.84266 8.04755 5.43923 8.85388 5.13666C9.15626 5.01563 9.48888 5.2476 9.49896 5.57035L9.57959 9.88704C9.57959 12.3883 11.6156 14.4256 14.1152 14.4256L18.8424 14.4861C19.0138 14.4861 19.1347 14.6677 19.0742 14.829C18.923 15.182 18.7618 15.5149 18.5501 15.8477H18.54Z',
          'M18.5107 4.12832C17.5834 3.3618 16.515 2.76675 15.366 2.36332C14.7411 2.15152 14.0859 2.62555 14.0859 3.28112V9.0199C14.0859 9.55444 14.5093 9.97804 15.0435 9.98813L20.7584 10.0386C21.4135 10.0386 21.8974 9.40315 21.6958 8.77784C21.091 6.93215 19.9722 5.32852 18.5107 4.12832Z',
        ],
      },
    }[heroImg] || { accent: 'rgba(0,0,0,0.85)', paths: [] });

    /* Per-accent soft tint matching the DLS-50 token of each accent.
       Used by `tone="subtle"` avatars where the disc is a light wash
       of the accent and the icon carries the full colour. Lets the
       avatar read as one tonal unit with the slide's mesh instead of
       a saturated brand sticker on top of it. */
    const FY_AVATAR_SOFT_BG = {
      '#00A63E': '#E0F4E8', // green-50
      '#D30AD7': '#FAE2FA', // valentino-50
      '#2B6ACF': '#E6EDF9', // blue-50
    };

    const FyDlsAvatar = ({ heroImg, size = 56, glyphSize = 28, tone = 'bold' }) => {
      const meta = fyAvatarMeta(heroImg);
      const subtle = tone === 'subtle';
      const bg = subtle ? (FY_AVATAR_SOFT_BG[meta.accent] || '#F0F4F7') : meta.accent;
      const glyphFill = subtle ? meta.accent : '#FFFFFF';
      return (
        <div style={{
          width: size, height: size, borderRadius: 100,
          /* bold: filled accent disc + white icon (sticker read).
             subtle: light wash of the accent + icon in full colour,
             so the avatar reads as a deepened tone of the slide's
             mesh instead of a brand stamp on top of it. */
          background: bg,
          boxShadow: subtle
            ? 'none'
            : '0 0 0 1px rgba(255,255,255,0.6), 0 2px 8px rgba(0,0,0,0.08)',
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <svg width={glyphSize} height={glyphSize} viewBox="0 0 24 24" fill="none">
            {(meta.paths || []).map((p, i) => (
              <path key={i} d={p} fill={glyphFill} />
            ))}
          </svg>
        </div>
      );
    };

    /* FY_E — Avatar-leading carousel. Same scroll-snap mechanics as FY_D
       but each slide leads with a DLS tinted avatar on the LEFT and the
       title/sub/CTA stack sits to its right. Reads as a horizontal
       "row" inside each card — quieter and more list-like than the
       hero-illustration version. */
    const FY_E = () => {
      const TEXT_TOP_CSS = 'calc(var(--bar-overlap, 118px) + 24px)';
      const MIN_H = 200;
      const SLIDE_PCT = 100;
      const TEXT_BOTTOM = 52;
      const slideBg = (s) => (
        `linear-gradient(to bottom, ${s[0]} 0%, ${s[0]} 45%, ${s[1]} 85%, #FFFFFF 100%)`
      );
      const [ref, idx, progress] = useInfiniteCarousel(FY_SLIDES_NO_BILLS.length);
      const lo = Math.floor(progress) % FY_SLIDES_NO_BILLS.length;
      const hi = (lo + 1) % FY_SLIDES_NO_BILLS.length;
      const t = progress - Math.floor(progress);
      const scheme = lerpScheme(fySchemeForSlide(FY_SLIDES_NO_BILLS[lo]), fySchemeForSlide(FY_SLIDES_NO_BILLS[hi]), t);
      const renderedSlides = [FY_SLIDES_NO_BILLS[FY_SLIDES_NO_BILLS.length - 1], ...FY_SLIDES_NO_BILLS, FY_SLIDES_NO_BILLS[0]];
      return (
        <>
          <div style={{ position: 'relative', marginTop: 'calc(-1 * var(--bar-overlap, 118px))', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', inset: 0, background: slideBg(scheme),
              pointerEvents: 'none', zIndex: 0,
            }}/>
            <div ref={ref} style={{
              position: 'relative', zIndex: 1,
              display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory',
              overscrollBehavior: 'none',
            }} className="scrollbar-hide no-page-swipe">
              {renderedSlides.map((s, i) => (
                <div key={i} style={{
                  flex: `0 0 ${SLIDE_PCT}%`, scrollSnapAlign: 'start',
                  position: 'relative', minHeight: MIN_H, overflow: 'hidden',
                  background: 'transparent',
                  paddingTop: TEXT_TOP_CSS, paddingBottom: TEXT_BOTTOM,
                  paddingLeft: 28, paddingRight: 28,
                  boxSizing: 'border-box',
                  /* Avatar + text both vertically centered in the slide;
                     the tap-to-engage cue is the whole card, no inner
                     pill needed. */
                  display: 'flex', alignItems: 'center', gap: 16,
                }}>
                  <FyDlsAvatar heroImg={s.heroImg} size={56} glyphSize={28} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...T.h4, lineHeight: '20px' }}>{s.title}</div>
                    <div style={{ ...T.caption, color: 'rgba(0,0,0,0.7)', marginTop: 4 }}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <CarouselDots count={FY_SLIDES_NO_BILLS.length} activeIdx={idx} bottom={16} />
          </div>
        </>
      );
    };

    /* FY_G — RW_R layout applied to the For You content. Two square
       cards on top (slides 0 + 1) + one landscape banner below
       (slide 2). Each card reuses the FY_D per-slide gradient scheme
       + the 3D illustration, but the section is a grid instead of a
       horizontal carousel — no swipe, no auto-advance, no app-bar
       bleed. Reads as a 1-page rewards-style summary. */
    const FY_G = () => {
      const slides = FY_SLIDES_NO_BILLS;
      const slideGradient = (s) => {
        const scheme = fySchemeForSlide(s);
        return `linear-gradient(180deg, ${scheme[0]} 0%, ${scheme[1]} 70%, ${scheme[2]} 100%)`;
      };
      const squareTile = (s) => (
        <button key={s.title} className="tap" style={{
          width: '100%', aspectRatio: '1 / 1', padding: 16, borderRadius: 16,
          background: slideGradient(s), border: CARD_BORDER, boxShadow: CARD_SHADOW,
          textAlign: 'left', cursor: 'pointer', position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ ...T.h4, lineHeight: '20px' }}>{s.title}</div>
            <div style={{ ...T.caption, color: 'rgba(0,0,0,0.7)', marginTop: 4 }}>{s.sub}</div>
          </div>
          <img src={`/assets/${s.heroImg}`} alt="" style={{
            width: 64, height: 64, objectFit: 'contain',
            display: 'block', alignSelf: 'flex-end',
          }} />
        </button>
      );
      const landscape = (s) => (
        <button className="tap" style={{
          width: '100%', height: 104, padding: '16px 20px', borderRadius: 16,
          background: slideGradient(s), border: CARD_BORDER, boxShadow: CARD_SHADOW,
          textAlign: 'left', cursor: 'pointer', position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...T.h4, lineHeight: '20px' }}>{s.title}</div>
            <div style={{ ...T.caption, color: 'rgba(0,0,0,0.7)', marginTop: 4 }}>{s.sub}</div>
          </div>
          <img src={`/assets/${s.heroImg}`} width={68} height={68} alt=""
            style={{ display: 'block', flexShrink: 0, objectFit: 'contain' }} />
        </button>
      );
      return (
        <PagePad>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {squareTile(slides[0])}
            {squareTile(slides[1])}
          </div>
          <div style={{ marginTop: 12 }}>
            {landscape(slides[2])}
          </div>
        </PagePad>
      );
    };

    /* FY_M — FY_D recipe stripped of the CTA. Title bumped to H3
       (~20px) on a single line, sub on its own single line, and the
       avatar circle is gone — the glyph alone sits on the right at
       a larger size (60px) so the artwork carries more presence. */
    const FY_M = () => {
      const TEXT_TOP_CSS = 'calc(var(--bar-overlap, 118px) + 24px)';
      /* Peek layout. Geometry on a 360px phone shell:
         · Slide width 86% of container (≈ 310px) with 6px padding
           each side → active card ≈ 298px, centered.
         · Active card respects a visible screen margin on each side
           (≈ 31px on 360px — within DLS gutter range).
         · Adjacent slides extend behind, peeking ~25px into the
           viewport on each side; the inner card peek is ~19px past
           the slide gutter.
         · Card-to-card gap at the snap point = 2 × padding = 12px.
         strideRatio matches slide width so the hook advances by one
         slide per snap, not by container width. */
      const MIN_H = 184;
      const SLIDE_PCT = 86;
      const STRIDE = 0.86;
      const TEXT_BOTTOM = 28;
      const slideBg = (s) => (
        /* Linear fade pushed lower (transparent at 68% vs 55%) so
           the colour holds further down the slide. */
        `radial-gradient(ellipse 100% 70% at 8% 6%, ${s[0]} 0%, transparent 85%),
         radial-gradient(ellipse 100% 70% at 95% 10%, ${s[1]} 0%, transparent 85%),
         radial-gradient(ellipse 110% 60% at 50% 22%, ${s[2]} 0%, transparent 90%),
         linear-gradient(to bottom, transparent 68%, #FFFFFF 100%),
         #FFFFFF`
      );
      const [ref, idx, progress] = useInfiniteCarousel(FY_SLIDES_NO_BILLS.length, STRIDE);
      const lo = Math.floor(progress) % FY_SLIDES_NO_BILLS.length;
      const hi = (lo + 1) % FY_SLIDES_NO_BILLS.length;
      const t = progress - Math.floor(progress);
      const scheme = lerpScheme(fySchemeForSlide(FY_SLIDES_NO_BILLS[lo]), fySchemeForSlide(FY_SLIDES_NO_BILLS[hi]), t);
      const renderedSlides = [FY_SLIDES_NO_BILLS[FY_SLIDES_NO_BILLS.length - 1], ...FY_SLIDES_NO_BILLS, FY_SLIDES_NO_BILLS[0]];
      return (
        <div style={{ position: 'relative', marginTop: 'calc(-1 * var(--bar-overlap, 118px))', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0, background: slideBg(scheme),
            pointerEvents: 'none', zIndex: 0,
          }}/>
          <div ref={ref} style={{
            position: 'relative', zIndex: 1,
            display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory',
            overscrollBehavior: 'none',
          }} className="scrollbar-hide no-page-swipe">
            {renderedSlides.map((s, i) => {
              const meta = fyAvatarMeta(s.heroImg);
              return (
                <div key={i} style={{
                  flex: `0 0 ${SLIDE_PCT}%`, scrollSnapAlign: 'center',
                  position: 'relative', minHeight: MIN_H, overflow: 'hidden',
                  background: 'transparent',
                  paddingTop: TEXT_TOP_CSS, paddingBottom: TEXT_BOTTOM,
                  paddingLeft: 6, paddingRight: 6,
                  boxSizing: 'border-box',
                  display: 'flex', alignItems: 'center',
                }}>
                  {/* White DLS card wrapping the avatar + text — content
                     unchanged. Slide is 86% of container width with 6px
                     padding each side, so the card-to-card gap at the
                     snap point is 12px and the adjacent cards visibly
                     peek past the active one. */}
                  <div style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: CARD_BORDER, boxShadow: CARD_SHADOW,
                    borderRadius: 16, padding: '16px 20px',
                    display: 'flex', alignItems: 'center', gap: 14,
                  }}>
                    <FyDlsAvatar heroImg={s.heroImg} size={36} glyphSize={20} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        /* Smaller heading — buttonSmall step (14px) so
                           the title sits closer to the sub-caption and
                           reads as one tight unit on the card. */
                        fontFamily: 'Rubik', fontSize: 14, fontWeight: 500,
                        lineHeight: '20px', letterSpacing: '0.28px',
                        color: 'rgba(0,0,0,0.9)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>{s.title}</div>
                      <div style={{
                        ...T.caption, color: 'rgba(0,0,0,0.7)', marginTop: 2,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>{s.sub}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <CarouselDots count={FY_SLIDES_NO_BILLS.length} activeIdx={idx} bottom={0} />
        </div>
      );
    };

    /* FY_O — variant of FY_M where the icon colour MATCHES the
       slide's mesh hue directly (uses the vivid scheme stop instead
       of the slice brand accent). Tonally cohesive — icon reads as
       a deepened tone of the surrounding gradient, not a brand
       sticker on top of it. */
    const fyMatchedIconColor = (heroImg) => ({
      'fy_3d_bill.png':   '#2E7D55', // deep mint/forest matching pink-coral... wait mint scheme
      'fy_3d_drop.png':   '#A008A3', // Valentino-600
      'fy_3d_spends.png': '#1F4F9F', // deeper sky blue
    }[heroImg] || 'rgba(0,0,0,0.85)');
    const FY_O = () => {
      const TEXT_TOP_CSS = 'calc(var(--bar-overlap, 118px) + 24px)';
      const MIN_H = 184; // matches FY_M — shorter container, paginator flush
      const SLIDE_PCT = 100;
      const TEXT_BOTTOM = 32; // active content sits ~32px above the paginator
      const slideBg = (s) => (
        /* White fade pushed almost to the paginator (90% vs 72%) so
           the colour holds across the parallax band — text + icon
           drift on continuous mesh instead of crossing into a white
           frame that visually "cuts" the effect. */
        `radial-gradient(ellipse 100% 70% at 8% 6%, ${s[0]} 0%, transparent 85%),
         radial-gradient(ellipse 100% 70% at 95% 10%, ${s[1]} 0%, transparent 85%),
         radial-gradient(ellipse 110% 60% at 50% 22%, ${s[2]} 0%, transparent 90%),
         linear-gradient(to bottom, transparent 90%, #FFFFFF 100%),
         #FFFFFF`
      );
      const [ref, idx, progress] = useInfiniteCarousel(FY_SLIDES_NO_BILLS.length);
      const lo = Math.floor(progress) % FY_SLIDES_NO_BILLS.length;
      const hi = (lo + 1) % FY_SLIDES_NO_BILLS.length;
      const t = progress - Math.floor(progress);
      const scheme = lerpScheme(fySchemeForSlide(FY_SLIDES_NO_BILLS[lo]), fySchemeForSlide(FY_SLIDES_NO_BILLS[hi]), t);
      const renderedSlides = [FY_SLIDES_NO_BILLS[FY_SLIDES_NO_BILLS.length - 1], ...FY_SLIDES_NO_BILLS, FY_SLIDES_NO_BILLS[0]];
      return (
        <div style={{ position: 'relative', marginTop: 'calc(-1 * var(--bar-overlap, 118px))', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0, background: slideBg(scheme),
            pointerEvents: 'none', zIndex: 0,
          }}/>
          <div ref={ref} style={{
            position: 'relative', zIndex: 1,
            display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory',
            overscrollBehavior: 'none',
          }} className="scrollbar-hide no-page-swipe">
            {renderedSlides.map((s, i) => {
              const meta = fyAvatarMeta(s.heroImg);
              const iconColor = fyMatchedIconColor(s.heroImg);
              /* Parallax: text drifts WITH the scroll (lagging) at +56,
                 icon drifts AGAINST it (leading) at −40. Cross-fade keeps
                 only one slide visible at once so the parallax reads
                 cleanly without two text rows fighting across the seam. */
              const { signed: wrappedOffset } = wrappedCarouselDistance(i - 1, progress, FY_SLIDES_NO_BILLS.length);
              const textX = wrappedOffset * 56;
              const iconX = wrappedOffset * -40;
              const slideOpacity = Math.max(0, 1 - Math.abs(wrappedOffset));
              return (
                /* No per-slide overflow:hidden — slide-edge clipping
                   was cutting the parallax just as text/icon began to
                   drift. Section-level `overflow:hidden` on the parent
                   still bounds the effect, while the continuous mesh
                   below remains uninterrupted across slide seams. */
                <div key={i} style={{
                  flex: `0 0 ${SLIDE_PCT}%`, scrollSnapAlign: 'start',
                  position: 'relative', minHeight: MIN_H,
                  background: 'transparent',
                  paddingTop: TEXT_TOP_CSS, paddingBottom: TEXT_BOTTOM,
                  paddingLeft: 28, paddingRight: 24,
                  boxSizing: 'border-box',
                  display: 'flex', alignItems: 'center', gap: 16,
                  opacity: slideOpacity, willChange: 'opacity',
                }}>
                  <div style={{
                    flex: 1, minWidth: 0,
                    transform: `translateX(${textX}px)`,
                    willChange: 'transform',
                  }}>
                    <div style={{
                      fontFamily: 'Rubik', fontSize: 18, fontWeight: 500,
                      lineHeight: '24px', letterSpacing: '0.32px',
                      color: iconColor,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{s.title}</div>
                    <div style={{
                      ...T.caption, color: iconColor, opacity: 0.72, marginTop: 4,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{s.sub}</div>
                  </div>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                    style={{
                      flexShrink: 0,
                      transform: `translateX(${iconX}px)`,
                      willChange: 'transform',
                    }} aria-hidden="true">
                    {(meta.paths || []).map((p, i) => (
                      <path key={i} d={p} fill={iconColor} />
                    ))}
                  </svg>
                </div>
              );
            })}
          </div>
          <CarouselDots count={FY_SLIDES_NO_BILLS.length} activeIdx={idx} bottom={0} />
        </div>
      );
    };

    /* FY_H — single banner card. Uses the designed poster image
       (fy_h_banner.png — "5 new spark live · Get upto ₹2,700
       cashback" + brand logos) as the full card content. Native
       1074:528 aspect (~2.034:1). Asymmetric border-radius gives
       iOS-style continuous-curvature corner smoothing — closest
       CSS gets to the slice DLS 60% squircle without an SVG mask. */
    const FY_H = () => (
      <PagePad>
        <div style={{ paddingTop: 16 }}>
          <button className="tap" style={{
            width: '100%',
            aspectRatio: '1074 / 528',
            borderRadius: '24px / 20px',
            border: CARD_BORDER, boxShadow: CARD_SHADOW,
            backgroundImage: 'url(/assets/fy_h_banner.png)',
            backgroundSize: 'cover', backgroundPosition: 'center',
            cursor: 'pointer',
            display: 'block',
          }} aria-label="5 new sparks · cashback up to ₹2,700" />
        </div>
      </PagePad>
    );

    /* FY_J — partitioned carousel. Same hero+text layout as FY_D, but each
       slide carries its OWN discrete color block instead of a single background
       that fades between scheme colors. The result reads as a series of cards,
       not a continuous tinted surface. Hard edges at slide boundaries make
       the carousel feel snappier and more product-shelf-like. */
    const FY_J = ({ overlap = 'none' }) => {
      const TEXT_TOP_CSS = 'calc(var(--bar-overlap, 118px) + 24px)';
      /* Carousel height varies by which element overlaps the bottom edge:
         · 'none' : no overlap → standard 220 MIN_H, 52 TEXT_BOTTOM.
         · 'ab'   : AB_F pill (52px tall, marginTop:-44 → ~22px into the
                    carousel) → only needs a modest bump for the pill seam
                    + breathing above. MIN_H 240, TEXT_BOTTOM 70.
         · 'bills': BL_J card (~140px tall, marginTop:-68 → ~half-overlap)
                    → needs the full bump so the card's vertical center
                    lands on the seam with 40px clear above the card top.
                    MIN_H 292, TEXT_BOTTOM 108. */
      const hideDots = overlap !== 'none';
      const MIN_H = overlap === 'bills' ? 292 : overlap === 'ab' ? 240 : 220;
      const SLIDE_PCT = 100;
      const TEXT_BOTTOM = overlap === 'bills' ? 108 : overlap === 'ab' ? 70 : 52;
      const [ref, idx] = useInfiniteCarousel(FY_SLIDES_NO_BILLS.length);
      const renderedSlides = [FY_SLIDES_NO_BILLS[FY_SLIDES_NO_BILLS.length - 1], ...FY_SLIDES_NO_BILLS, FY_SLIDES_NO_BILLS[0]];
      /* The active slide's scheme drives a parent-level absolute bg. As
         the carousel snaps to the next slide, the bg hard-cuts to the new
         scheme — no fade interpolation. The bg layer uses inset:0 + the
         parent's negative marginTop so it stretches up under the app bar. */
      const currentScheme = FY_SCHEMES[idx % FY_SCHEMES.length];
      const sectionBg = `linear-gradient(180deg, ${currentScheme[0]} 0%, ${currentScheme[1]} 100%)`;
      return (
        <>
          <div style={{ position: 'relative', marginTop: 'calc(-1 * var(--bar-overlap, 118px))', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', inset: 0, background: sectionBg,
              pointerEvents: 'none', zIndex: 0,
            }} />
            <div ref={ref} style={{
              position: 'relative', zIndex: 1,
              display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory',
              overscrollBehavior: 'none',
            }} className="scrollbar-hide no-page-swipe">
              {renderedSlides.map((s, i) => (
                <div key={i} style={{
                  flex: `0 0 ${SLIDE_PCT}%`, scrollSnapAlign: 'start',
                  position: 'relative', minHeight: MIN_H, overflow: 'hidden',
                  background: 'transparent',
                }}>
                  <div style={{
                    position: 'absolute', right: 20, top: TEXT_TOP_CSS, bottom: TEXT_BOTTOM,
                    width: 96, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    pointerEvents: 'none',
                  }}>
                    <img src={`/assets/${s.heroImg}`} alt="" style={{
                      width: 96, height: 96, objectFit: 'contain',
                      borderRadius: 20, display: 'block',
                    }} />
                  </div>
                  <div style={{
                    position: 'relative', width: '100%',
                    paddingTop: TEXT_TOP_CSS, paddingRight: 120, paddingBottom: TEXT_BOTTOM, paddingLeft: 28,
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                    minHeight: MIN_H, boxSizing: 'border-box', zIndex: 1,
                  }}>
                    <div>
                      <div style={{ ...T.h4, lineHeight: '20px' }}>{s.title}</div>
                      <div style={{ ...T.caption, color: 'rgba(0,0,0,0.7)', marginTop: 4 }}>{s.sub}</div>
                    </div>
                    <button className="tap" style={{
                      alignSelf: 'flex-start', marginTop: 12,
                      padding: '6px 14px', background: '#000', border: 'none', borderRadius: 100,
                      ...T.btnSm, color: 'white', cursor: 'pointer', whiteSpace: 'nowrap',
                    }}>{s.cta}</button>
                  </div>
                </div>
              ))}
            </div>
            {!hideDots && <CarouselDots count={FY_SLIDES_NO_BILLS.length} activeIdx={idx} bottom={16} />}
          </div>
        </>
      );
    };

    /* For You F — centered layout carousel using the FY_L bg images
       per slide (pink / galaxy / violet posters). Mesh gradient and
       avatar dropped: the image IS the hero. A per-slide bottom-to-
       white overlay preserves the fade so copy + paginator land on
       clean white. */
    /* Wrapped distance/offset across an infinite carousel of length N.
       Returns the *shortest signed* distance from `pos` to the loop's
       fractional `progress`, so slides near the deck edges still resolve
       to the smaller offset. Used by FY_F / FY_L / FY_O for parallax + crossfade. */
    const wrappedCarouselDistance = (pos, progress, N) => {
      const raw = pos - progress;
      const abs = Math.min(Math.abs(raw), Math.abs(raw - N), Math.abs(raw + N));
      const signed =
        Math.abs(raw) <= N / 2 ? raw : (raw > 0 ? raw - N : raw + N);
      return { abs, signed };
    };

    /* Fade-to-white runway used at the bottom of the FY_F hero — longer
       eased stops so the deck artwork tapers into the white below the
       paginator instead of cutting hard. */
    const FY_F_FADE_OVERLAY = 'linear-gradient(to bottom, rgba(255,255,255,0) 50%, rgba(255,255,255,0.15) 64%, rgba(255,255,255,0.5) 78%, rgba(255,255,255,0.9) 89%, #FFFFFF 93%, #FFFFFF 100%)';

    const FY_F = () => {
      const PAD_TOP_CSS = 'calc(var(--bar-overlap, 118px) + 4px)';
      /* Hero grown so the fade-to-white has a long, smooth runway
         (≥150px). Content sits centred; the lower band fades to white. */
      const MIN_H = 380;
      const N = FY_SLIDES_NO_BILLS.length;
      const [ref, idx, progress] = useInfiniteCarousel(N);
      const renderedSlides = [FY_SLIDES_NO_BILLS[N - 1], ...FY_SLIDES_NO_BILLS, FY_SLIDES_NO_BILLS[0]];
      /* Per-real-slide image opacity from wrapped progress — same trick
         as FY_L. Background deck lifts out of the scroller and crossfades
         in place, so the artwork doesn't slide past itself at the seam. */
      const imageOpacities = FY_SLIDES_NO_BILLS.map((_, p) =>
        Math.max(0, 1 - wrappedCarouselDistance(p, progress, N).abs)
      );
      return (
        <>
          <div style={{ position: 'relative', marginTop: 'calc(-1 * var(--bar-overlap, 118px))', overflow: 'hidden' }}>
            {FY_SLIDES_NO_BILLS.map((_, p) => (
              <div key={p} aria-hidden style={{
                position: 'absolute', inset: 0, zIndex: 0,
                backgroundImage: `url(/assets/${FY_HERO_SLIDES[p % FY_HERO_SLIDES.length].bg})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                opacity: imageOpacities[p],
                pointerEvents: 'none', willChange: 'opacity',
              }} />
            ))}
            <div aria-hidden style={{
              position: 'absolute', inset: 0, zIndex: 1,
              background: FY_F_FADE_OVERLAY,
              pointerEvents: 'none',
            }} />
            <div ref={ref} style={{
              position: 'relative', zIndex: 2,
              display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory',
              overscrollBehavior: 'none',
            }} className="scrollbar-hide no-page-swipe">
              {renderedSlides.map((s, i) => {
                /* FY_L motion recipe: text fades ×2.6 and parallax-X drifts 60px/unit. */
                const { abs: dist, signed: wrappedOffset } = wrappedCarouselDistance(i - 1, progress, N);
                const textOpacity = Math.max(0, 1 - dist * 2.6);
                const parallaxX = wrappedOffset * 60;
                return (
                  <div key={i} style={{
                    flex: '0 0 100%', scrollSnapAlign: 'start',
                    minHeight: MIN_H, overflow: 'hidden',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    textAlign: 'center',
                    paddingTop: PAD_TOP_CSS, paddingRight: 36, paddingBottom: 48, paddingLeft: 36,
                    boxSizing: 'border-box',
                    background: 'transparent',
                  }}>
                    <div style={{
                      position: 'relative', zIndex: 3,
                      transform: `translate(${parallaxX}px, -12px)`,
                      opacity: textOpacity,
                      willChange: 'transform, opacity',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                    }}>
                      <div style={{ ...T.h3, color: '#FFFFFF' }}>{s.title}</div>
                      <div style={{
                        fontFamily: 'Rubik', fontSize: 14, fontWeight: 400,
                        lineHeight: '20px', letterSpacing: '0.28px',
                        color: 'rgba(255,255,255,0.85)', marginTop: 4,
                      }}>{s.sub}</div>
                      <button className="tap" style={{
                        marginTop: 16,
                        padding: '6px 14px', background: '#FFFFFF', border: 'none', borderRadius: 100,
                        ...T.btnSm, color: 'rgba(0,0,0,0.9)', cursor: 'pointer', whiteSpace: 'nowrap',
                      }}>{s.cta}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      );
    };

    /* FY_N — Shorter FY_F. Same centered image-hero carousel with
       crossfade + bottom fade-to-white, but MIN_H reduced from 380
       to 300 so it takes less vertical space. */
    const FY_N = () => {
      const PAD_TOP_CSS = 'calc(var(--bar-overlap, 118px) + 24px)';
      const MIN_H = 300;
      const N = FY_SLIDES_NO_BILLS.length;
      const [ref, idx, progress] = useInfiniteCarousel(N);
      const renderedSlides = [FY_SLIDES_NO_BILLS[N - 1], ...FY_SLIDES_NO_BILLS, FY_SLIDES_NO_BILLS[0]];
      const imageOpacities = FY_SLIDES_NO_BILLS.map((_, p) =>
        Math.max(0, 1 - wrappedCarouselDistance(p, progress, N).abs)
      );
      return (
        <>
          <div style={{ position: 'relative', marginTop: 'calc(-1 * var(--bar-overlap, 118px))', overflow: 'hidden' }}>
            {FY_SLIDES_NO_BILLS.map((_, p) => (
              <div key={p} aria-hidden style={{
                position: 'absolute', inset: 0, zIndex: 0,
                backgroundImage: `url(/assets/${FY_HERO_SLIDES[p % FY_HERO_SLIDES.length].bg})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                opacity: imageOpacities[p],
                pointerEvents: 'none', willChange: 'opacity',
              }} />
            ))}
            <div aria-hidden style={{
              position: 'absolute', inset: 0, zIndex: 1,
              background: 'linear-gradient(to bottom, rgba(255,255,255,0) 65%, rgba(255,255,255,0.3) 80%, rgba(255,255,255,0.7) 90%, #FFFFFF 96%, #FFFFFF 100%)',
              pointerEvents: 'none',
            }} />
            <div ref={ref} style={{
              position: 'relative', zIndex: 2,
              display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory',
              overscrollBehavior: 'none',
            }} className="scrollbar-hide no-page-swipe">
              {renderedSlides.map((s, i) => {
                const { abs: dist, signed: wrappedOffset } = wrappedCarouselDistance(i - 1, progress, N);
                const textOpacity = Math.max(0, 1 - dist * 2.6);
                const parallaxX = wrappedOffset * 60;
                return (
                  <div key={i} style={{
                    flex: '0 0 100%', scrollSnapAlign: 'start',
                    minHeight: MIN_H, overflow: 'hidden',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    textAlign: 'center',
                    paddingTop: PAD_TOP_CSS, paddingRight: 36, paddingBottom: 48, paddingLeft: 36,
                    boxSizing: 'border-box',
                    background: 'transparent',
                  }}>
                    <div style={{
                      position: 'relative', zIndex: 3,
                      transform: `translate(${parallaxX}px, -12px)`,
                      opacity: textOpacity,
                      willChange: 'transform, opacity',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                    }}>
                      <div style={{ ...T.h4, color: '#FFFFFF' }}>{s.title}</div>
                      <div style={{
                        ...T.caption, color: 'rgba(255,255,255,0.85)', marginTop: 4,
                      }}>{s.sub}</div>
                      <button className="tap" style={{
                        marginTop: 12,
                        padding: '5px 12px', background: '#FFFFFF', border: 'none', borderRadius: 100,
                        ...T.caption, fontWeight: 500, color: 'rgba(0,0,0,0.9)', cursor: 'pointer', whiteSpace: 'nowrap',
                      }}>{s.cta}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      );
    };

    /* FY_P — FY_D layout (left-aligned text + DLS avatar, side-by-side)
       but with FY_F's image backgrounds and bottom fade-to-white overlay
       instead of D's mesh-gradient. Best of both: editorial photography
       bg + compact informational layout. */
    /* FY_P — D's left-aligned layout + colour mesh gradient (not images),
       with F's bottom fade-to-white overlay. Blends D's informational
       layout with F's soft bottom edge. */
    const FY_P = () => {
      const TEXT_TOP_CSS = 'calc(var(--bar-overlap, 118px) + 24px)';
      const MIN_H = 260;
      const SLIDE_PCT = 100;
      const TEXT_BOTTOM = 42;
      const slideBg = (s) => `
        radial-gradient(ellipse 100% 70% at 8% 6%, ${s[0]} 0%, transparent 85%),
        radial-gradient(ellipse 100% 70% at 95% 10%, ${s[1]} 0%, transparent 85%),
        radial-gradient(ellipse 110% 60% at 50% 22%, ${s[2]} 0%, transparent 90%),
        linear-gradient(to bottom, transparent 55%, rgba(255,255,255,0.5) 78%, #FFFFFF 92%),
        #FFFFFF
      `;
      const N = FY_SLIDES_NO_BILLS.length;
      const [ref, idx, progress] = useInfiniteCarousel(N);
      const lo = Math.floor(progress) % N;
      const hi = (lo + 1) % N;
      const t = progress - Math.floor(progress);
      const scheme = lerpScheme(fySchemeForSlide(FY_SLIDES_NO_BILLS[lo]), fySchemeForSlide(FY_SLIDES_NO_BILLS[hi]), t);
      const renderedSlides = [FY_SLIDES_NO_BILLS[N - 1], ...FY_SLIDES_NO_BILLS, FY_SLIDES_NO_BILLS[0]];
      return (
        <>
          <div style={{ position: 'relative', marginTop: 'calc(-1 * var(--bar-overlap, 118px))', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', inset: 0, background: slideBg(scheme),
              pointerEvents: 'none', zIndex: 0,
            }} />
            <div ref={ref} style={{
              position: 'relative', zIndex: 1,
              display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory',
              overscrollBehavior: 'none',
            }} className="scrollbar-hide no-page-swipe">
              {renderedSlides.map((s, i) => {
                const meta = fyAvatarMeta(s.heroImg);
                return (
                  <div key={i} style={{
                    flex: `0 0 ${SLIDE_PCT}%`, scrollSnapAlign: 'start',
                    position: 'relative', minHeight: MIN_H, overflow: 'hidden',
                    background: 'transparent',
                  }}>
                    <div style={{
                      position: 'absolute', right: 24, top: TEXT_TOP_CSS, bottom: TEXT_BOTTOM,
                      width: 60, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                      pointerEvents: 'none',
                    }}>
                      <FyDlsAvatar heroImg={s.heroImg} size={60} glyphSize={30} tone="subtle" />
                    </div>
                    <div style={{
                      position: 'relative', width: '100%',
                      paddingTop: TEXT_TOP_CSS, paddingRight: 110, paddingBottom: TEXT_BOTTOM, paddingLeft: 28,
                      display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
                      minHeight: MIN_H, boxSizing: 'border-box', zIndex: 1,
                    }}>
                      <div>
                        <div style={{ ...T.h4, lineHeight: '20px' }}>{s.title}</div>
                        <div style={{ ...T.caption, color: 'rgba(0,0,0,0.7)', marginTop: 4 }}>{s.sub}</div>
                      </div>
                      <button className="tap" style={{
                        alignSelf: 'flex-start', marginTop: 8,
                        background: 'transparent', border: 'none', padding: 0,
                        ...T.btnSm, color: meta.accent,
                        cursor: 'pointer', whiteSpace: 'nowrap',
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                      }}>
                        {s.cta}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M9 6l6 6-6 6" stroke={meta.accent} strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <CarouselDots count={N} activeIdx={idx} bottom={12} />
          </div>
          {/* Divider below paginator */}
          <div style={{
            height: 1, background: 'rgba(0,0,0,0.05)',
            marginLeft: 24, marginRight: 24, marginTop: 12,
          }} />
        </>
      );
    };

    /* Promo hero slides for FY_L — each card is a full-bleed
       cashback/drop poster. No icons, no chips; the artwork carries
       the visual weight, copy sits at the bottom in white. */
    const FY_HERO_SLIDES = [
      { bg: 'fy_bg_pink.png',   title: 'UPI cashback drop', sub: 'Tap to grab ₹40 back', cta: 'Claim' },
      { bg: 'fy_bg_galaxy.png', title: 'Spark of the day',  sub: '5 brands, ready to drop', cta: 'Explore' },
      { bg: 'fy_bg_violet.png', title: 'Friday flash drop', sub: '₹100 back on Swiggy', cta: 'Grab now' },
    ];

    /* FY_L — Image-hero carousel: slides AND crossfades.
       · useInfiniteCarousel gives swipe + auto-advance horizontal
         scroll-snap (4s pause on touch). Slides translate naturally.
       · Per-slide image opacity is interpolated from the carousel's
         progress so adjacent slides crossfade WHILE they slide —
         outgoing slide fades down to 0.3 by the time it's fully
         offscreen, incoming fades up to 1. The combined effect reads
         as a smooth slide+fade rather than a hard slide cut.
       · Each slide's text replays the `.fy-l-text-in` CSS animation
         (opacity 0→1 + translateY 8→0 + blur 4→0, 220ms delay) when
         it becomes the active idx, so the copy lands AFTER the image
         has crossed into place. */
    const FY_L = () => {
      const MIN_H = 328;
      const SLIDE_PCT = 100;
      const slides = FY_HERO_SLIDES;
      const [ref, idx, progress] = useInfiniteCarousel(slides.length);
      const renderedSlides = [slides[slides.length - 1], ...slides, slides[0]];
      /* Per-real-slide image opacity from the wrapped progress. Lifts
         the image layer OUT of the horizontal scroller so the artwork
         crossfades in place instead of sliding past each other — no
         more hard contrast seam at the slide boundary. Text + button
         still ride inside the scroller and get horizontal parallax. */
      const imageOpacities = slides.map((_, p) =>
        Math.max(0, 1 - wrappedCarouselDistance(p, progress, slides.length).abs)
      );
      return (
        <div style={{
          /* Sticky pin: hero stays anchored at the top while the
             kiosk sheet below it scrolls UP over it. top is set to
             the same negative bar overlap as the marginTop, so the
             hero stays bled under the (transparent) app bar at all
             times. zIndex 0 puts the kiosk (zIndex 2) above. */
          position: 'sticky',
          top: 'calc(-1 * var(--bar-overlap, 118px))',
          marginTop: 'calc(-1 * var(--bar-overlap, 118px))',
          zIndex: 0,
          overflow: 'hidden',
          background: '#0d0317',
        }}>
          {/* Background image deck — absolute-stacked, crossfade
             in place. Images don't translate; they fade between
             slides based on scroll progress. No sliding artwork =
             no edge seam at all. */}
          {slides.map((s, p) => (
            <div key={p} aria-hidden style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(/assets/${s.bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: imageOpacities[p],
              pointerEvents: 'none',
              willChange: 'opacity',
            }} />
          ))}
          {/* Subtle white edge-glow on top of the bg deck so the
             active slide reads as "lit" while the dissolving outgoing
             slide softens at the seam — soft edge bleed feels like
             one continuous canvas, no contrast line. */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, transparent 12%, transparent 88%, rgba(255,255,255,0.06) 100%)',
            pointerEvents: 'none',
          }} />
          <div ref={ref} style={{
            position: 'relative',
            display: 'flex', overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            overscrollBehavior: 'none',
          }} className="scrollbar-hide no-page-swipe">
            {renderedSlides.map((s, i) => {
              /* Text fades aggressively (×2.6) so it's invisible well
                 BEFORE the parallax pushes it to the screen edge — no
                 half-faded text drifting off-screen during the transition.
                 Fully gone by dist ≈ 0.38. Parallax at 60px/unit. */
              const { abs: dist, signed: wrappedOffset } = wrappedCarouselDistance(i - 1, progress, slides.length);
              const textOpacity = Math.max(0, 1 - dist * 2.6);
              const parallaxX = wrappedOffset * 60;
              return (
                <div key={i} style={{
                  flex: `0 0 ${SLIDE_PCT}%`, scrollSnapAlign: 'start',
                  position: 'relative', minHeight: MIN_H, overflow: 'hidden',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'flex-end',
                  textAlign: 'center',
                  paddingTop: 'calc(var(--bar-overlap, 118px) + 16px)',
                  paddingRight: 24, paddingBottom: 84, paddingLeft: 24,
                  boxSizing: 'border-box',
                  /* Transparent — the background image deck above
                     renders the actual artwork and crossfades in place
                     decoupled from the horizontal scroll. */
                  background: 'transparent',
                }}>
                  <div style={{
                    position: 'relative', zIndex: 1,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    transform: `translateX(${parallaxX}px)`,
                    opacity: textOpacity,
                    willChange: 'transform, opacity',
                  }}>
                    <div style={{
                      ...T.h3, color: '#FFFFFF',
                      textShadow: '0 1px 2px rgba(0,0,0,0.25)',
                    }}>{s.title}</div>
                    <div style={{
                      ...T.caption, color: 'rgba(255,255,255,0.85)', marginTop: 4,
                      textShadow: '0 1px 2px rgba(0,0,0,0.25)',
                    }}>{s.sub}</div>
                    <button className="tap" style={{
                      marginTop: 14, padding: '8px 16px',
                      background: '#FFFFFF', border: 'none', borderRadius: 100,
                      ...T.btnSm, color: '#171A1F', cursor: 'pointer', whiteSpace: 'nowrap',
                    }}>{s.cta}</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    /* Utility-driven For You content. PM brief: A & D feel like marketing
       banners; bills are surfaced in the Bills section, not here. So this
       array carries personalised STATUS items only — what changed for the
       user this week, with real numbers, no marketing slides. Bills are
       intentionally absent. */
    const FY_UTILITY_ITEMS = [
      { meta: 'SPENDS · MAY',          title: '₹18,420 spent this month',
        sub:  '22% higher than your usual', cta: 'Insights',
        icon: 'may_spends.png' },
      { meta: 'SPARK · 2 DAYS LEFT',   title: '5 sparks live for you',
        sub:  'Avg ₹40 cashback per spark',  cta: 'View',
        icon: 'spark_icon.png' },
      { meta: 'CREDIT SCORE',          title: '785 → 792',
        sub:  'On-time payments lifted it',  cta: 'Check',
        icon: 'credit_score_icon.png' },
    ];

    /* Small chip rendering for the metadata label. The plain T.meta style
       is too low-contrast on a busy card; a brand-tinted chip gives the
       tag the visual weight it needs to function as the leading hierarchy
       marker. Valentino-50 fill + Valentino-600 text per DLS. */
    const MetaChip = ({ children }) => (
      <span style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 4,
        background: '#FAE2FA',
        color: '#A008A3',
        fontSize: 10,
        lineHeight: '14px',
        fontWeight: 500,
        letterSpacing: '0.4px',
        textTransform: 'uppercase',
      }}>{children}</span>
    );

    /* Lighter card shadow used by the stacked-deck variants — the 32px-blur
       CARD_SHADOW reads too heavy on closely stacked cards. */
    const STACK_CARD_SHADOW = '0 2px 12px rgba(0, 0, 0, 0.06)';

    /* Monies — in-app currency users earn from fire games and other
       reward mechanics. Rendered inline as an SVG glyph so it can sit
       alongside the amount the way the rupee symbol normally would.
       `currentColor` lets the glyph inherit the surrounding text color. */
    const MoniesGlyph = ({ size = 14, color = 'currentColor' }) => (
      /* viewBox tightened to the artwork bounds (path runs ~x:2 → 7.7,
         y:0.1 → 9.6). The original 0 0 10 10 box left ~2 units of empty
         space on each side, rendering as visible padding after the
         glyph — fixed by cropping to "2 0 6 10" and matching width to
         the new aspect (0.6 × height). */
      <svg width={size * 0.6} height={size} viewBox="2 0 6 10" fill="none"
        style={{ display: 'inline-block', verticalAlign: '-0.14em', flexShrink: 0 }}
        aria-hidden="true">
        <path d="M3.76864 7.50822L4.8883 7.54262C5.62653 7.54262 6.33541 7.25939 6.88585 6.74455C7.41751 6.24002 7.7121 5.56694 7.7121 4.84111C7.7121 4.11528 7.41634 3.4422 6.88585 2.93767C6.34949 2.43314 5.63592 2.15451 4.87304 2.15451C3.54917 2.15451 2.41777 2.99615 2.12202 4.19325L2.10206 4.29874C2.06803 4.4673 2.10206 4.64045 2.20065 4.78951C2.29454 4.92367 2.44125 5.01999 2.61377 5.05439C2.64781 5.06356 2.69241 5.06356 2.73231 5.06356C2.97878 5.06356 3.20999 4.92367 3.31796 4.70351L3.43063 4.46271C3.76982 3.79422 4.27214 3.43876 4.88243 3.43876C5.28617 3.43876 5.65939 3.58782 5.9352 3.8527C6.2157 4.12216 6.36827 4.48221 6.36827 4.85716C6.36827 5.23212 6.2157 5.58758 5.9352 5.85704C5.63944 6.1265 5.27091 6.27557 4.88713 6.27557H2.67832C2.31919 6.27557 2.0293 6.56452 2.0293 6.91999C2.0293 7.64123 2.31919 8.3189 2.85554 8.82343C3.37195 9.32337 4.10548 9.60659 4.86366 9.60659H5.05027C5.4094 9.60659 5.69929 9.31763 5.69929 8.96217C5.69929 8.60671 5.4094 8.31775 5.05027 8.31775H4.88243C4.4787 8.31775 4.08553 8.18818 3.82967 7.90381C3.75925 7.82584 3.70761 7.72379 3.6724 7.64238C3.64541 7.57816 3.69588 7.50707 3.76747 7.50936L3.76864 7.50822Z" fill={color} />
        <path d="M3.0433 1.39428H6.68513C7.05953 1.39428 7.35881 1.11106 7.35881 0.764768C7.35881 0.41848 7.05366 0.135257 6.68513 0.135257H3.0433C2.66891 0.134111 2.36846 0.417333 2.36846 0.763622C2.36846 1.10991 2.6736 1.39313 3.04213 1.39313L3.0433 1.39428Z" fill={color} />
      </svg>
    );

    /* FY_I — Shuffle deck. Drag the top card any direction; release past
       threshold deals it to the bottom of the stack.

       Animation uses the Web Animations API (`Element.animate()`) instead
       of CSS transitions so we get an explicit, deterministic keyframe
       sequence — no React batching or transition-trigger races.

       Sequence on commit:
       1. State updates immediately: order rotates, drag resets. React
          re-renders. The leaving card is now at stackPos N-1, so its
          z-index drops to lowest — it's already "behind" the others.
       2. In the next animation frame we run a WAAPI keyframe on the
          leaving card from its drop position back to the rear-stack
          slot. The card visually starts at the drop point, then slides
          down/back into the deck. */
    const FY_I = ({ autoScroll, surface = 'solid', items: itemsProp, renderContent, outerPaddingTop = 16 }) => {
      const isGlass = surface === 'glass';
      const items = itemsProp || FY_SLIDES_NO_BILLS;
      const N = items.length;
      const [order, setOrder] = React.useState(() => items.map((_, i) => i));
      const [drag, setDrag] = React.useState({ x: 0, y: 0 });
      const [dragging, setDragging] = React.useState(false);
      /* Pause auto-scroll when deck is in the top 25% of the scroll
         container. Uses state so the auto-cycle effect re-triggers
         when the deck scrolls back into the safe zone. */
      const deckRef = React.useRef(null);
      const [deckVisible, setDeckVisible] = React.useState(true);
      React.useEffect(() => {
        const el = deckRef.current;
        if (!el) return;
        const scroller = el.closest('.screen-scroll');
        if (!scroller) return;
        let last = true;
        const check = () => {
          const scrollerRect = scroller.getBoundingClientRect();
          const deckRect = el.getBoundingClientRect();
          const relTop = deckRect.top - scrollerRect.top;
          const ok = relTop >= scrollerRect.height * 0.25;
          if (ok !== last) { last = ok; setDeckVisible(ok); }
        };
        scroller.addEventListener('scroll', check, { passive: true });
        check();
        return () => scroller.removeEventListener('scroll', check);
      }, []);
      const start = React.useRef({ x: 0, y: 0 });
      const cardRefs = React.useRef({});
      /* Commit threshold — small flicks should NOT trigger the deal-back.
         100 was too far, 55 too easy. 70 reads as a deliberate gesture
         without demanding a full pull. */
      const COMMIT_DIST = 70;
      /* Bounded drag region — generous so the card has visible travel
         in both directions before it hits the clamp. The card stays
         centred, but the user gets real movement to feel the gesture
         (was 130/70 — felt locked-in too early). */
      const DRAG_LIMIT_X = 180;
      const DRAG_LIMIT_Y = 110;
      /* ease-out-expo — punchy at start, long quiet tail. Combined with a
         longer duration (820ms) the deal-back reads as a smooth settle
         rather than a quick snap. */
      const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
      const CARD_H = 76;
      const PEEK = 14;
      const stackHeight = CARD_H + (N - 1) * PEEK;

      const cancelInProgress = (origIdx) => {
        const el = cardRefs.current[origIdx];
        if (el && el.getAnimations) el.getAnimations().forEach(a => a.cancel());
      };
      /* Inner setTimeout IDs scheduled by the auto-cycle (the z-drop at apex
         and the setOrder at the end of the cycle). Tracked in a ref so a
         manual drag can clear them — otherwise a stale setOrder from an
         in-flight cycle would fire AFTER the user committed a drag and
         silently reshuffle the deck, manifesting as the middle card
         "randomly" appearing on top. */
      const cycleTimers = React.useRef([]);
      const clearCycleTimers = () => {
        cycleTimers.current.forEach(t => clearTimeout(t));
        cycleTimers.current = [];
      };
      /* Cancel every in-flight auto-cycle animation and clear the
         elevated z-index the cycle sets on the leaving card. Used on
         pointer-down so the user's drag starts from a clean state with
         no WAAPI fighting the inline drag transform. */
      const cancelAllInProgress = () => {
        Object.keys(cardRefs.current).forEach(k => {
          const el = cardRefs.current[k];
          if (!el) return;
          if (el.getAnimations) el.getAnimations().forEach(a => a.cancel());
        });
        clearCycleTimers();
        /* Clear any in-flight z-lift via React so the next render
           rebinds z-indexes deterministically from stack position. */
        setZOverride(null);
      };

      /* Cooldown after manual interaction — auto-cycle pauses while the
         user is touching the stack and for a short beat after release so
         their drop animation can settle before the deck starts shuffling
         again. */
      const COOLDOWN_MS = 1500;
      const [cooldown, setCooldown] = React.useState(false);
      const cooldownTimer = React.useRef(null);
      /* Z-override for the auto-cycle. React owns z-index so any JS-only
         tweak (cancelAllInProgress, etc.) can't desync with React's
         next render — which previously left non-top cards with empty
         inline z, falling back to natural DOM order (3rd card on top
         of 2nd). Shape: { id, z } or null. */
      const [zOverride, setZOverride] = React.useState(null);
      const armCooldown = () => {
        if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
        setCooldown(true);
        cooldownTimer.current = setTimeout(() => setCooldown(false), COOLDOWN_MS);
      };
      React.useEffect(() => () => {
        if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
      }, []);

      /* Auto-cycle — deck-shuffle physics. The leaving card:
         1. Rises out of the deck (0 → 0.28)
         2. DWELLS at the top, visibly on top of the stack (0.28 → 0.5)
         3. Descends behind the deck into the rear slot (0.5 → 1.0)

         The dwell is the missing beat in the previous arc — without it
         the card just flicked through the apex and went straight back,
         never reading as "pulled out of the deck and placed at the
         bottom". The other cards stay still during the lift+dwell and
         only rise during the descent half — synchronised with the
         leaving card going behind.

         Z-index: 50 (well above app bar at 30) through lift+dwell,
         dropped to 0 right when the descent begins, so the card slides
         UNDER the rising cards. Bumped from 35 → 50 because on mobile
         the dragged card was getting clipped behind the app bar in some
         scroll positions. */
      React.useEffect(() => {
        if (!autoScroll || dragging || cooldown || !deckVisible) return;
        const id = setTimeout(() => {
          const topId = order[0];
          const topEl = cardRefs.current[topId];
          if (!topEl || !topEl.animate) return;
          /* Locked-in animation values (tuned via the live panel and
             frozen). Rise uses ease-out-cubic so the lift accelerates
             gently then decelerates into the apex; descent uses
             ease-out-quart so the card eases into the rear slot. */
          const LIFT_DIST = 28;
          const DURATION = 800;
          const APEX_AT = 0.2;
          const RISE_EASE = 'cubic-bezier(0.33, 1, 0.68, 1)';
          const DESCENT_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
          const newOrder = [...order.slice(1), order[0]];
          /* Cancel any animations that are still alive from the previous
             cycle BEFORE arming new ones. Without this, stale
             fill:forwards animations from N cycles ago accumulate and
             intermittently win the transform race — manifesting as ghost
             cards stuck mid-arc or text from the back card peeking
             through the front. */
          Object.values(cardRefs.current).forEach((el) => {
            if (el && el.getAnimations) el.getAnimations().forEach((a) => a.cancel());
          });
          /* Lift leaving card above the deck via React state — no inline
             style.zIndex manipulation. */
          setZOverride({ id: topId, z: 50 });
          order.forEach((origIdx, currentPos) => {
            const el = cardRefs.current[origIdx];
            if (!el || !el.animate) return;
            const newPos = newOrder.indexOf(origIdx);
            const fromY = currentPos * PEEK;
            const fromScale = 1 - currentPos * 0.04;
            const toY = newPos * PEEK;
            const toScale = 1 - newPos * 0.04;
            const wasTop = (currentPos === 0);
            const keyframes = wasTop
              ? [
                  { transform: `translate(0px, ${fromY}px) scale(${fromScale}) rotate(0deg)`, offset: 0, easing: RISE_EASE },
                  { transform: `translate(0px, ${-LIFT_DIST}px) scale(1) rotate(0deg)`, offset: APEX_AT, easing: DESCENT_EASE },
                  { transform: `translate(0px, ${toY}px) scale(${toScale}) rotate(0deg)`, offset: 1 },
                ]
              : [
                  /* Non-top cards hold until the leaving card crests the
                     apex, then rise in sync with its descent. */
                  { transform: `translate(0px, ${fromY}px) scale(${fromScale}) rotate(0deg)`, offset: 0, easing: 'linear' },
                  { transform: `translate(0px, ${fromY}px) scale(${fromScale}) rotate(0deg)`, offset: APEX_AT, easing: DESCENT_EASE },
                  { transform: `translate(0px, ${toY}px) scale(${toScale}) rotate(0deg)`, offset: 1 },
                ];
            /* fill:forwards holds the end transform until we cancel it
               in the setOrder callback — no gap frame where the card
               snaps to its old React position. */
            el.animate(keyframes, { duration: DURATION, fill: 'forwards' });
          });
          const tApex = setTimeout(() => {
            setZOverride({ id: topId, z: 0 });
          }, DURATION * APEX_AT);
          cycleTimers.current.push(tApex);
          const tEnd = setTimeout(() => {
            /* Cancel all forwards-filled animations RIGHT BEFORE
               React re-renders with new positions — zero gap. */
            Object.values(cardRefs.current).forEach((el) => {
              if (el && el.getAnimations) el.getAnimations().forEach((a) => a.cancel());
            });
            setOrder(newOrder);
            setZOverride(null);
          }, DURATION);
          cycleTimers.current.push(tEnd);
        }, 2500);
        return () => {
          clearTimeout(id);
          clearCycleTimers();
        };
      }, [autoScroll, dragging, cooldown, deckVisible, order]);

      const onPointerDown = (e) => {
        if (dragging) return;
        /* Cancel every in-flight auto-cycle animation across the deck so
           the user's drag doesn't fight a mid-cycle WAAPI. Arming the
           cooldown also blocks auto-cycle from re-triggering while the
           user is interacting. */
        cancelAllInProgress();
        armCooldown();
        start.current = { x: e.clientX, y: e.clientY };
        setDrag({ x: 0, y: 0 });
        setDragging(true);
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
      };
      const onPointerMove = (e) => {
        if (!dragging) return;
        /* Clamp to the centred drag zone so the card can't be flung to
           the corners of the screen. Past the limit the finger keeps
           moving but the card stops. */
        const rawX = e.clientX - start.current.x;
        const rawY = e.clientY - start.current.y;
        const x = Math.max(-DRAG_LIMIT_X, Math.min(DRAG_LIMIT_X, rawX));
        const y = Math.max(-DRAG_LIMIT_Y, Math.min(DRAG_LIMIT_Y, rawY));
        setDrag({ x, y });
      };
      const endDrag = () => {
        if (!dragging) return;
        /* Reset cooldown so it starts ticking from release, giving the
           drop animation time to settle before auto-cycle resumes. */
        armCooldown();
        const fromX = drag.x;
        const fromY = drag.y;
        const fromRot = Math.max(-10, Math.min(10, fromX * 0.05));
        const dist = Math.hypot(fromX, fromY);
        const commit = dist > COMMIT_DIST;
        const topId = order[0];

        if (commit) {
          /* Coherence: drive EVERY card's motion through WAAPI with the
             same duration + easing so the leaving card going behind and
             the other cards rising up move as one synchronised system.
             Mixing CSS transition + WAAPI was causing the cards to
             pop/scale on a different timeline than the leaving card. */
          const startStates = order.map((origIdx, pos) => ({
            origIdx,
            x: pos === 0 ? fromX : 0,
            y: pos === 0 ? fromY : pos * PEEK,
            scale: pos === 0 ? 1 : (1 - pos * 0.04),
            rot: pos === 0 ? fromRot : 0,
          }));
          const newOrder = [...order.slice(1), order[0]];
          setOrder(newOrder);
          setDrag({ x: 0, y: 0 });
          setDragging(false);
          requestAnimationFrame(() => {
            startStates.forEach((s) => {
              const el = cardRefs.current[s.origIdx];
              if (!el || !el.animate) return;
              /* Kill any animation still alive on this card before
                 arming a new one. Without this, fast successive drags
                 leave stale fill:forwards animations from the previous
                 commit ghosting the card at the wrong position. */
              if (el.getAnimations) el.getAnimations().forEach((a) => a.cancel());
              const newPos = newOrder.indexOf(s.origIdx);
              const toY = newPos * PEEK;
              const toScale = 1 - newPos * 0.04;
              el.animate(
                [
                  { transform: `translate(${s.x}px, ${s.y}px) scale(${s.scale}) rotate(${s.rot}deg)` },
                  { transform: `translate(0px, ${toY}px) scale(${toScale}) rotate(0deg)` },
                ],
                { duration: 820, easing: EASE, fill: 'none' }
              );
            });
          });
        } else {
          /* Snap back to the top slot. WAAPI from drop → (0,0). */
          setDrag({ x: 0, y: 0 });
          setDragging(false);
          requestAnimationFrame(() => {
            const el = cardRefs.current[topId];
            if (!el || !el.animate) return;
            if (el.getAnimations) el.getAnimations().forEach((a) => a.cancel());
            el.animate(
              [
                { transform: `translate(${fromX}px, ${fromY}px) scale(1) rotate(${fromRot}deg)` },
                { transform: `translate(0px, 0px) scale(1) rotate(0deg)` },
              ],
              { duration: 480, easing: EASE, fill: 'none' }
            );
          });
        }
      };

      return (
        <PagePad>
          <div style={{ paddingTop: outerPaddingTop }}>
            <div ref={deckRef} className="no-page-swipe" style={{ position: 'relative', height: stackHeight }}>
              {/* Silhouette behind the deck — sized and positioned to
                 match the deepest card (same translateY + scale).
                 Stays put while real cards rotate / lift, so the
                 view-all pill below always anchors to a visible
                 edge instead of floating in empty space when the
                 top card flies out. Slate-30 fill at 0.6 opacity
                 reads as a quiet ghost behind the stack. */}
              <div aria-hidden style={{
                position: 'absolute', left: 0, right: 0, top: 0,
                height: CARD_H,
                transform: `translate(0px, ${(N - 1) * PEEK}px) scale(${1 - (N - 1) * 0.04})`,
                transformOrigin: 'center center',
                background: '#F0F4F7',
                border: 'none',
                borderRadius: 16,
                opacity: 0.6,
                zIndex: 0,
                pointerEvents: 'none',
              }} />
              {order.map((origIdx, stackPos) => {
                const it = items[origIdx];
                const isTop = stackPos === 0;
                const stackY = stackPos * PEEK;
                const stackScale = 1 - stackPos * 0.04;
                /* Rest transform = stack-position. Top while dragging
                   overrides via inline style with drag offset. WAAPI
                   keyframes override transform during their run. */
                let transform = `translate(0px, ${stackY}px) scale(${stackScale}) rotate(0deg)`;
                if (isTop && dragging) {
                  const rot = Math.max(-10, Math.min(10, drag.x * 0.05));
                  transform = `translate(${drag.x}px, ${drag.y}px) scale(1) rotate(${rot}deg)`;
                }
                return (
                  <div
                    key={origIdx}
                    ref={(el) => {
                      if (el) cardRefs.current[origIdx] = el;
                      else delete cardRefs.current[origIdx];
                    }}
                    className={isGlass ? 'fy-i-glass' : undefined}
                    onPointerDown={isTop ? onPointerDown : undefined}
                    onPointerMove={isTop ? onPointerMove : undefined}
                    onPointerUp={isTop ? endDrag : undefined}
                    onPointerCancel={isTop ? endDrag : undefined}
                    aria-hidden={!isTop}
                    style={{
                      position: 'absolute', left: 0, right: 0, top: 0,
                      height: CARD_H,
                      transform,
                      transformOrigin: 'center center',
                      /* No CSS transition — every card's motion is driven
                         by WAAPI keyframes with a shared duration so the
                         rising cards and the leaving card move on the
                         same timeline. CSS at a different duration was
                         racing with the WAAPI and making the deck pop. */
                      transition: 'none',
                      /* Z-index priority:
                           1. Auto-cycle override (lift to 50, drop to 0)
                           2. Drag lift (50, above app bar at 30 — mobile
                              fake status bar is hidden, so no clash)
                           3. Stack position (top = highest)
                         React-only — never set el.style.zIndex via JS. */
                      zIndex:
                        zOverride && zOverride.id === origIdx ? zOverride.z
                        : isTop && dragging ? 50
                        : N - stackPos,
                      /* Apple-style liquid glass: minimal frost, mostly
                         clear with a hint of white wash. The blur +
                         brightness lives in the .fy-i-glass CSS class so
                         the style engine has it parsed before first paint
                         (declaring backdrop-filter inline caused a brief
                         transparent-then-frost glitch on mount). */
                      background: isGlass ? 'rgba(255,255,255,0.28)' : '#FFFFFF',
                      /* Match the solid variant's drop shadow so the
                         spacing below the stack reads identically. Glass
                         lift = single inset top highlight only. The
                         previous 1px inner rim was visible as a "weird
                         shimmer" on the card edges when the user dragged
                         the card over non-white area (status bar, phone
                         shell) — the rim picked up the backdrop colour. */
                      boxShadow: isGlass
                        ? `${STACK_CARD_SHADOW}, inset 0 1px 0 rgba(255,255,255,0.85)`
                        : STACK_CARD_SHADOW,
                      /* Same hairline as the solid variant so the stack's
                         bottom edge reads cleanly against the page — a
                         white-on-white border made the bottom card fade
                         out and pushed the Bills header visually away. */
                      border: CARD_BORDER,
                      borderRadius: 16,
                      padding: '12px 16px',
                      display: 'flex', alignItems: 'center', gap: 12,
                      pointerEvents: isTop ? 'auto' : 'none',
                      cursor: isTop ? 'grab' : 'default',
                      userSelect: 'none',
                      touchAction: 'none',
                    }}>
                    {renderContent ? renderContent(it) : (
                      <>
                        <img src={`/assets/${it.heroImg}`} width={44} height={44} alt=""
                          style={{ display: 'block', borderRadius: 12, flexShrink: 0, objectFit: 'contain', pointerEvents: 'none' }} />
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <div style={{
                            ...T.h4,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>{it.title}</div>
                          <div style={{
                            ...T.caption, color: 'rgba(0,0,0,0.7)',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>{it.sub}</div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </PagePad>
      );
    };

    /* FY_B — HScroll banner carousel, redesigned 2026-05-17 for DLS alignment.
       Surface = solid DLS Tier-30/50 tints (no custom gradients). Category chip
       distinguishes UTILITY (Slate-30 surface) from BRAND/REWARD (Valentino-50
       surface). Within each category, the chip intent (negative/info/main)
       names the specific kind of card. CTA is the same dark pill across all
       three so the action affordance reads identically regardless of slide. */
    const FY_B_CTA_BG = '#171A1F';
    const FY_B_CTA_COLOR = '#FFFFFF';
    const FY_B_THEMES = [
      /* Bill due — chip in slice Blue, mesh glow in amber-yellow to
         echo the electric-bolt illustration's warm tone. */
      { bg: '#F0F4F7', chipIntent: 'negative', chipLabel: 'Bill',
        titleColor: 'rgba(0,0,0,0.9)', subColor: 'rgba(0,0,0,0.7)',
        ctaBg: 'linear-gradient(135deg, #2B6ACF 0%, #5E8EDB 100%)',
        ctaColor: '#FFFFFF',
        glow: 'rgba(255, 178, 79, 0.32)' },
      /* Spark drop — chip in slice brand gradient, mesh glow in
         green-mint to echo the spark illustration's cyan-green tone. */
      { bg: '#FAE2FA', chipIntent: 'main', chipLabel: 'Drop',
        titleColor: 'rgba(0,0,0,0.9)', subColor: 'rgba(0,0,0,0.7)',
        ctaBg: 'linear-gradient(135deg, #D30AD7 0%, #FF6CB1 100%)',
        ctaColor: '#FFFFFF',
        glow: 'rgba(94, 216, 181, 0.34)' },
      /* Spends insight — chip in slice Green, mesh glow in orange to
         echo the orange/yellow bar-chart illustration. */
      { bg: '#F0F4F7', chipIntent: 'info', chipLabel: 'Insight',
        titleColor: 'rgba(0,0,0,0.9)', subColor: 'rgba(0,0,0,0.7)',
        ctaBg: 'linear-gradient(135deg, #00A63E 0%, #3DBB6C 100%)',
        ctaColor: '#FFFFFF',
        glow: 'rgba(255, 154, 23, 0.30)' },
    ];

    /* useDragToScroll — desktop mouse drag-to-scroll for horizontal scrollers.
       No-op for touch (pointerType !== 'mouse') because native `touch-action:
       pan-x` already handles those. Uses refs + local closure vars so pointer
       moves do NOT trigger React re-renders (would cause carousel jank).
       If the user dragged more than 5px, the next bubbling click on any
       descendant is suppressed once — keeps card taps clean. */
    const useDragToScroll = (ref) => {
      React.useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let dragging = false;
        let startX = 0;
        let startScrollLeft = 0;
        let moved = 0;
        let prevCursor = '';

        const onPointerDown = (e) => {
          if (e.pointerType !== 'mouse') return;
          dragging = true;
          startX = e.clientX;
          startScrollLeft = el.scrollLeft;
          moved = 0;
          prevCursor = el.style.cursor;
          el.style.cursor = 'grabbing';
        };

        const onPointerMove = (e) => {
          if (!dragging || e.pointerType !== 'mouse') return;
          const dx = e.clientX - startX;
          el.scrollLeft = startScrollLeft - dx;
          if (Math.abs(dx) > moved) moved = Math.abs(dx);
        };

        const endDrag = (e) => {
          if (!dragging) return;
          if (e && e.pointerType !== 'mouse') return;
          dragging = false;
          el.style.cursor = prevCursor;
          if (moved > 5) {
            /* Suppress the click that would fire on the underlying card. */
            const suppress = (ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              el.removeEventListener('click', suppress, true);
            };
            el.addEventListener('click', suppress, true);
            /* Safety net — if no click fires (e.g. drag ended off-element),
               remove the listener on the next tick so it doesn't kill a
               future legitimate click. */
            setTimeout(() => {
              el.removeEventListener('click', suppress, true);
            }, 0);
          }
        };

        el.addEventListener('pointerdown', onPointerDown);
        el.addEventListener('pointermove', onPointerMove);
        el.addEventListener('pointerup', endDrag);
        el.addEventListener('pointercancel', endDrag);

        return () => {
          el.removeEventListener('pointerdown', onPointerDown);
          el.removeEventListener('pointermove', onPointerMove);
          el.removeEventListener('pointerup', endDrag);
          el.removeEventListener('pointercancel', endDrag);
        };
      }, []);
    };

    /* FY_B — centered card carousel with infinite scroll.
       Cards are 280×~160, centered in the viewport via scroll-snap-align:center
       and a calculated side padding. Cloned edges teleport back to the real
       index after the scroll snap settles. */
    const FY_B = () => {
      const ref = React.useRef(null);
      const CARD_W = 280;
      const GAP = 16;
      const STRIDE = CARD_W + GAP;
      const teleporting = React.useRef(false);
      const paused = React.useRef(false);
      /* Banner card prepended to the strip: same designed poster
         image FY_H uses ("5 new spark live · Get upto ₹2,700 cashback").
         Marked with banner: true so the render switches to image mode
         (no theme overlay, no inline text). */
      const FY_B_SLIDES = [
        { banner: 'fy_b_banner.png', bannerAspect: '1074 / 528' },
        ...FY_SLIDES_NO_BILLS,
      ];
      const N = FY_B_SLIDES.length;
      const renderedSlides = [FY_B_SLIDES[N - 1], ...FY_B_SLIDES, FY_B_SLIDES[0]];

      React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const init = () => {
          if (el.clientWidth === 0) { requestAnimationFrame(init); return; }
          el.scrollLeft = STRIDE; /* land on the first real card */
        };
        init();
      }, []);

      /* Track whether the carousel is actively scrolling — used to gate the
         edge-teleport AND the auto-advance interval. Three flags interact:
           · scrolling.current — true between scroll events; clears 250ms after
             the last scroll event fires. Use `scrollend` when supported.
           · paused.current    — true between pointerdown and 5s after pointerup.
           · teleporting.current — true during the edge clone-jump RAF tick.
         The carousel is "quiet" only when all three are false. */
      const scrolling = React.useRef(false);

      React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let settleTimer;
        let scrollIdleTimer;
        const SCROLL_IDLE_MS = 250;
        const supportsScrollend = 'onscrollend' in el;

        const tryTeleport = () => {
          if (teleporting.current) return;
          const pos = Math.round(el.scrollLeft / STRIDE);
          if (pos > 0 && pos < N + 1) return; // not at an edge
          teleporting.current = true;
          const prev = el.style.scrollBehavior;
          el.style.scrollBehavior = 'auto';
          el.scrollLeft = pos <= 0 ? STRIDE * N : STRIDE;
          // Two RAF ticks: first paint absorbs the jump, second restores smooth.
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.scrollBehavior = prev;
              teleporting.current = false;
            });
          });
        };

        const markIdle = () => {
          scrolling.current = false;
          tryTeleport();
        };

        const onScroll = () => {
          scrolling.current = true;
          if (teleporting.current) return;
          if (supportsScrollend) return; // scrollend will handle it
          clearTimeout(settleTimer);
          clearTimeout(scrollIdleTimer);
          settleTimer = setTimeout(tryTeleport, SCROLL_IDLE_MS);
          scrollIdleTimer = setTimeout(() => { scrolling.current = false; }, SCROLL_IDLE_MS);
        };
        const onScrollEnd = () => {
          scrolling.current = false;
          tryTeleport();
        };

        el.addEventListener('scroll', onScroll, { passive: true });
        if (supportsScrollend) el.addEventListener('scrollend', onScrollEnd);
        const onDown = () => { paused.current = true; };
        const onUp = () => { setTimeout(() => { paused.current = false; }, 5000); };
        el.addEventListener('pointerdown', onDown);
        el.addEventListener('pointerup', onUp);
        el.addEventListener('pointercancel', onUp);
        return () => {
          el.removeEventListener('scroll', onScroll);
          if (supportsScrollend) el.removeEventListener('scrollend', onScrollEnd);
          el.removeEventListener('pointerdown', onDown);
          el.removeEventListener('pointerup', onUp);
          el.removeEventListener('pointercancel', onUp);
          clearTimeout(settleTimer);
          clearTimeout(scrollIdleTimer);
        };
      }, [N]);

      /* Auto-advance every 5s — pauses for 5s after any user touch AND blocks
         if the carousel is currently mid-scroll/inertia. Together this means a
         user can scroll cleanly without an auto-advance colliding with their
         own gesture. */
      React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const t = setInterval(() => {
          if (paused.current || teleporting.current || scrolling.current) return;
          el.scrollBy({ left: STRIDE, behavior: 'smooth' });
        }, 5000);
        return () => clearInterval(t);
      }, []);

      /* Desktop mouse drag-to-scroll. No-op on touch. */
      useDragToScroll(ref);

      return (
        <div style={{ paddingTop: 16, paddingBottom: 28 }}>
          <div ref={ref} style={{
            /* overflowY MUST be explicit `hidden` — pairing `auto` with
               `visible` silently promotes both axes to `auto` on mobile and
               steals vertical touch gestures. */
            overflowX: 'auto', overflowY: 'hidden',
            /* Confine touch tracking to the horizontal axis so vertical page
               scroll + card taps still register on mobile. Without this the
               scroll-snap engine grabs every touch and blocks the tap. */
            touchAction: 'pan-x',
            WebkitOverflowScrolling: 'touch',
            /* Left-aligned to the page horizontal padding (24px) so the
               first card sits flush with section content above and below.
               scrollPaddingLeft makes snap targets land at that 24px inset. */
            paddingLeft: 24,
            paddingRight: 24,
            scrollPaddingLeft: 24,
            /* Card shadow is `0 2px 32px` — give it room INSIDE the scroller's
               clip box (vertical padding) then visually undo the height bump
               with negative margins so adjacent sections sit at the same
               cadence. Without this, overflow-y:hidden clips the shadow at
               the scroller edges. */
            paddingTop: 24, paddingBottom: 40,
            marginTop: -24, marginBottom: -40,
            scrollSnapType: 'x mandatory',
            overscrollBehaviorX: 'contain',
            /* Soft fade at left + right edges so cards entering/
               leaving the visible strip dissolve into transparent
               instead of hard-clipping at the scroller boundary.
               No hard edges visible during the slide. */
            WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 6%, black 94%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0, black 6%, black 94%, transparent 100%)',
          }} className="scrollbar-hide no-page-swipe">
            <div style={{ display: 'flex', gap: GAP }}>
              {renderedSlides.map((s, i) => {
                /* Banner cards short-circuit the themed rendering —
                   the poster image is the whole card surface. */
                if (s.banner) {
                  return (
                    <button className="tap" key={i} style={{
                      flex: `0 0 ${CARD_W}px`, height: 136,
                      borderRadius: 16, border: 'none', boxShadow: CARD_SHADOW,
                      backgroundImage: `url(/assets/${s.banner})`,
                      backgroundSize: 'cover', backgroundPosition: 'center',
                      scrollSnapAlign: 'start',
                      touchAction: 'pan-x', cursor: 'pointer',
                    }} aria-label="5 new sparks · cashback up to ₹2,700" />
                  );
                }
                /* Themed slides — restructured to match the prepended
                   banner card's layout: chip pill top-left, then a
                   compact text stack (caption → H3 → sub) on the
                   left, illustration on the right. No CTA pill —
                   keeps parity with the image-only banner. */
                const realPos = i === 0 ? N - 1 : i === N + 1 ? 0 : i - 1;
                const themeIdx = (realPos - 1 + FY_B_THEMES.length) % FY_B_THEMES.length;
                const th = FY_B_THEMES[themeIdx];
                return (
                  <button className="tap" key={i} style={{
                    flex: `0 0 ${CARD_W}px`, height: 136, borderRadius: 16, padding: 16,
                    /* Illustration-anchored mesh: glow blob uses the
                       theme's per-slide illustration colour (amber for
                       bill bolt, mint for spark, orange for chart) so
                       the wash visually matches the 3D artwork sitting
                       in the bottom-right. Theme bg fades behind it.
                       Rest of the card stays clean white. */
                    background: `
                      radial-gradient(ellipse 70% 80% at 88% 92%, ${th.bg} 0%, transparent 65%),
                      radial-gradient(ellipse 50% 55% at 78% 78%, ${th.glow} 0%, transparent 65%),
                      #FFFFFF
                    `,
                    /* No border — matches the image banner card. */
                    border: 'none',
                    boxShadow: CARD_SHADOW,
                    scrollSnapAlign: 'start',
                    touchAction: 'pan-x',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', alignSelf: 'flex-start',
                      padding: '3px 10px', borderRadius: 100,
                      background: th.ctaBg, color: th.ctaColor,
                      fontFamily: 'Rubik', fontSize: 11, fontWeight: 500,
                      lineHeight: '14px', letterSpacing: '0.2px',
                      whiteSpace: 'nowrap', position: 'relative', zIndex: 1,
                    }}>{th.chipLabel || 'Live'}</span>
                    <div style={{ width: '100%', position: 'relative', zIndex: 1, paddingRight: 80 }}>
                      <div style={{
                        fontFamily: 'Rubik', fontSize: 16, fontWeight: 500,
                        lineHeight: '20px', letterSpacing: '0.32px',
                        color: th.titleColor,
                      }}>{s.title}</div>
                      <div style={{
                        ...T.caption, color: th.subColor, marginTop: 2,
                        lineHeight: '18px',
                      }}>{s.sub}</div>
                    </div>
                    <img src={`/assets/${s.heroImg}`} alt="" style={{
                      position: 'absolute', right: 16, bottom: 16,
                      width: 72, height: 72, objectFit: 'contain', pointerEvents: 'none', zIndex: 0
                    }} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    };



    /* FY_C — compact dark carousel matching Figma spec (LVL 16, 9711:9079).
       Card 296×120, radius 20, bg rgba(0,0,0,0.9). Title + sub anchored
       bottom-left, 24px in from left, 24px from bottom. No CTA, no hero
       image. First and third slides use the spec'd dark; middle slide uses
       slice brand gradient per DLS for visual variety. */
    /* Each slide gets a subtle dark gradient drawn from DLS primitives so the
       surface reads as dimensional, not flat-black. Highlight in the top-left,
       deeper tone bottom-right. Hue cue maps to the slide's intent:
         · Bill   → Valentino-tinted (urgency / slice pink)
         · Spark  → full slice brand gradient (Valentino → Blue)
         · Spends → Slate-blue (analytical / neutral) */
    const FY_C_SLIDES = [
      { title: 'Electricity bill generated', sub: '₹6,060 due on 6th jan',
        bg: 'linear-gradient(135deg, #2A1024 0%, #170A14 55%, #090B0C 100%)' },
      { title: 'New Spark Drop', sub: 'Fresh rewards just dropped',
        bg: 'linear-gradient(135deg, #D30AD7 0%, #2B6ACF 100%)' },
      { title: 'Spent ₹18K last month', sub: '22% higher than usual',
        bg: 'linear-gradient(135deg, #1F2A3A 0%, #141A24 55%, #090B0C 100%)' },
    ];
    const FY_C = () => {
      const ref = React.useRef(null);
      const CARD_W = 296;
      const GAP = 16;
      const STRIDE = CARD_W + GAP;
      const teleporting = React.useRef(false);
      const paused = React.useRef(false);
      const N = FY_C_SLIDES.length;
      const renderedSlides = [FY_C_SLIDES[N - 1], ...FY_C_SLIDES, FY_C_SLIDES[0]];

      React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const init = () => {
          if (el.clientWidth === 0) { requestAnimationFrame(init); return; }
          el.scrollLeft = STRIDE;
        };
        init();
      }, []);

      React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let settleTimer;
        const onScroll = () => {
          if (teleporting.current) return;
          clearTimeout(settleTimer);
          settleTimer = setTimeout(() => {
            const pos = Math.round(el.scrollLeft / STRIDE);
            if (pos <= 0) {
              teleporting.current = true;
              const prev = el.style.scrollBehavior;
              el.style.scrollBehavior = 'auto';
              el.scrollLeft = STRIDE * N;
              requestAnimationFrame(() => {
                el.style.scrollBehavior = prev;
                teleporting.current = false;
              });
            } else if (pos >= N + 1) {
              teleporting.current = true;
              const prev = el.style.scrollBehavior;
              el.style.scrollBehavior = 'auto';
              el.scrollLeft = STRIDE;
              requestAnimationFrame(() => {
                el.style.scrollBehavior = prev;
                teleporting.current = false;
              });
            }
          }, 160);
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        const onDown = () => { paused.current = true; };
        const onUp = () => { setTimeout(() => { paused.current = false; }, 3000); };
        el.addEventListener('pointerdown', onDown);
        el.addEventListener('pointerup', onUp);
        return () => {
          el.removeEventListener('scroll', onScroll);
          el.removeEventListener('pointerdown', onDown);
          el.removeEventListener('pointerup', onUp);
          clearTimeout(settleTimer);
        };
      }, [N]);

      React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const t = setInterval(() => {
          if (paused.current || teleporting.current) return;
          el.scrollBy({ left: STRIDE, behavior: 'smooth' });
        }, 4000);
        return () => clearInterval(t);
      }, []);

      /* Desktop mouse drag-to-scroll. No-op on touch. */
      useDragToScroll(ref);

      return (
        <div style={{ paddingTop: 16, paddingBottom: 24 }}>
          <div ref={ref} style={{
            overflowX: 'auto', overflowY: 'visible',
            /* Left-aligned to the page horizontal padding (24px) so the
               first card sits flush with section content above and below. */
            paddingLeft: 24,
            paddingRight: 24,
            scrollPaddingLeft: 24,
            scrollSnapType: 'x mandatory',
            overscrollBehaviorX: 'contain',
          }} className="scrollbar-hide no-page-swipe">
            <div style={{ display: 'flex', gap: GAP }}>
              {renderedSlides.map((s, i) => (
                <button className="tap" key={i} style={{
                  flex: `0 0 ${CARD_W}px`, height: 120, borderRadius: 20,
                  /* Bottom-left anchored content per Figma spec — 24L, 24B.
                     Title baseline ~76px from top, sub at ~100px. */
                  padding: '0 24px 24px 24px',
                  background: s.bg, border: 'none',
                  scrollSnapAlign: 'start',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  textAlign: 'left', cursor: 'pointer',
                }}>
                  <div style={{
                    fontFamily: 'Rubik', fontWeight: 500,
                    fontSize: 16, lineHeight: '20px', letterSpacing: '0.32px',
                    color: '#FFFFFF',
                  }}>{s.title}</div>
                  <div style={{
                    fontFamily: 'Rubik', fontWeight: 400,
                    fontSize: 12, lineHeight: '16px', letterSpacing: '0.24px',
                    color: 'rgba(255,255,255,0.7)', marginTop: 4,
                  }}>{s.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    };


    /* FY_Q — L's image-hero carousel constrained inside a card (like H).
       Crossfading bg images, centered text + CTA, carousel dots — all
       inside a rounded card with page padding instead of edge-to-edge. */
    /* Shared card-carousel builder for FY_Q/R/S — accepts a style config
       to avoid duplicating the scroll/crossfade mechanics. */
    const FY_CardCarousel = ({ cardStyle, overlayGradient, bgType = 'image', slides: slidesProp }) => {
      const slides = slidesProp || FY_HERO_SLIDES;
      const [ref, idx, progress] = useInfiniteCarousel(slides.length);
      const renderedSlides = [slides[slides.length - 1], ...slides, slides[0]];
      const imageOpacities = slides.map((_, p) =>
        Math.max(0, 1 - wrappedCarouselDistance(p, progress, slides.length).abs)
      );
      /* Per-slide mesh scheme for gradient bg types */
      const lo = Math.floor(progress) % slides.length;
      const hi = (lo + 1) % slides.length;
      const t = progress - Math.floor(progress);
      return (
        <PagePad>
          <div style={{ paddingTop: 8 }}>
            <div style={{
              position: 'relative', overflow: 'hidden',
              borderRadius: cardStyle.radius || 16,
              boxShadow: CARD_SHADOW,
              background: cardStyle.baseBg || '#0d0317',
              ...(cardStyle.border ? { border: cardStyle.border } : {}),
              /* DLS 60% corner smoothing */
              WebkitBorderRadius: cardStyle.radius || 16,
              MozBorderRadius: cardStyle.radius || 16,
            }} className="corner-smooth">
              {/* Background layer */}
              {bgType === 'image' && slides.map((s, p) => (
                <div key={p} aria-hidden style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(/assets/${s.bg})`,
                  backgroundSize: 'cover', backgroundPosition: cardStyle.bgPos || 'center 75%',
                  opacity: imageOpacities[p],
                  pointerEvents: 'none', willChange: 'opacity',
                }} />
              ))}
              {bgType === 'mesh' && (() => {
                const scheme = lerpScheme(
                  FY_SLIDE_SCHEMES[lo % FY_SLIDE_SCHEMES.length],
                  FY_SLIDE_SCHEMES[hi % FY_SLIDE_SCHEMES.length], t);
                return (
                  <div aria-hidden style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: `
                      radial-gradient(ellipse 90% 80% at 10% 20%, ${scheme[0]} 0%, transparent 70%),
                      radial-gradient(ellipse 80% 80% at 90% 30%, ${scheme[1]} 0%, transparent 70%),
                      radial-gradient(ellipse 100% 60% at 50% 80%, ${scheme[2]} 0%, transparent 80%),
                      ${cardStyle.baseBg || '#FFFFFF'}
                    `,
                  }} />
                );
              })()}
              {bgType === 'valentino' && (() => {
                const schemes = [
                  ['#3B0060', '#6B1FB8', '#D30AD7'],
                  ['#1A0040', '#4A0E8F', '#8B2FC8'],
                  ['#260227', '#87068A', '#D30AD7'],
                ];
                const s0 = schemes[lo % schemes.length], s1 = schemes[hi % schemes.length];
                const scheme = s0.map((c, i) => {
                  const a = _hexToRgb(c), b = _hexToRgb(s1[i]);
                  return `rgb(${a.map((v, j) => Math.round(v + (b[j] - v) * t)).join(',')})`;
                });
                return (
                  <div aria-hidden style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: `
                      radial-gradient(ellipse 80% 70% at 15% 10%, ${scheme[0]} 0%, transparent 65%),
                      radial-gradient(ellipse 70% 80% at 85% 25%, ${scheme[1]} 0%, transparent 65%),
                      radial-gradient(ellipse 100% 50% at 50% 90%, ${scheme[2]}44 0%, transparent 70%),
                      linear-gradient(160deg, #1A0040 0%, #260227 100%)
                    `,
                  }} />
                );
              })()}
              {/* Optional overlay gradient (vignette, bottom fade, etc) */}
              {overlayGradient && (
                <div aria-hidden style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
                  background: overlayGradient,
                }} />
              )}
              {/* Scroll container */}
              <div ref={ref} style={{
                position: 'relative', zIndex: 2,
                display: 'flex', overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                overscrollBehavior: 'none',
              }} className="scrollbar-hide no-page-swipe">
                {renderedSlides.map((s, i) => {
                  const { abs: dist, signed: wrappedOffset } = wrappedCarouselDistance(i - 1, progress, slides.length);
                  const textOpacity = Math.max(0, 1 - dist * 2.6);
                  const parallaxX = wrappedOffset * 60;
                  const isLight = bgType === 'mesh';
                  const txtColor = isLight ? 'rgba(0,0,0,0.9)' : '#FFFFFF';
                  const subColor = isLight ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)';
                  const shadow = isLight ? 'none' : '0 1px 2px rgba(0,0,0,0.25)';
                  const btnBg = isLight ? 'rgba(0,0,0,0.9)' : '#FFFFFF';
                  const btnColor = isLight ? '#FFFFFF' : '#171A1F';
                  return (
                    <div key={i} style={{
                      flex: '0 0 100%', scrollSnapAlign: 'start', scrollSnapStop: 'always',
                      position: 'relative', minHeight: cardStyle.minH || 180, overflow: 'hidden',
                      display: 'flex', flexDirection: 'column',
                      alignItems: cardStyle.align === 'left' ? 'flex-start' : 'center',
                      justifyContent: cardStyle.valign === 'top' ? 'flex-start' : 'flex-end',
                      textAlign: cardStyle.align === 'left' ? 'left' : 'center',
                      padding: cardStyle.pad || '16px 24px 48px 24px',
                      boxSizing: 'border-box',
                      background: 'transparent',
                    }}>
                      <div style={{
                        position: 'relative', zIndex: 2,
                        display: 'flex', flexDirection: 'column',
                        alignItems: cardStyle.align === 'left' ? 'flex-start' : 'center',
                        transform: `translateX(${parallaxX}px)`,
                        opacity: textOpacity,
                        willChange: 'transform, opacity',
                      }}>
                        <div style={{
                          fontFamily: 'Rubik', fontSize: cardStyle.titleSize || 20,
                          fontWeight: 500, lineHeight: '24px', letterSpacing: '0.4px',
                          color: txtColor, textShadow: shadow,
                        }}>{s.title}</div>
                        <div style={{
                          ...T.caption, color: subColor, marginTop: 4,
                          textShadow: shadow,
                        }}>{s.sub}</div>
                        <button className="tap" style={{
                          marginTop: 12, padding: '6px 14px',
                          background: btnBg, border: 'none', borderRadius: 100,
                          ...T.caption, fontWeight: 500, color: btnColor,
                          cursor: 'pointer', whiteSpace: 'nowrap',
                        }}>{s.cta}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <CarouselDots count={slides.length} activeIdx={idx} bottom={12} light={bgType !== 'mesh'} />
            </div>
          </div>
        </PagePad>
      );
    };

    /* FY_Q — Image hero banner in card. Photo backgrounds, vignette overlay. */
    const FY_Q = () => (
      <FY_CardCarousel
        bgType="image"
        cardStyle={{ baseBg: '#0d0317', radius: 16, minH: 180, titleSize: 18,
          pad: '12px 24px 52px 24px' }}
        overlayGradient="radial-gradient(ellipse 120% 80% at 50% 100%, rgba(0,0,0,0.3) 0%, transparent 60%)"
      />
    );

    /* FY_R — Valentino mesh gradient card. Deep purple animated mesh,
       white text. Feels premium + on-brand. No photos. */
    const FY_R = () => (
      <FY_CardCarousel
        bgType="valentino"
        cardStyle={{ baseBg: '#1A0040', radius: 20, minH: 180, titleSize: 20,
          pad: '20px 24px 48px 24px' }}
      />
    );

    /* FY_S — Light DLS mesh card. Soft pastel mesh (like D's scheme
       colours), dark text. Slice everyday feel, not promotional. */
    const FY_S = () => (
      <FY_CardCarousel
        bgType="mesh"
        cardStyle={{ baseBg: '#FFFFFF', radius: 16, minH: 172, titleSize: 18,
          pad: '16px 24px 44px 24px', border: CARD_BORDER }}
      />
    );

    /* FY_T — F-style centered carousel with white/light hero images.
       White bg, dark text. The illustration sits bottom-center with
       white edges so it blends into the page. */
    const FY_T_SLIDES = [
      { bg: 'fy_hero_white.png', title: 'New Spark Drop', sub: 'Fresh rewards just dropped', cta: 'Explore' },
      { bg: 'fy_hero_white.png', title: 'Spent ₹18K last month', sub: '22% higher than usual', cta: 'See report' },
    ];
    const FY_T = () => {
      const PAD_TOP_CSS = 'calc(var(--bar-overlap, 118px) + 24px)';
      const MIN_H = 300;
      const slides = FY_T_SLIDES;
      const N = slides.length;
      const [ref, idx, progress] = useInfiniteCarousel(N);
      const renderedSlides = [slides[N - 1], ...slides, slides[0]];
      const imageOpacities = slides.map((_, p) =>
        Math.max(0, 1 - wrappedCarouselDistance(p, progress, N).abs)
      );
      return (
        <>
          <div style={{ position: 'relative', marginTop: 'calc(-1 * var(--bar-overlap, 118px))', overflow: 'hidden', background: '#FFFFFF' }}>
            {slides.map((s, p) => (
              <div key={p} aria-hidden style={{
                position: 'absolute', inset: 0, zIndex: 0,
                backgroundImage: `url(/assets/${s.bg})`,
                backgroundSize: 'cover', backgroundPosition: 'center bottom',
                opacity: imageOpacities[p],
                pointerEvents: 'none', willChange: 'opacity',
              }} />
            ))}
            {/* Bottom fade to white */}
            <div aria-hidden style={{
              position: 'absolute', inset: 0, zIndex: 1,
              background: 'linear-gradient(to bottom, transparent 60%, rgba(255,255,255,0.4) 80%, #FFFFFF 95%)',
              pointerEvents: 'none',
            }} />
            <div ref={ref} style={{
              position: 'relative', zIndex: 2,
              display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory',
              overscrollBehavior: 'none',
            }} className="scrollbar-hide no-page-swipe">
              {renderedSlides.map((s, i) => {
                const { abs: dist, signed: wrappedOffset } = wrappedCarouselDistance(i - 1, progress, N);
                const textOpacity = Math.max(0, 1 - dist * 2.6);
                const parallaxX = wrappedOffset * 60;
                return (
                  <div key={i} style={{
                    flex: '0 0 100%', scrollSnapAlign: 'start',
                    minHeight: MIN_H, overflow: 'hidden',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    textAlign: 'center',
                    paddingTop: PAD_TOP_CSS, paddingRight: 36, paddingBottom: 48, paddingLeft: 36,
                    boxSizing: 'border-box', background: 'transparent',
                  }}>
                    <div style={{
                      position: 'relative', zIndex: 3,
                      transform: `translate(${parallaxX}px, -12px)`,
                      opacity: textOpacity,
                      willChange: 'transform, opacity',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                    }}>
                      <div style={{ ...T.h4, color: 'rgba(0,0,0,0.9)' }}>{s.title}</div>
                      <div style={{ ...T.caption, color: 'rgba(0,0,0,0.5)', marginTop: 4 }}>{s.sub}</div>
                      <button className="tap" style={{
                        marginTop: 12, padding: '5px 12px',
                        background: 'rgba(0,0,0,0.9)', border: 'none', borderRadius: 100,
                        ...T.caption, fontWeight: 500, color: '#FFFFFF', cursor: 'pointer', whiteSpace: 'nowrap',
                      }}>{s.cta}</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <CarouselDots count={N} activeIdx={idx} bottom={12} />
          </div>
        </>
      );
    };

    /* FY_U — Card carousel with left-aligned illustrations + top-left text.
       Uses dedicated banner images with artwork on the bottom-right. */
    const FY_U_SLIDES = [
      { bg: 'fy_u_spark.png',    title: 'New Spark Drop',       sub: 'Fresh rewards just dropped', cta: 'Explore' },
      { bg: 'fy_u_cashback.png', title: 'UPI cashback drop',    sub: 'Tap to grab ₹40 back',      cta: 'Claim' },
      { bg: 'fy_u_drop.png',     title: 'Friday flash drop',    sub: '₹100 back on Swiggy',       cta: 'Grab now' },
    ];
    const FY_U = () => (
      <FY_CardCarousel
        bgType="image"
        slides={FY_U_SLIDES}
        cardStyle={{ baseBg: '#1A0040', radius: 16, minH: 160, titleSize: 18,
          pad: '24px 24px 44px 24px', align: 'left', valign: 'top', bgPos: 'right bottom' }}
      />
    );

    const ForYouSection = ({ variant, autoScroll, fyOverlap }) => {
      /* K = liquid-glass surface on the FY_I shuffle-deck engine. Same
         interactions, swapped material. */
      if (variant === 'K') return <FY_I autoScroll={autoScroll} surface="glass" />;
      const C = { A: FY_A, B: FY_B, C: FY_C, D: FY_D, E: FY_E, F: FY_F, G: FY_G, H: FY_H, I: FY_I, J: FY_J, L: FY_L, M: FY_M, N: FY_N, O: FY_O, P: FY_P, Q: FY_Q, T: FY_T, U: FY_U }[variant] || FY_I;
      return <C autoScroll={autoScroll} overlap={fyOverlap} />;
    };

    /* ----- AI Banker — all 5 are inline-input variants (extends previous E) ----- */

    /* Shared placeholder questions for the rolling search bars across A, C, E. */
    const AB_QUESTIONS = [
      'Why is my CC bill ₹4,200?',
      'Redeem my monies',
      "What's a pot?",
    ];

    /* AI banker A — single-line search bar with rolling questions. White-on-white
       with the same subtle slate stroke + soft drop shadow used on the card
       aesthetic. Icon + text are left-aligned inside the bar. */
    const AB_A = () => (
      <PagePad>
        <button className="tap" style={{
          width: '100%', height: 48, padding: '0 16px', boxSizing: 'border-box',
          display: 'flex', alignItems: 'center', gap: 12,
          background: '#FFFFFF', border: '1px solid #F2F2F2', borderRadius: 100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          cursor: 'pointer', textAlign: 'left',
        }}>
          <img src="/assets/ai_icon.png" width={23} height={23} alt="" style={{ display: 'block', flexShrink: 0 }} />
          <span style={{ ...T.bodySm, color: 'rgba(0,0,0,0.5)', lineHeight: '20px', flex: 1, minWidth: 0 }}>
            <RollingText items={AB_QUESTIONS} />
          </span>
        </button>
      </PagePad>
    );

    const AB_B = () => (
      <PagePad>
        <button className="tap" style={{
          width: '100%', padding: '14px 16px',
          background: 'white', border: '1px solid #D30AD7', borderRadius: 100,
          boxShadow: '0 0 0 4px rgba(211,10,215,0.06)',
          display: 'flex', alignItems: 'center', gap: 12,
          cursor: 'pointer', textAlign: 'left',
        }}>
          <img src="/assets/ai_icon.png" width={23} height={23} alt="" style={{ display: 'block', flexShrink: 0 }} />
          <span style={{ ...T.body, color: 'rgba(0,0,0,0.5)', flex: 1 }}>Ask AI banker anything…</span>
          <Chevron color="#D30AD7" />
        </button>
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <TagSubtle intent="neutral">My CC bill?</TagSubtle>
          <TagSubtle intent="neutral">Redeem monies</TagSubtle>
          <TagSubtle intent="neutral">What's a pot?</TagSubtle>
        </div>
      </PagePad>
    );

    /* AI banker C — same compact search bar as A + E (rolling questions),
       with a horizontal-scroll row of suggestion pills beneath it. */
    const AB_C = () => {
      const pills = ['My CC bill?', 'Redeem monies', "What's a pot?", 'Best FD rate?', 'Track spends'];
      return (
        <div>
          <PagePad>
            <button className="tap" style={{
              width: '100%', height: 48, padding: '0 16px', boxSizing: 'border-box',
              display: 'flex', alignItems: 'center', gap: 12,
              background: '#FFFFFF',
              border: '1px solid rgba(211,10,215,0.18)',
              borderRadius: 100,
              boxShadow: '0 4px 16px rgba(211,10,215,0.08), 0 1px 2px rgba(0,0,0,0.04)',
              cursor: 'text', textAlign: 'left',
            }}>
              <img src="/assets/ai_icon.png" width={23} height={23} alt="" style={{ display: 'block', flexShrink: 0 }} />
              <span style={{ ...T.bodySm, color: 'rgba(0,0,0,0.5)', flex: 1 }}>Ask anything…</span>
            </button>
          </PagePad>
          <Spacer h={16} />
          <div style={{
            overflowX: 'auto', paddingLeft: 24, paddingRight: 0,
            scrollSnapType: 'x proximity', scrollPaddingLeft: 24,
          }} className="scrollbar-hide no-page-swipe">
            <div style={{ display: 'flex', gap: 6 }}>
              {pills.map((q, i) => (
                <button key={i} className="tap" style={{
                  flexShrink: 0, scrollSnapAlign: 'start',
                  ...T.caption, color: 'rgba(0,0,0,0.7)',
                  background: '#FFFFFF',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  padding: '5px 10px', borderRadius: 100, whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}>{q}</button>
              ))}
              <div style={{ flex: '0 0 24px' }} aria-hidden="true" />
            </div>
          </div>
        </div>
      );
    };

    const AB_D = () => (
      <PagePad>
        <button className="tap" style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: '8px 0', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <img src="/assets/ai_icon.png" width={19} height={19} alt="" style={{ display: 'block' }} />
          <span style={{ ...T.btnSm, color: '#D30AD7' }}>Ask AI banker</span>
          <GlyphArrow color="#D30AD7" />
        </button>
      </PagePad>
    );

    /* AI Banker E — quiet vertical roll between example queries.
       Single 20px line height; the next prompt slides up from below every ~3.5s.
       Less attention-grabbing than a typewriter. */
    const AB_E = () => {
      const examples = [
        "Why is my CC bill ₹4,200?",
        "Redeem my monies",
        "What's a pot?",
      ];
      const [idx, setIdx] = React.useState(0);
      React.useEffect(() => {
        const t = setInterval(() => setIdx(i => (i + 1) % examples.length), 3500);
        return () => clearInterval(t);
      }, []);
      const LINE_H = 20;
      return (
        <PagePad>
          <button className="tap" style={{
            width: '100%', height: 48, padding: '0 16px', boxSizing: 'border-box',
            background: 'white', border: '1px solid #D30AD7', borderRadius: 100,
            boxShadow: '0 0 0 4px rgba(211,10,215,0.06)',
            display: 'flex', alignItems: 'center', gap: 12,
            cursor: 'pointer', textAlign: 'left',
          }}>
            <img src="/assets/ai_icon.png" width={23} height={23} alt="" style={{ display: 'block', flexShrink: 0 }} />
            <div style={{
              flex: 1, height: LINE_H, overflow: 'hidden', position: 'relative',
            }}>
              <div style={{
                transform: `translateY(${-idx * LINE_H}px)`,
                transition: 'transform 520ms cubic-bezier(0.22, 0.61, 0.36, 1)',
              }}>
                {examples.map((e, i) => (
                  <div key={i} style={{
                    height: LINE_H, lineHeight: `${LINE_H}px`,
                    ...T.bodySm, color: 'rgba(0,0,0,0.5)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{e}</div>
                ))}
              </div>
            </div>
          </button>
        </PagePad>
      );
    };

    /* AB_F — overlapping search-bar variant. Visually identical to AB_A
       (clean pill, AI icon, rolling questions) but pulls up with negative
       marginTop so it sits ON the bottom edge of the For-You gradient
       carousel above. Inspired by Grab's sticky search bar that overlays
       the bottom of the deals banner. Pairs with FY_J (partitioned carousel
       with paginator hidden) for a cohesive top-of-page combo. */
    const AB_F = () => (
      <PagePad>
        {/* Pill height is 52 → marginTop -26 centres its vertical midpoint
            exactly on the carousel's bottom seam. Half (26px) overlaps the
            carousel above, half (26px) sits in the white below. */}
        <div style={{ marginTop: -26, position: 'relative', zIndex: 2 }}>
          <button className="tap" style={{
            width: '100%', height: 52, padding: '0 18px', boxSizing: 'border-box',
            display: 'flex', alignItems: 'center', gap: 12,
            background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 100,
            boxShadow: '0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.04)',
            cursor: 'pointer', textAlign: 'left',
          }}>
            <img src="/assets/ai_icon.png" width={23} height={23} alt="" style={{ display: 'block', flexShrink: 0 }} />
            <span style={{ ...T.bodySm, color: 'rgba(0,0,0,0.5)', lineHeight: '20px', flex: 1, minWidth: 0 }}>
              <RollingText items={AB_QUESTIONS} />
            </span>
          </button>
        </div>
      </PagePad>
    );

    const AiBankerSection = ({ variant }) => ({ A: AB_A, B: AB_B, C: AB_C, D: AB_D, E: AB_E, F: AB_F }[variant])();

    /* ----- Bills & Recharges — no nudges (urgency lives in For You). No inner heading
       (the section header above is the title). 5 ways to present the shortcut surface. ----- */

    /* DLS rule: in-card headers don't carry a leading icon and don't render a
       divider below the title. The card itself provides containment; an extra
       hairline would double the boundary. The `icon` prop is accepted but ignored
       so existing call sites keep working. */
    const InCardHeader = ({ title, cta }) => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ ...T.h4 }}>{title}</span>
        {cta && <button className="tap" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, ...T.btnSm, color: '#D30AD7' }}>{cta}</button>}
      </div>
    );

    /* A — Plain shortcut grid, no card wrapper */
    const BL_A = () => (
      <PagePad style={{ paddingTop: 8 }}>
        <BillsShortcutGrid />
      </PagePad>
    );

    /* C — Same layout as A but with white-bg avatars + 1px #F2F2F2 stroke */
    const BL_C = () => (
      <PagePad>
        <BillsShortcutGrid avatarVariant="outline" />
      </PagePad>
    );

    /* BL_J — Floating bills card. Designed exclusively for the FY=J + AB=None
       combo. Rendered without a section header or inter-section spacer (see
       ExplorePage's combo branch), so this card's negative marginTop is the
       only thing positioning it relative to the FY_J carousel's hard bottom
       edge. Pulled up ~half its own height so the card straddles the seam:
       roughly half above (overlapping the carousel), half below. */
    const BL_J = () => (
      <PagePad>
        <div style={{
          marginTop: -68, position: 'relative', zIndex: 2,
          background: '#FFFFFF',
          border: CARD_BORDER, borderRadius: 16,
          boxShadow: CARD_SHADOW,
          padding: '20px 12px',
        }}>
          <BillsShortcutGrid columnGap={4} avatarVariant="tinted" />
        </div>
      </PagePad>
    );

    /* B — Grid in a card. When In-card header style is active the card carries
       its own "Bills & Recharges" heading (matched to the Rewards G hero: 20px
       padding, H4 title via InCardHeader). */
    const BL_B = ({ isInCard }) => (
      <PagePad>
        <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 20 }}>
          {isInCard && (
            <>
              <InCardHeader title="Bills & Recharges" />
              <Spacer h={4} />
            </>
          )}
          <BillsShortcutGrid columnGap={20} />
        </div>
      </PagePad>
    );

    /* D — Two-row grid, 8 shortcuts inside a card */
    const BL_D = () => {
      const tiles = [
        { src: 'bill_credit', t: 'Credit\ncard' },
        { src: 'bill_electric', t: 'Electricity' },
        { src: 'bill_mobile', t: 'Mobile' },
        { src: 'bill_more', t: 'DTH' },
        { src: 'bill_credit', t: 'Loans' },
        { src: 'bill_electric', t: 'Gas' },
        { src: 'bill_mobile', t: 'Insurance' },
        { src: 'bill_more', t: 'View all' },
      ];
      return (
        <PagePad>
          <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 8, rowGap: 20 }}>
              {tiles.map((b, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src={`/assets/${b.src}.png`} width={40} height={40} alt="" style={{ display: 'block', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.06))' }} />
                  <div style={{ ...T.caption, textAlign: 'center', marginTop: 8, whiteSpace: 'pre-line', color: 'rgba(0,0,0,0.7)' }}>
                    {b.t}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PagePad>
      );
    };

    /* E — List-style (4 list rows with avatars; alternative directory pattern) */
    const BL_E = () => (
      <>
        <ListItemAvatar asset="bill_credit.png" title="Credit card" subtitle="3 cards linked" />
        <DividerInset />
        <ListItemAvatar asset="bill_electric.png" title="Electricity bill" subtitle="Tata Power" />
        <DividerInset />
        <ListItemAvatar asset="bill_mobile.png" title="Mobile recharge" subtitle="Airtel · autopay on" />
        <DividerInset />
        <ListItemAvatar bg="#F0F4F7" glyph={<GlyphMore />} title="View all bills" />
      </>
    );

    /* F — Premium In-card Header Variant. Always renders an in-card header so F stays
       distinct from B regardless of outer header style. When the outer section header is
       hidden (isInCard), F carries the full title + CTA. Otherwise F shows just a History
       CTA inside the card — premium signature without duplicating the title. */
    const BL_F = ({ isInCard }) => (
      <PagePad>
        <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 24 }}>
          {isInCard && <InCardHeader title="Bills & Recharges" />}
          <BillsShortcutGrid />
        </div>
      </PagePad>
    );

    /* BL_K — Bills as a card-stack shuffle deck. Reuses FY_I's
       drag/auto-cycle engine via the new items + renderContent props.
       Each card: bill icon + title + sub + amount on the right. */
    const BL_K_ITEMS = [
      { title: 'Electricity bill',  sub: 'Due in 3 days',  amount: '₹1,240', heroImg: 'bill_electric.png' },
      { title: 'Mobile recharge',   sub: 'Plan expires today', amount: '₹299', heroImg: 'bill_mobile.png' },
      { title: 'Credit card bill',  sub: 'Due 12 May',     amount: '₹6,420', heroImg: 'bill_credit.png' },
    ];
    const BL_K = ({ autoScroll = true, showViewAll = true }) => (
      <>
        <FY_I
          autoScroll={autoScroll}
          items={BL_K_ITEMS}
          outerPaddingTop={0}
          renderContent={(it) => (
            <>
              <img src={`/assets/${it.heroImg}`} width={44} height={44} alt=""
                style={{ display: 'block', borderRadius: 12, flexShrink: 0, objectFit: 'contain', pointerEvents: 'none' }} />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{
                  ...T.h4,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{it.title}</div>
                <div style={{
                  ...T.caption, color: 'rgba(0,0,0,0.7)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{it.sub}</div>
              </div>
              <div style={{
                ...T.h4, color: 'rgba(0,0,0,0.9)', flexShrink: 0,
                pointerEvents: 'none',
              }}>{it.amount}</div>
            </>
          )} />
        {showViewAll && (
          /* Tiny secondary view-all pill straddling the stack's bottom
             edge — half above / half below so it reads as anchored to
             the last card. White fill + hairline outline keeps it quiet
             against the card surface above. */
          <PagePad>
            <div style={{
              marginTop: -19, position: 'relative', zIndex: 5,
              display: 'flex', justifyContent: 'center',
            }}>
              <button className="tap" style={{
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: 100, padding: '3px 10px',
                cursor: 'pointer',
                fontFamily: 'Rubik', fontSize: 11, fontWeight: 500,
                lineHeight: '14px', letterSpacing: '0.22px',
                color: 'rgba(0,0,0,0.9)',
                display: 'inline-flex', alignItems: 'center',
              }}>View all</button>
            </div>
          </PagePad>
        )}
      </>
    );

    /* BL_L — same shuffle deck as BL_K. "View all" CTA lives in the
       SECTION HEADER (right side, next to "Bills & Recharges") —
       wired up via ExplorePage's SectionWrap cta prop. The inline
       view-all from BL_K is suppressed so it doesn't double up. */
    const BL_L = ({ autoScroll = true }) => (
      <BL_K autoScroll={autoScroll} showViewAll={false} />
    );

    /* BL_M — shuffle deck + floating "View all" pill anchored to
       the bottom-right edge of the stack. White-fill secondary CTA
       (CARD_SHADOW + Valentino text) so it reads as a quiet
       affordance riding on the card surface. BL_K's inline view-all
       is suppressed so the floating pill is the only one. */
    const BL_M = ({ autoScroll = true }) => (
      <div style={{ position: 'relative' }}>
        <BL_K autoScroll={autoScroll} showViewAll={false} />
        <PagePad>
          <div style={{
            position: 'absolute', right: 24, bottom: -14,
            zIndex: 5,
          }}>
            <button className="tap" style={{
              background: '#FFFFFF',
              border: CARD_BORDER, boxShadow: CARD_SHADOW,
              borderRadius: 100, padding: '8px 14px',
              ...T.btnSm, color: '#D30AD7',
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              View all
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M9 6l6 6-6 6" stroke="#D30AD7" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </PagePad>
      </div>
    );

    /* BL_N — Category grid on top, todo card stack below. */
    const BL_N = () => (
      <div>
        <PagePad>
          <BillsShortcutGrid avatarVariant="outline" />
        </PagePad>
        <div style={{ height: 28 }} />
        <BL_K autoScroll={true} showViewAll={false} />
      </div>
    );

    /* BL_O — Todo card stack on top, category grid below.
       Stack leads so the urgent bills are the first thing seen. */
    const BL_O = () => (
      <div>
        <BL_K autoScroll={true} showViewAll={false} />
        <div style={{ height: 20 }} />
        <PagePad>
          <BillsShortcutGrid avatarVariant="outline" />
        </PagePad>
      </div>
    );

    /* BL_P — Richer card-stack shuffle deck. Each card has a biller
       icon, title, account number, a "Pay ₹X" button, and a due-date
       tag. Inspired by CRED-style bill layout but in DLS 2.0 styling. */
    const BL_P_ITEMS = [
      { title: 'Electricity bill',  acct: 'A/C 3021 4456',     amount: '₹1,240', due: 'Due in 3 days', heroImg: 'bill_electric.png' },
      { title: 'Mobile recharge',   acct: 'Jio · 98XXX 12345', amount: '₹299',   due: 'Expires today', heroImg: 'bill_mobile.png' },
      { title: 'Credit card bill',  acct: 'XXXX 8842',         amount: '₹6,420', due: 'Due in 5 days', heroImg: 'bill_credit.png' },
    ];
    const BL_P = ({ autoScroll = true, showViewAll = true }) => (
      <>
        <FY_I
          autoScroll={autoScroll}
          items={BL_P_ITEMS}
          outerPaddingTop={0}
          renderContent={(it) => (
            <>
              <img src={`/assets/${it.heroImg}`} width={36} height={36} alt=""
                style={{ display: 'block', borderRadius: 10, flexShrink: 0, objectFit: 'contain', pointerEvents: 'none', alignSelf: 'flex-start', marginTop: 6 }} />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1, alignSelf: 'flex-start', marginTop: 6 }}>
                <div style={{
                  ...T.btnSm, lineHeight: '18px',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{it.title}</div>
                <div style={{
                  ...T.meta, color: 'rgba(0,0,0,0.4)', textTransform: 'none', letterSpacing: '0.2px',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{it.acct}</div>
              </div>
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, alignSelf: 'flex-start', marginTop: 6, width: 96 }}>
                <button className="tap" style={{
                  padding: '5px 12px', borderRadius: 100,
                  background: 'rgba(0,0,0,0.9)', border: 'none',
                  ...T.caption, fontWeight: 500, color: '#FFFFFF',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  pointerEvents: 'auto',
                }}>Pay {it.amount}</button>
                <div style={{
                  fontSize: 9, fontFamily: 'Rubik', fontWeight: 500,
                  lineHeight: '12px', letterSpacing: '0.4px',
                  textTransform: 'uppercase', color: '#C27511',
                }}>{it.due}</div>
              </div>
            </>
          )} />
        {showViewAll && (
          <PagePad>
            <div style={{
              marginTop: -19, position: 'relative', zIndex: 5,
              display: 'flex', justifyContent: 'center',
            }}>
              <button className="tap" style={{
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: 100, padding: '3px 10px',
                cursor: 'pointer',
                fontFamily: 'Rubik', fontSize: 11, fontWeight: 500,
                lineHeight: '14px', letterSpacing: '0.22px',
                color: 'rgba(0,0,0,0.9)',
                display: 'inline-flex', alignItems: 'center',
              }}>View all</button>
            </div>
          </PagePad>
        )}
      </>
    );

    /* BL_Q — Category grid on top, rich card stack below. */
    const BL_Q = () => (
      <div>
        <PagePad>
          <BillsShortcutGrid avatarVariant="outline" />
        </PagePad>
        <div style={{ height: 24 }} />
        <BL_P autoScroll={true} showViewAll={false} />
      </div>
    );

    /* BL_R — Minimal card-stack shuffle deck. Each card: circular biller
       icon (grey ring) + "Title xx1234" heading + "₹X overdue/due" subtitle
       in warning colour + chevron on right. Inspired by CRED bill rows. */
    const BL_R_ITEMS = [
      { title: 'Credit card xx8842',    sub: '₹6,420 due in 5 days',     color: '#C27511', heroImg: 'bill_credit.png' },
      { title: 'Electricity A/C 4456',  sub: '₹1,240 overdue by 2 days', color: '#CE1D26', heroImg: 'bill_electric.png' },
      { title: 'Mobile Jio 12345',      sub: '₹299 expires today',       color: '#C27511', heroImg: 'bill_mobile.png' },
    ];
    const BL_R = ({ autoScroll = true, showViewAll = false }) => (
      <FY_I
        autoScroll={autoScroll}
        items={BL_R_ITEMS}
        outerPaddingTop={0}
        renderContent={(it) => (
          <>
            <img src={`/assets/${it.heroImg}`} width={40} height={40} alt=""
              style={{ display: 'block', borderRadius: 12, flexShrink: 0, objectFit: 'contain' }} />
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{
                ...T.btnSm,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{it.title}</div>
              <div style={{
                ...T.caption, color: it.color,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{it.sub}</div>
            </div>
            <Chevron color="rgba(0,0,0,0.3)" />
          </>
        )} />
    );

    /* BL_S — Grid on top + BL_R minimal stack below. */
    const BL_S = () => (
      <div>
        <PagePad>
          <BillsShortcutGrid avatarVariant="outline" />
        </PagePad>
        <div style={{ height: 26 }} />
        <BL_R />
      </div>
    );

    /* BL_T — Grid inside a card + minimal stack below */
    const BL_T = () => (
      <div>
        <PagePad>
          <div style={{
            background: '#FFFFFF', boxShadow: CARD_SHADOW, border: CARD_BORDER,
            borderRadius: 16, padding: '20px 16px 16px',
          }}>
            <BillsShortcutGrid avatarVariant="outline" />
          </div>
        </PagePad>
        <div style={{ height: 24 }} />
        <BL_R />
      </div>
    );

    /* BL_U — Single card: grid icons on top, divider, then horizontal
       paginated bill items below. Each bill row fills the card width,
       swipe left/right to see more. */
    const BL_U = () => {
      const items = BL_R_ITEMS;
      const [billIdx, setBillIdx] = React.useState(0);
      const scrollRef = React.useRef(null);
      React.useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const onScroll = () => {
          const cw = el.offsetWidth;
          if (cw === 0) return;
          setBillIdx(Math.round(el.scrollLeft / cw));
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
      }, []);
      return (
        <PagePad>
          <div style={{
            background: '#FFFFFF', boxShadow: CARD_SHADOW, border: CARD_BORDER,
            borderRadius: 16, overflow: 'hidden',
          }}>
            {/* Grid icons — matches BL_B style */}
            <div style={{ padding: '16px 16px 14px' }}>
              <BillsShortcutGrid columnGap={20} />
            </div>
            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(0,0,0,0.04)', marginLeft: 16, marginRight: 16 }} />
            {/* Horizontal paginated bills */}
            <div ref={scrollRef} className="scrollbar-hide" style={{
              display: 'flex', overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              overscrollBehavior: 'none',
              marginTop: 4,
            }}>
              {items.map((it, i) => (
                <div key={i} style={{
                  flex: '0 0 100%', scrollSnapAlign: 'start', scrollSnapStop: 'always',
                  padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  boxSizing: 'border-box',
                }}>
                  <img src={`/assets/${it.heroImg}`} width={40} height={40} alt=""
                    style={{ display: 'block', borderRadius: 12, flexShrink: 0, objectFit: 'contain' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...T.btnSm, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</div>
                    <div style={{ ...T.caption, color: it.color, marginTop: 2 }}>{it.sub}</div>
                  </div>
                  <Chevron color="rgba(0,0,0,0.3)" />
                </div>
              ))}
            </div>
            {/* No pagination — clean bottom edge */}
            <div style={{ height: 4 }} />
          </div>
        </PagePad>
      );
    };

    /* BL_V — Same as BL_U but with a right-aligned "1/3" counter */
    const BL_V = () => {
      const items = BL_R_ITEMS;
      const [billIdx, setBillIdx] = React.useState(0);
      const scrollRef = React.useRef(null);
      React.useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const onScroll = () => {
          const cw = el.offsetWidth;
          if (cw === 0) return;
          setBillIdx(Math.round(el.scrollLeft / cw));
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
      }, []);
      return (
        <PagePad>
          <div style={{
            background: '#FFFFFF', boxShadow: CARD_SHADOW, border: CARD_BORDER,
            borderRadius: 16, overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 16px 14px' }}>
              <BillsShortcutGrid columnGap={20} />
            </div>
            <div style={{ height: 1, background: 'rgba(0,0,0,0.04)', marginLeft: 16, marginRight: 16 }} />
            <div ref={scrollRef} className="scrollbar-hide" style={{
              display: 'flex', overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              overscrollBehavior: 'none', marginTop: 4,
            }}>
              {items.map((it, i) => (
                <div key={i} style={{
                  flex: '0 0 100%', scrollSnapAlign: 'start', scrollSnapStop: 'always',
                  padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  boxSizing: 'border-box',
                }}>
                  <img src={`/assets/${it.heroImg}`} width={40} height={40} alt=""
                    style={{ display: 'block', borderRadius: 12, flexShrink: 0, objectFit: 'contain' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...T.btnSm, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</div>
                    <div style={{ ...T.caption, color: it.color, marginTop: 2 }}>{it.sub}</div>
                  </div>
                  <Chevron color="rgba(0,0,0,0.3)" />
                </div>
              ))}
            </div>
            {/* Right-aligned counter */}
            <div style={{
              display: 'flex', justifyContent: 'flex-end',
              padding: '4px 16px 10px',
            }}>
              <span style={{ ...T.meta, color: 'rgba(0,0,0,0.25)', textTransform: 'none' }}>
                {billIdx + 1}/{items.length}
              </span>
            </div>
          </div>
        </PagePad>
      );
    };

    /* BL_W — Same card but with a thin progress bar instead of dots */
    const BL_W = () => {
      const items = BL_R_ITEMS;
      const [billIdx, setBillIdx] = React.useState(0);
      const scrollRef = React.useRef(null);
      React.useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const onScroll = () => {
          const cw = el.offsetWidth;
          if (cw === 0) return;
          setBillIdx(Math.round(el.scrollLeft / cw));
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
      }, []);
      return (
        <PagePad>
          <div style={{
            background: '#FFFFFF', boxShadow: CARD_SHADOW, border: CARD_BORDER,
            borderRadius: 16, overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 16px 14px' }}>
              <BillsShortcutGrid columnGap={20} />
            </div>
            {/* Sliding glow divider — a highlight slides smoothly via transform */}
            <div style={{ padding: '0 16px', position: 'relative', height: 1.5 }}>
              {/* Base track */}
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: 1, background: 'rgba(0,0,0,0.03)',
              }} />
              {/* Sliding highlight — positioned via translateX, width = 1/N of track */}
              <div style={{
                position: 'absolute', top: 0, bottom: 0,
                width: `${100 / items.length}%`,
                transform: `translateX(${billIdx * 100}%)`,
                transition: 'transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
              }}>
                <div style={{
                  width: '100%', height: '100%',
                  background: 'radial-gradient(ellipse 100% 100% at center, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.02) 80%, transparent 100%)',
                  borderRadius: 1,
                }} />
              </div>
            </div>
            <div ref={scrollRef} className="scrollbar-hide" style={{
              display: 'flex', overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              overscrollBehavior: 'none', marginTop: 4,
            }}>
              {items.map((it, i) => (
                <div key={i} style={{
                  flex: '0 0 100%', scrollSnapAlign: 'start', scrollSnapStop: 'always',
                  padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  boxSizing: 'border-box',
                }}>
                  <img src={`/assets/${it.heroImg}`} width={40} height={40} alt=""
                    style={{ display: 'block', borderRadius: 12, flexShrink: 0, objectFit: 'contain' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...T.btnSm, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</div>
                    <div style={{ ...T.caption, color: it.color, marginTop: 2 }}>{it.sub}</div>
                  </div>
                  <Chevron color="rgba(0,0,0,0.3)" />
                </div>
              ))}
            </div>
            <div style={{ height: 4 }} />
          </div>
        </PagePad>
      );
    };

    const BillsSection = ({ variant, isInCard }) => {
      const C = { A: BL_A, B: BL_B, C: BL_C, D: BL_D, E: BL_E, F: BL_F, J: BL_J, K: BL_K, L: BL_L, M: BL_M, N: BL_N, P: BL_P, R: BL_R, S: BL_S, T: BL_T, U: BL_U, W: BL_W }[variant];
      return <C isInCard={isInCard} />;
    };

    /* ----- Rewards & Benefits: A:carousel(kept) B:marketing+rows(kept) C/D/E:NEW ----- */

    /* Rewards sub-components (PRD): Spark, Fire games, Monies.
       Invite & earn moved to the Footer section. */
    const RW_A = () => (
      <HScroll gap={12}>
        <div style={{ flex: '0 0 200px' }}>
          <ExploreMedium subtext="Spark · 12 live" title="Expires in 2d"
            icon={<img src="/assets/spark_icon.png" width={52} height={52} alt="" style={{ display: 'block' }} />} />
        </div>
        <div style={{ flex: '0 0 200px' }}>
          <ExploreMedium subtext="Fire games" title="5 fires"
            icon={<img src="/assets/fire_sparkle.png" width={54} height={54} alt="" />} />
        </div>
        <div style={{ flex: '0 0 200px' }}>
          <ExploreMedium subtext="Monies"
            title={<><MoniesGlyph size={18} /> 240</>}
            icon={<img src="/assets/monies_icon.png" width={52} height={52} alt="" style={{ display: 'block' }} />} />
        </div>
      </HScroll>
    );

    const RW_B = () => (
      <>
        <PagePad>
          <MarketingCard glyph={<img src="/assets/spark_icon.png" width={32} height={32} alt="" style={{ display: 'block' }} />}
            title="12 Spark offers live" subtitle="Fresh weekly drop · expires in 2 days" />
        </PagePad>
        <Spacer h={12} />
        <ListItemAvatar asset="fire_sparkle.png"
          title="Fire games" subtitle="5 fires · spin to claim 2x" />
        <DividerInset />
        <ListItemAvatar bg="#E0F4E8" glyph={<GlyphSpark color="#00A63E" />}
          title={<>Monies <MoniesGlyph size={14} /> 240</>} subtitle="Earn 1% on every CC bill · redeem now" />
      </>
    );

    /* E — Streak banner + carousel */
    const RW_E = () => (
      <>
        <PagePad>
          <div className="tap" style={{
            background: 'linear-gradient(135deg, #FAE2FA 0%, #E6EDF9 100%)',
            borderRadius: 16, padding: 16,
            display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
          }}>
            <Avatar bg="#FFFFFF" asset="fire_sparkle.png" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...T.btnSm, color: '#D30AD7' }}>Fire streak · day 7</div>
              <div style={{ ...T.caption }}>Keep going for 2x rewards tomorrow</div>
            </div>
            <Chevron color="#D30AD7" />
          </div>
        </PagePad>
        <Spacer h={12} />
        <HScroll gap={12}>
          <div style={{ flex: '0 0 200px' }}>
            <ExploreMedium subtext="Spark · 12 live" title="Expires 2d"
              icon={<img src="/assets/spark_icon.png" width={52} height={52} alt="" style={{ display: 'block' }} />} />
          </div>
          <div style={{ flex: '0 0 200px' }}>
            <ExploreMedium subtext="Monies"
              title={<><MoniesGlyph size={18} /> 240</>}
              icon={<img src="/assets/monies_icon.png" width={52} height={52} alt="" style={{ display: 'block' }} />} />
          </div>
        </HScroll>
      </>
    );

    /* F — Spark info-dense hero (Figma 9792:12018 ref) + Fire + Monies tiles below.
       Hero structure: 40px brand-orange spark avatar + 2-line title, hairline
       separator, then a stacked brand-logo cluster + status line with chevron. */
    const BrandLogoStack = () => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {[
          { bg: '#000000', label: '✓' },
          { bg: '#1DB954', label: 'S' },
          { bg: '#107BD4', label: 'F' },
          { bg: '#94A720', label: 'B' },
        ].map((b, i) => (
          <div key={i} style={{
            width: 22, height: 22, borderRadius: 100, background: b.bg,
            border: '1.5px solid #FFFFFF',
            marginLeft: i === 0 ? 0 : -6,
            display: 'grid', placeItems: 'center',
            color: '#FFFFFF', fontSize: 10, fontWeight: 600,
            flexShrink: 0,
          }}>{b.label}</div>
        ))}
      </div>
    );
    const SparkOrangeAvatar = () => (
      <div style={{
        width: 40, height: 40, borderRadius: 100,
        background: '#FFFFFF',
        display: 'grid', placeItems: 'center', flexShrink: 0,
        boxShadow: '0 0 0 1px rgba(0,0,0,0.04) inset',
      }}>
        <img src="/assets/spark_icon.png" width={22} height={22} alt="" style={{ display: 'block' }} />
      </div>
    );
    /* SparkHeroCard — RW_F's hero.
       Sequence on enter-viewport (tuned for smooth, unhurried pacing):
         t=0       : "Save ₹1200" visible, spark icon visible
         t≈650ms   : spark icon rotates+shrinks (680ms) → brand pills cascade
                     in (780ms each, 110ms stagger, last pill lands ~t≈2450ms)
         t≈2450ms  : title pushes up to next entry (800ms slide, lands ~3250ms)
         every 5200ms thereafter: title pushes up to the next entry
                     (continuous same-direction rotation — never reverses) */
    const SPARK_TITLES = ['Save ₹1200', '5 drops live'];
    /* Count + brand-led titles, used by RW_P. No ₹ amounts — the spark
       hero's headline should not visually compete with the Stats card's
       ₹X,XXX hero, which read as two competing money numbers. */
    const SPARK_TITLES_DROPS = ['5 drops today', 'New from Nykaa', 'Cashback on Zomato', 'Friday flash drop'];
    const SparkHeroCard = ({ titles = SPARK_TITLES }) => {
      const rootRef = React.useRef(null);
      const [cycleIdx, setCycleIdx] = React.useState(0);
      const [pillsPlay, setPillsPlay] = React.useState(false);
      React.useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        let pillsTimer, firstSwap, loopInterval;
        const obs = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            pillsTimer = setTimeout(() => setPillsPlay(true), 650);
            firstSwap = setTimeout(() => {
              setCycleIdx((i) => i + 1);
              loopInterval = setInterval(() => {
                setCycleIdx((i) => i + 1);
              }, 5200);
            }, 2450);
            obs.disconnect();
          }
        }, { threshold: 0.85, rootMargin: '0px 0px -260px 0px' });
        obs.observe(el);
        return () => {
          obs.disconnect();
          clearTimeout(pillsTimer);
          clearTimeout(firstSwap);
          clearInterval(loopInterval);
        };
      }, []);
      const titleSlideMs = 800;
      const titleEasing = 'cubic-bezier(0.22, 1, 0.36, 1)';
      const ROW_H = 24;
      /* Render enough strip rows to cover the current cycle plus a buffer.
         Each row sits at its own translateY offset; the WHOLE strip never
         resets — translateY just keeps moving up. This guarantees rotation
         direction is identical on every swap (no teleport, no reverse). */
      const stripLen = cycleIdx + 4;
      const stripItems = React.useMemo(
        () => Array.from({ length: stripLen }, (_, i) => titles[i % titles.length]),
        [stripLen, titles]
      );
      return (
        <button ref={rootRef} className="tap" style={{
          width: '100%', padding: 20, borderRadius: 16,
          background: '#FFFFFF', border: CARD_BORDER, boxShadow: CARD_SHADOW,
          textAlign: 'left', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 16,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...T.caption, color: 'rgba(0,0,0,0.5)' }}>Spark</div>
            {/* Title rolls upward continuously. The strip's translateY keeps
                increasing so the eye always sees motion in the same direction. */}
            <div style={{
              position: 'relative', marginTop: 4, height: ROW_H,
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                transform: `translateY(${-cycleIdx * ROW_H}px)`,
                transition: `transform ${titleSlideMs}ms ${titleEasing}`,
                willChange: 'transform',
              }}>
                {stripItems.map((t, i) => (
                  <div key={i} style={{
                    ...T.h3, color: 'rgba(0,0,0,0.9)',
                    height: ROW_H, lineHeight: `${ROW_H}px`,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{t}</div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ flexShrink: 0 }}>
            <SparkBrandStack animate play={pillsPlay} iconSize={44} size={32} overlap={10} />
          </div>
        </button>
      );
    };

    const RW_F = ({ isInCard }) => {
      /* Simplified spark hero — same content pattern as the spark tile
         in RW_K, scaled up to hero size. Single icon + single label/value
         pair + chevron. Two states (default copy here = "drops available"):
           · "5 drops" / sub "Tap to browse" → goes to spark list
           · "1 active" / sub "Tap to claim" → direct claim
         The previous version had: title row + divider + brand-logo stack
         + meta line ("4 sparks live · Due in 5 days"). All of that is
         repeat content for a one-glance Explore card — pruned. */
      const sparkHero = <SparkHeroCard />;
      const fireMoniesRow = (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <ExploreMedium subtext="Fire games" title="3 fires"
            icon={<img src="/assets/fire_sparkle.png" width={54} height={54} alt="" />} />
          <ExploreMedium subtext="Monies"
            title={<><MoniesGlyph size={18} /> 240</>}
            icon={<img src="/assets/monies_icon.png" width={52} height={52} alt="" style={{ display: 'block' }} />} />
        </div>
      );
      return (
        <PagePad>
          {fireMoniesRow}
          <div style={{ marginTop: 16 }}>{sparkHero}</div>
        </PagePad>
      );
    };

    /* RW_G — Fire-game hero card + Spark/Monies 2-up below.
       Hero matches Figma 9792:10201: two-row layout — header (title + leaderboard +
       trailing chevron) on top, dashed separator, then fire-stack illustration on
       the left + outline "Play Now" CTA on the right. */
    const RW_G = ({ isInCard }) => (
      <>
        <PagePad>
          <button className="tap" style={{
            width: '100%', padding: 20, borderRadius: 16,
            background: '#FFFFFF', border: CARD_BORDER, boxShadow: CARD_SHADOW,
            display: 'flex', flexDirection: 'column', gap: 12,
            textAlign: 'left', cursor: 'pointer', position: 'relative', overflow: 'hidden',
          }}>
            {/* Header row — chevron vertically centered with the title block */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...T.h4, color: 'rgba(0,0,0,0.9)' }}>Play &amp; win</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <img src="/assets/rank_badge_1.png" width={17} height={17} alt="" style={{ display: 'block' }} />
                  <span style={{ ...T.caption, color: 'rgba(0,0,0,0.7)' }}>Aman leading with</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                    <span style={{ ...T.caption, color: 'rgba(0,0,0,0.9)', fontWeight: 500 }}><MoniesGlyph size={12} /> 4,657</span>
                  </span>
                </div>
              </div>
              <Chevron />
            </div>
            {/* Dashed separator — only the gap BELOW it is tightened (16 → 8)
                so the fire-stack card sits closer to the divider while the
                header keeps its full 12 above. */}
            <div style={{ borderTop: '1px dashed rgba(0,0,0,0.12)', marginBottom: -8 }} />
            {/* Bottom row — illustration + CTA, vertically centered (Figma 9792:10201) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 4 }}>
              <img src="/assets/fire_stack.png" alt="" style={{
                width: 124, height: 'auto', flexShrink: 0,
                objectFit: 'contain', display: 'block',
                marginBottom: -20, /* let the illustration kiss the card bottom */
                marginLeft: 16,
              }} />
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  padding: '8px 16px', height: 36, borderRadius: 100,
                  background: 'transparent',
                  border: '1px solid rgba(0,0,0,0.2)',
                  ...T.btnSm, color: '#D30AD7', whiteSpace: 'nowrap',
                }}>Play Now</div>
              </div>
            </div>
          </button>
        </PagePad>
        <Spacer h={isInCard ? 20 : 16} />
        <PagePad>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <ExploreMedium
              subtext="Spark"
              title="5 live"
              icon={<SparkBubbleCloud animate iconSize={52} />} />
            <ExploreMedium subtext="Monies"
              title={<><MoniesGlyph size={18} /> 240</>}
              icon={<img src="/assets/monies_icon.png" width={52} height={52} alt="" style={{ display: 'block' }} />} />
          </div>
        </PagePad>
      </>
    );

    /* RW_H — Compact one-line fire row. Drops the dashed-separator hero +
       fire-stack illustration in favour of a tight tile: small icon, single
       title, single sub line, single outline CTA. Same Spark/Monies 2-up
       beneath. PM rationale: title was "Play & win" + button "Play Now"
       (redundant "Play"). Leaderboard ("Aman leading with ₹4,657") tells
       the user someone else is winning, not what's at stake for them.
       Replaced with "Win up to ₹X" so the line motivates the user. */
    const RW_H = ({ isInCard }) => (
      <>
        <PagePad>
          <button className="tap" style={{
            width: '100%', padding: '16px 20px', borderRadius: 16,
            background: '#FFFFFF', border: CARD_BORDER, boxShadow: CARD_SHADOW,
            display: 'flex', alignItems: 'center', gap: 14,
            textAlign: 'left', cursor: 'pointer',
          }}>
            <img src="/assets/fire_sparkle.png" width={44} height={44} alt=""
              style={{ display: 'block', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...T.h4 }}>Fire games</div>
              <div style={{ ...T.caption, color: 'rgba(0,0,0,0.7)', marginTop: 2 }}>
                Win up to <span style={{ color: 'rgba(0,0,0,0.9)', fontWeight: 500 }}><MoniesGlyph size={12} /> 4,657</span>
              </div>
            </div>
            <div style={{
              padding: '6px 14px', borderRadius: 100,
              background: 'transparent', border: '1px solid rgba(0,0,0,0.2)',
              ...T.btnSm, color: '#D30AD7', whiteSpace: 'nowrap', flexShrink: 0,
            }}>Play</div>
          </button>
        </PagePad>
        <Spacer h={isInCard ? 20 : 16} />
        <PagePad>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <ExploreMedium subtext="Spark" title="5 live" icon={<SparkBrandStack />} />
            <ExploreMedium subtext="Monies"
              title={<><MoniesGlyph size={18} /> 240</>}
              icon={<img src="/assets/monies_icon.png" width={52} height={52} alt="" style={{ display: 'block' }} />} />
          </div>
        </PagePad>
      </>
    );

    /* RW_I — Balanced fire hero. Keeps the illustration prominent but
       fixes the spacing issues in RW_G: even 20px padding on all sides,
       no negative margins on the fire-stack image (it no longer bleeds
       off the bottom), and the CTA sits inline with the title block
       instead of being flung to the right edge.
       Copy: drops the leaderboard, replaces with "Win up to ₹X". */
    const RW_I = ({ isInCard }) => (
      <>
        <PagePad>
          <button className="tap" style={{
            width: '100%', padding: 20, borderRadius: 16,
            background: '#FFFFFF', border: CARD_BORDER, boxShadow: CARD_SHADOW,
            display: 'flex', alignItems: 'center', gap: 20,
            textAlign: 'left', cursor: 'pointer',
          }}>
            {/* Illustration centered in its own square slot so padding
                around it is symmetric to the card edges. */}
            <div style={{
              width: 92, height: 92, flexShrink: 0,
              display: 'grid', placeItems: 'center',
            }}>
              <img src="/assets/fire_stack.png" alt="" style={{
                width: 92, height: 92, objectFit: 'contain', display: 'block',
              }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...T.h4 }}>Fire games</div>
              <div style={{ ...T.caption, color: 'rgba(0,0,0,0.7)', marginTop: 4 }}>
                Win up to <span style={{ color: 'rgba(0,0,0,0.9)', fontWeight: 500 }}><MoniesGlyph size={12} /> 4,657</span>
              </div>
              <div style={{ marginTop: 12 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  padding: '6px 16px', borderRadius: 100,
                  background: 'transparent', border: '1px solid rgba(0,0,0,0.2)',
                  ...T.btnSm, color: '#D30AD7', whiteSpace: 'nowrap',
                }}>Play now</span>
              </div>
            </div>
          </button>
        </PagePad>
        <Spacer h={isInCard ? 20 : 16} />
        <PagePad>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <ExploreMedium subtext="Spark" title="5 live" icon={<SparkBrandStack />} />
            <ExploreMedium subtext="Monies"
              title={<><MoniesGlyph size={18} /> 240</>}
              icon={<img src="/assets/monies_icon.png" width={52} height={52} alt="" style={{ display: 'block' }} />} />
          </div>
        </PagePad>
      </>
    );

    /* RW_K — "Triptych" rewards palette. Three tiles, each its own
       DLS-derived chromatic moment, no CTA below — each tile IS the
       tap target with its own entry point.

       PM rationale: Rewards section needs to feel earned, not
       informational. The chromatic variety per reward gives the
       section a "palette of rewards" feel instead of three identical
       white tiles. No unified CTA — each reward has its own state and
       its own destination:
         · Fire   → game launcher when fires are live; rewards page otherwise
         · Spark  → claim screen when one is active; drop list otherwise
         · Monies → monies wallet
       Slice-y typography: Caption labels, H4 values, M corner radius,
       L (24) padding equivalent (16 horizontal + 16 vertical works at
       3-col grid scale). No oversized custom font sizes. */
    /* Tile surface treatments:
       · Default = white card recipe (matches every other card on the
         page — white bg, Outline/Subtle border, Card shadow).
       · Spark keeps the brand gradient because it IS the brand-led
         reward; a single chromatic moment in the row reads as a feature,
         not a different design system. */
    const RW_K_TILES = [
      {
        key: 'fire',
        surface: 'card',
        iconAsset: 'fire_sparkle.png',
        label: 'Fires',
        /* Default = "live" state: tap launches the game directly.
           Alternate state copy (no fires): "Fire games" / "Play to win" —
           taps go to the rewards page. */
        value: '6 live',
      },
      {
        key: 'spark',
        surface: 'brand',
        iconAsset: 'spark_icon.png',
        label: 'Spark',
        /* Default state: "5 drops" available. Active state copy:
           "1 active" → tap goes to claim screen. */
        value: '5 drops',
      },
      {
        key: 'refer',
        surface: 'card',
        iconAsset: 'invite_magnet.png',
        label: 'Invite & earn',
        value: '₹500',
      },
    ];
    const RW_K = () => (
      <PagePad>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {RW_K_TILES.map(t => {
            /* All three tiles share the same white-card surface — the
               spark icon's orange-bolt illustration carries the differentiation
               on its own. No bg/text color override per tile. */
            const labelColor = 'rgba(0,0,0,0.5)';
            const valueColor = 'rgba(0,0,0,0.9)';
            return (
              <button key={t.key} className="tap" style={{
                padding: '20px 12px', borderRadius: 16,
                background: '#FFFFFF',
                border: CARD_BORDER,
                boxShadow: CARD_SHADOW,
                /* Centered composition. Reward tiles aren't data cards
                   (where top-left labels work) — they're identity tiles,
                   like app icons in a launcher. Center the illustration,
                   stack caption + value below it. Equal axis alignment
                   removes the lopsided "dead corner" feel that the
                   top-left + bottom-right composition was creating at
                   3-col widths. */
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 10, minHeight: 128,
                textAlign: 'center', cursor: 'pointer',
                overflow: 'hidden',
              }}>
                {t.iconAsset
                  ? <img src={`/assets/${t.iconAsset}`} width={40} height={40} alt=""
                      style={{ display: 'block' }} />
                  : t.iconNode}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <div style={{ ...T.caption, color: labelColor }}>{t.label}</div>
                  <div style={{
                    ...T.h4,
                    color: valueColor,
                    display: 'inline-flex', alignItems: 'center',
                    justifyContent: 'center', gap: 2,
                  }}>
                    {t.valueNode || t.value}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </PagePad>
    );

    /* RW_N — Bento. Three reward tiles in an asymmetric 2-col grid:
       Spark hero spans both rows on the left (brand gradient, soft
       L-radius rounded rectangle); Fire is a pill on the top-right;
       Monies is a tight rounded square on the bottom-right. Each tile
       owns a distinct shape character so the trio reads as a curated
       bento, not three identical tiles.
         · Spark   → 28px radius (large soft rect, hero scale)
         · Fire    → 100px radius (full pill / capsule)
         · Monies  → 16px radius (M, the page's standard card radius)
       Atom-level styling stays slice DLS: brand gradient on Spark,
       white card recipe (Outline subtle + Card shadow) on the others. */
    const RW_N = () => (
      <PagePad>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '5fr 4fr',
          gridTemplateRows: '116px 116px',
          gap: 10,
        }}>
          {/* Spark — tall hero, brand gradient, soft rounded rect. */}
          <button className="tap" style={{
            gridRow: 'span 2',
            background: 'linear-gradient(135deg, #D30AD7 0%, #2B6ACF 100%)',
            borderRadius: 28, border: 'none', boxShadow: CARD_SHADOW,
            padding: 18,
            display: 'flex', flexDirection: 'column',
            alignItems: 'flex-start', justifyContent: 'space-between',
            textAlign: 'left', cursor: 'pointer',
            overflow: 'hidden',
          }}>
            <img src="/assets/spark_icon.png" width={44} height={44} alt=""
              style={{ display: 'block' }} />
            <div>
              <div style={{ ...T.caption, color: 'rgba(255,255,255,0.7)' }}>Spark</div>
              <div style={{ ...T.h3, color: '#FFFFFF', marginTop: 2 }}>5 drops</div>
            </div>
          </button>
          {/* Fire — pill. */}
          <button className="tap" style={{
            background: '#FFFFFF',
            borderRadius: 100, border: CARD_BORDER, boxShadow: CARD_SHADOW,
            padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: 10,
            textAlign: 'left', cursor: 'pointer',
            overflow: 'hidden',
          }}>
            <img src="/assets/fire_sparkle.png" width={36} height={36} alt=""
              style={{ display: 'block', flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
              <div style={{ ...T.caption, color: 'rgba(0,0,0,0.5)' }}>Fires</div>
              <div style={{ ...T.btnSm, color: 'rgba(0,0,0,0.9)' }}>6 live</div>
            </div>
          </button>
          {/* Monies — rounded square. */}
          <button className="tap" style={{
            background: '#FFFFFF',
            borderRadius: 16, border: CARD_BORDER, boxShadow: CARD_SHADOW,
            padding: 14,
            display: 'flex', alignItems: 'center', gap: 10,
            textAlign: 'left', cursor: 'pointer',
            overflow: 'hidden',
          }}>
            <img src="/assets/monies_icon.png" width={36} height={36} alt=""
              style={{ display: 'block', flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
              <div style={{ ...T.caption, color: 'rgba(0,0,0,0.5)' }}>Monies</div>
              <div style={{
                ...T.btnSm, color: 'rgba(0,0,0,0.9)',
                display: 'inline-flex', alignItems: 'center', gap: 2,
              }}><MoniesGlyph size={12} /> 240</div>
            </div>
          </button>
        </div>
      </PagePad>
    );



    /* RW_O — Deck-to-expand. Three clean cards (Monies / Fires / Spark)
       start STACKED like a deck. When the section scrolls into the viewport,
       the IntersectionObserver flips `expanded` and the cards animate to
       three equally-spaced slots in a vertical column. Each card carries
       just a heading + subheading — no CTAs, no extra stats, no chevrons.
       Card 0 sits on top of the stack initially; the trailing cards fan
       out below it on expansion. */
    /* RW_O — Three SEPARATE white DLS cards stacked vertically (Monies /
       Fires / Spark). Each card is a complete tap target with its own
       border, shadow, and radius — reads as three peer entry points
       rather than three rows of one list. 12px gap between cards. */
    const RW_O_ROWS = [
      { label: 'Monies', headline: <><MoniesGlyph size={20} /><span>&nbsp;240</span></>, icon: 'monies_icon.png' },
      { label: 'Fires',  headline: '3 ready',          icon: 'fire_sparkle.png' },
      { label: 'Spark',  headline: '5 drops live',     icon: 'spark_icon.png' },
    ];
    const RW_O = () => (
      <PagePad>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {RW_O_ROWS.map((row) => (
            <button key={row.label} className="tap" style={{
              width: '100%', padding: '18px 20px',
              background: '#FFFFFF', border: CARD_BORDER, boxShadow: CARD_SHADOW,
              borderRadius: 16,
              textAlign: 'left', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...T.caption, color: 'rgba(0,0,0,0.5)' }}>{row.label}</div>
                <div style={{
                  ...T.h3, color: 'rgba(0,0,0,0.9)', marginTop: 2,
                  display: 'inline-flex', alignItems: 'baseline',
                }}>{row.headline}</div>
              </div>
              {row.label === 'Spark' ? (
                /* Same animation RW_S (SparkHeroCard) uses: spark icon
                   rotates out and brand pills cascade in horizontally.
                   Sized to fit the row's trailing icon slot. */
                <div style={{ flexShrink: 0 }}>
                  <SparkBrandStack animate iconSize={40} size={28} overlap={10} />
                </div>
              ) : (
                <img src={`/assets/${row.icon}`} width={44} height={44} alt=""
                  style={{ display: 'block', flexShrink: 0 }} />
              )}
            </button>
          ))}
        </div>
      </PagePad>
    );


    /* RW_P — RW_F's recipe (Fire/Monies 2-up + Spark hero) but the
       spark hero's rolling headline is count/brand-led ("5 drops today",
       "New from Nykaa") instead of money-led ("Save ₹1200"). Stops the
       Spark hero from visually competing with the ₹X,XXX hero on the
       Statistics card directly below — two big rupee numbers stacked
       on the same screen read as a contradiction. */
    const RW_P = ({ isInCard }) => {
      const sparkHero = <SparkHeroCard titles={SPARK_TITLES_DROPS} />;
      const fireMoniesRow = (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <ExploreMedium subtext="Fire games" title="3 fires"
            icon={<img src="/assets/fire_sparkle.png" width={54} height={54} alt="" />} />
          <ExploreMedium subtext="Monies"
            title={<><MoniesGlyph size={18} /> 240</>}
            icon={<img src="/assets/monies_icon.png" width={52} height={52} alt="" style={{ display: 'block' }} />} />
        </div>
      );
      return (
        <PagePad>
          {fireMoniesRow}
          <div style={{ marginTop: 16 }}>{sparkHero}</div>
        </PagePad>
      );
    };

    /* RW_R — Fire + Spark as a square pair on top, Monies as a wide
       landscape banner below. Spark tile uses the animated
       SparkBubbleCloud reveal (same as RW_G) so the eye lands on the
       active spark first. Composition-driven hierarchy without
       leaning on colour. */
    const RW_R = () => {
      const moniesLandscape = (
        <button className="tap" style={{
          width: '100%', height: 96, padding: '16px 20px',
          borderRadius: 16,
          background: '#FFFFFF', border: CARD_BORDER, boxShadow: CARD_SHADOW,
          textAlign: 'left', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 16,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={T.caption}>Monies</div>
            <div style={{ ...T.h3, color: 'rgba(0,0,0,0.9)', marginTop: 4,
              display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <MoniesGlyph size={18} /> 240
            </div>
          </div>
          <img src="/assets/monies_icon.png" width={48} height={48} alt=""
            style={{ display: 'block', flexShrink: 0 }} />
        </button>
      );
      return (
        <PagePad>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <ExploreMedium subtext="Fire games" title="3 fires"
              icon={<img src="/assets/fire_sparkle.png" width={54} height={54} alt="" />} />
            <ExploreMedium subtext="Spark" title="5 live"
              icon={<SparkBubbleCloud animate iconSize={52} />} />
          </div>
          <div style={{ marginTop: 16 }}>
            {moniesLandscape}
          </div>
        </PagePad>
      );
    };

    /* RW_U — Portrait card carousel using the Figma poster artwork
       (Monies / Fire / Spark — each a 148×212 gradient card with
       baked-in illustration). Horizontal scroll-snap, text overlay
       top-left in white. No pagination dots — the artwork carries the
       position cue. Pair with headerStyle = 'None' for a cleaner
       presentation that lets the cards speak. */
    /* Two type levels — small caption on top (label), big headline
       below (count + unit). Captions follow slice's section/product
       names; headlines carry the at-a-glance number. */
    const RW_U_CARDS = [
      { bg: 'rw_card_monies.png', caption: 'Monies',      headline: '240 monies' },
      { bg: 'rw_card_fire.png',   caption: 'Play & win',  headline: '3 fires' },
      { bg: 'rw_card_spark.png',  caption: 'Sparks',      headline: '5 drops live' },
      { bg: 'rw_card_refer.png',  caption: 'Invite & earn', headline: '₹500 each' },
    ];
    const RW_U = () => (
      <div style={{ marginTop: -4 }}>
        <div className="scrollbar-hide no-page-swipe" style={{
          display: 'flex', overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          overscrollBehavior: 'none',
          paddingLeft: 24, paddingRight: 24,
          /* Snap respects the 24px page inset on both sides, so the
             first card stops 24px in from the screen edge instead of
             flush against it. */
          scrollPaddingLeft: 24, scrollPaddingRight: 24,
          gap: 12,
        }}>
          {RW_U_CARDS.map((card) => (
            <button key={card.bg} className="tap" style={{
              /* Slice DLS card recipe applied to a portrait poster.
                 New artwork is 296:390 (~0.76 aspect). Card size
                 132×174 keeps the ratio at the strip's compact scale. */
              flex: '0 0 132px', height: 174,
              padding: '20px 16px 16px 16px',
              /* DLS M (16) — match every other card on the page. The
                 earlier 24/20 squircle was too rounded and read as
                 inconsistent with neighbouring section cards. */
              borderRadius: 16,
              border: 'none', boxShadow: CARD_SHADOW,
              backgroundImage: `url(/assets/${card.bg})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              backgroundColor: '#000',
              scrollSnapAlign: 'start',
              textAlign: 'left', cursor: 'pointer', position: 'relative',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ ...T.caption, color: 'rgba(255,255,255,0.85)' }}>
                {card.caption}
              </div>
              <div style={{ ...T.h4, color: '#FFFFFF', marginTop: 4 }}>
                {card.headline}
              </div>
            </button>
          ))}
        </div>
      </div>
    );

    /* RW_X portrait cards with 2-state cycling animation.
       Fire card: state 0 = original poster, state 1 = leaderboard leader (Aman, purple gradient, 40×40 avatar).
       Spark card: state 0 = original poster, state 1 = brand showcase (orange gradient + merchant logos).
       3s per state, crossfade via opacity transition. */
    const RW_X_Card = ({ cardKey, sharedCycle = 0, visible = false }) => {
      const cardRef = React.useRef(null);
      const cycle = sharedCycle;
      const phase = cycle % 2; // 0 = poster, 1 = alt
      const isFire = cardKey === 'fire';
      const isSpark = cardKey === 'spark';
      /* Spark: cycles continuously like fire */
      const showAlt = (isSpark || isFire) ? (phase === 1) : false;
      /* Fire avatar rotation: -90→0 on appear, 0→90 on disappear.
         Before first show (cycle 0): hidden at -90.
         Showing (phase 1): 0. After dismiss (phase 0, cycle≥2): 90. */
      const fireRotation = showAlt ? 'rotate(0deg)' : (cycle === 0 ? 'rotate(-90deg)' : 'rotate(90deg)');
      const T_MS = '0.6s';
      const EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1)';
      return (
        <button ref={cardRef} className="tap" style={{
          flex: '0 0 132px', height: 174,
          borderRadius: 16, border: 'none', boxShadow: CARD_SHADOW,
          scrollSnapAlign: 'start',
          textAlign: 'left', cursor: 'pointer', position: 'relative',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden', backgroundColor: '#000',
          padding: 0,
        }}>
          {/* === BACKGROUND LAYERS === */}
          {/* State 0 — poster. Invite & earn uses layered bg + mascot + star.
             Others use single poster image. */}
          {(!isFire && !isSpark) ? (
            <div style={{
              position: 'absolute', inset: 0,
            }}>
              {/* Blue gradient bg */}
              <img src="/assets/fire_card_bg.png" alt="" style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', pointerEvents: 'none',
              }} />
              {/* Mascot — 120px tall, cut off at bottom-right edge */}
              <img src="/assets/fire_mascot.png" alt="" style={{
                position: 'absolute', right: -12, bottom: -22,
                height: 110, width: 'auto', pointerEvents: 'none',
                transformOrigin: 'center bottom',
                animation: visible ? 'fire-mascot-rock 1.5s ease-in-out infinite alternate' : 'none',
              }} />
              {/* Star — bounces to the left of mascot's hand */}
              <img src="/assets/fire_star.png" alt="" style={{
                position: 'absolute', right: 74, bottom: 30,
                width: 20, height: 20, pointerEvents: 'none',
                animation: visible ? 'fire-star-bounce 1.5s ease-in-out infinite alternate' : 'none',
              }} />
            </div>
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: isFire ? 'url(/assets/rw_card_fire.png)'
                : 'url(/assets/rw_card_spark.png)',
              backgroundSize: 'cover', backgroundPosition: 'center',
              opacity: showAlt ? 0 : 1,
              transition: showAlt ? `opacity ${T_MS} ${EASE}` : `opacity 0.3s ${EASE}`,
            }} />
          )}
          {/* State 1 — gradient bg */}
          {isFire && <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(160deg, #1A0040 0%, #3B0D7A 40%, #6B1FB8 100%)',
            opacity: showAlt ? 1 : 0,
            transition: `opacity ${T_MS} ${EASE}`,
          }} />}
          {isSpark && <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/assets/spark_bg_gradient.png)',
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: showAlt ? 1 : 0,
            /* Fade in fast (0.3s) so gradient is opaque before poster
               finishes fading out — no black gap in the middle. */
            transition: showAlt ? `opacity 0.3s ${EASE}` : `opacity 0.4s ${EASE} 0.1s`,
          }} />}

          {/* === FIRE: radial glow + avatar (64×64, 22px inset) === */}
          {isFire && (
            <>
              <div style={{
                position: 'absolute', right: -10, bottom: -10,
                width: 140, height: 140,
                background: 'radial-gradient(circle, rgba(211,10,215,0.45) 0%, rgba(211,10,215,0) 65%)',
                opacity: showAlt ? 1 : 0,
                transition: `opacity ${T_MS} ${EASE}`,
                pointerEvents: 'none',
              }} />
              <img src="/assets/leaderboard_aman.png" alt="" style={{
                position: 'absolute', right: 14, bottom: 10,
                width: 64, height: 64, objectFit: 'contain',
                borderRadius: 32, pointerEvents: 'none',
                opacity: showAlt ? 1 : 0,
                transform: `${fireRotation} scale(${showAlt ? 1 : 0.6})`,
                transformOrigin: 'center center',
                transition: `opacity ${T_MS} ${EASE}, transform ${T_MS} ${EASE}`,
              }} />
            </>
          )}

          {/* === SPARK: brand bubbles start as bg colour change ends === */}
          {isSpark && (
            <div style={{
              position: 'absolute', right: 14, bottom: 16,
              pointerEvents: 'none',
              opacity: showAlt ? 1 : 0,
              transition: showAlt ? `opacity 0.4s ${EASE} 0.2s` : `opacity 0.2s ${EASE}`,
            }}>
              <SparkBubbleCloud animate={showAlt} width={72} height={72} iconSize={0} startDelayMs={0} />
            </div>
          )}

          {/* === TEXT — vertical ticker (like FY_F spark card) ===
             Both text states stack vertically inside a masked container.
             On transition the whole stack slides up. Fade masks on top
             and bottom edges soften the clip. */}
          {/* Refer: static text */}
          {!isFire && !isSpark && (
            <div style={{ position: 'absolute', left: 16, top: 20, right: 16, zIndex: 1 }}>
              <div style={{ ...T.caption, color: 'rgba(255,255,255,0.85)' }}>Invite & earn</div>
              <div style={{ ...T.h4, color: '#FFFFFF', marginTop: 4 }}>₹500 each</div>
            </div>
          )}
          {/* Fire + Spark: one-directional vertical ticker.
             Uses RollingText pattern: [A, B, clone-A]. Scrolls to clone-A,
             then snaps back to real A without transition. Always upward. */}
          {(isFire || isSpark) && (() => {
            const CAP_H = 16;
            const HEAD_H = 20;
            const caps = isFire ? ['Play & win', 'Aman leading'] : ['Sparks', 'Sparks'];
            const heads = isFire
              ? [{ text: '3 fires' },
                 { node: (<span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                   <MoniesGlyph size={14} color="#FFFFFF" /> 8,435
                 </span>) }]
              : [{ text: 'Save ₹1,600' }, { text: '5 drops live' }];
            /* 4 slots: [A, B, clone-A, clone-B]. 4 is a multiple of 2
               so the ticker stays perfectly in sync with the 2-state
               bg toggle (cycle % 2). Snap happens at slot 0 every 4 cycles. */
            const capSlots = [caps[0], caps[1], caps[0], caps[1]];
            const headSlots = [heads[0], heads[1], heads[0], heads[1]];
            const tickIdx = cycle % 4;
            const isSnap = tickIdx === 0 && cycle >= 4;
            const maskStyle = {
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
            };
            return (
              <>
                <div style={{
                  position: 'absolute', left: 16, top: 20, right: 16, zIndex: 1,
                  height: CAP_H, overflow: 'hidden', ...maskStyle,
                }}>
                  <div style={{
                    transform: `translateY(-${tickIdx * CAP_H}px)`,
                    transition: (cycle > 0 && !isSnap) ? `transform 0.6s ${EASE}` : 'none',
                  }}>
                    {capSlots.map((c, i) => (
                      <div key={i} style={{ height: CAP_H, ...T.caption, color: 'rgba(255,255,255,0.85)' }}>{c}</div>
                    ))}
                  </div>
                </div>
                <div style={{
                  position: 'absolute', left: 16, top: 40, right: 16, zIndex: 1,
                  height: HEAD_H, overflow: 'hidden', ...maskStyle,
                }}>
                  <div style={{
                    transform: `translateY(-${tickIdx * HEAD_H}px)`,
                    transition: (cycle > 0 && !isSnap) ? `transform 0.6s ${EASE} 0.06s` : 'none',
                  }}>
                    {headSlots.map((h, i) => (
                      <div key={i} style={{ height: HEAD_H, ...T.h4, color: '#FFFFFF' }}>
                        {h.node || h.text}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
          {/* Legacy fire headline kept for reference — replaced by ticker above */}
          {false && isFire && (
            <div style={{
              position: 'absolute', left: 16, top: 38, right: 16, zIndex: 1,
            }}>
              <div style={{
                ...T.h4, color: '#FFFFFF',
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}>
                <MoniesGlyph size={14} color="#FFFFFF" /> 8,435
              </div>
            </div>
          )}
        </button>
      );
    };

    /* Shared scroll strip used by all RW_X Monies variants */
    /* Shared cycle + visibility for all RW_X cards so fire/spark
       stay perfectly in sync. Cycle only runs when the strip is
       fully visible (not cut off by top 25% of scroll container). */
    const RW_X_ScrollStrip = () => {
      const stripRef = React.useRef(null);
      const [stripVisible, setStripVisible] = React.useState(false);
      const [stripInView, setStripInView] = React.useState(true);
      const [sharedCycle, setSharedCycle] = React.useState(0);
      /* Detect first visibility */
      React.useEffect(() => {
        const el = stripRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
          if (e.isIntersecting) { setStripVisible(true); obs.disconnect(); }
        }, { threshold: 1.0, rootMargin: '0px 0px -20% 0px' });
        obs.observe(el);
        return () => obs.disconnect();
      }, []);
      /* Pause when in top 25% of scroll container */
      React.useEffect(() => {
        const el = stripRef.current;
        if (!el) return;
        const scroller = el.closest('.screen-scroll');
        if (!scroller) return;
        let last = true;
        const check = () => {
          const sr = scroller.getBoundingClientRect();
          const cr = el.getBoundingClientRect();
          const ok = (cr.top - sr.top) >= sr.height * 0.25;
          if (ok !== last) { last = ok; setStripInView(ok); }
        };
        scroller.addEventListener('scroll', check, { passive: true });
        check();
        return () => scroller.removeEventListener('scroll', check);
      }, []);
      /* Single shared cycle timer */
      React.useEffect(() => {
        if (!stripVisible || !stripInView) return;
        let intervalId;
        const delay = setTimeout(() => {
          setSharedCycle(c => c + 1);
          intervalId = setInterval(() => setSharedCycle(c => c + 1), 4000);
        }, 2000);
        return () => { clearTimeout(delay); if (intervalId) clearInterval(intervalId); };
      }, [stripVisible, stripInView]);
      return (
        <div ref={stripRef} className="scrollbar-hide no-page-swipe" style={{
          display: 'flex', overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          overscrollBehavior: 'none',
          paddingLeft: 24, paddingRight: 24,
          scrollPaddingLeft: 24, scrollPaddingRight: 24,
          gap: 12,
        }}>
          {['fire', 'spark', 'refer'].map(k =>
            <RW_X_Card key={k} cardKey={k} sharedCycle={sharedCycle} visible={stripVisible} />
          )}
        </div>
      );
    };

    /* ----- Monies — independent section, decoupled from Rewards ----- */

    /* MN_A — "Monies" label, amount below, 1% tag on right */
    const MN_A = () => (
      <PagePad>
        <button className="tap" style={{
          width: '100%', padding: '14px 16px',
          borderRadius: 16,
          background: '#FFFFFF', border: CARD_BORDER, boxShadow: CARD_SHADOW,
          textAlign: 'left', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <img src="/assets/monies_icon.png" width={32} height={32} alt=""
            style={{ display: 'block', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...T.caption, color: 'rgba(0,0,0,0.5)' }}>Monies balance</div>
            <div style={{
              ...T.h4, color: 'rgba(0,0,0,0.9)', marginTop: 2,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <MoniesGlyph size={14} /> 66,522
            </div>
          </div>
          <span style={{
            ...T.caption, fontWeight: 500, color: '#D30AD7',
            background: '#FAE2FA', borderRadius: 100,
            padding: '3px 10px',
          }}>1% reward rate</span>
        </button>
      </PagePad>
    );

    /* MN_B — "Monies" heading, "rewarded at 1%" subtitle, amount on right */
    const MN_B = () => (
      <PagePad>
        <button className="tap" style={{
          width: '100%', padding: '14px 16px',
          borderRadius: 16,
          background: '#FFFFFF', border: CARD_BORDER, boxShadow: CARD_SHADOW,
          textAlign: 'left', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <img src="/assets/monies_icon.png" width={32} height={32} alt=""
            style={{ display: 'block', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...T.h4, color: 'rgba(0,0,0,0.9)' }}>Monies</div>
            <div style={{ ...T.caption, color: 'rgba(0,0,0,0.5)', marginTop: 2 }}>rewarded at 1%</div>
          </div>
          <div style={{
            ...T.h4, color: 'rgba(0,0,0,0.9)',
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            <MoniesGlyph size={14} /> 66,522
          </div>
        </button>
      </PagePad>
    );

    /* MN_C — "Monies" heading, "rewarded at 1%" subtitle, amount + chevron */
    const MN_C = () => (
      <PagePad>
        <button className="tap" style={{
          width: '100%', padding: '14px 16px',
          borderRadius: 16,
          background: '#FFFFFF', border: CARD_BORDER, boxShadow: CARD_SHADOW,
          textAlign: 'left', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <img src="/assets/monies_icon.png" width={32} height={32} alt=""
            style={{ display: 'block', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...T.h4, color: 'rgba(0,0,0,0.9)' }}>Monies</div>
            <div style={{ ...T.caption, color: 'rgba(0,0,0,0.5)', marginTop: 2 }}>rewarded at 1%</div>
          </div>
          <div style={{
            ...T.h4, color: 'rgba(0,0,0,0.9)',
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            <MoniesGlyph size={14} /> 66,522
          </div>
          <Chevron color="rgba(0,0,0,0.3)" />
        </button>
      </PagePad>
    );

    /* MN_D — Valentino gradient strip matching RW_X card aesthetic */
    const MN_D = () => (
      <PagePad>
        <button className="tap" style={{
          width: '100%', padding: '14px 16px',
          borderRadius: 16, border: 'none',
          background: 'linear-gradient(135deg, #D30AD7 0%, #87068A 100%)',
          boxShadow: CARD_SHADOW,
          textAlign: 'left', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <img src="/assets/monies_icon.png" width={32} height={32} alt=""
            style={{ display: 'block', flexShrink: 0, filter: 'brightness(10)' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...T.caption, color: 'rgba(255,255,255,0.7)' }}>Monies balance</div>
            <div style={{
              ...T.h4, color: '#FFFFFF', marginTop: 2,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <MoniesGlyph size={14} color="#FFFFFF" /> 66,522
            </div>
          </div>
          <span style={{
            ...T.caption, fontWeight: 500, color: '#FFFFFF',
            background: 'rgba(255,255,255,0.2)', borderRadius: 100,
            padding: '3px 10px',
          }}>1% reward rate</span>
        </button>
      </PagePad>
    );

    const MoniesSection = ({ variant }) => {
      const C = { A: MN_A, B: MN_B, C: MN_C, D: MN_D }[variant] || MN_A;
      return <C />;
    };

    const RW_X = () => (
      <div>
        <RW_X_ScrollStrip />
      </div>
    );
    const RW_X2 = () => RW_X();
    const RW_X3 = () => (
      <div>
        <RW_X_ScrollStrip />
      </div>
    );

    /* RW_W — RW_R's layout with RW_U-style poster artwork, layered.
       Each card is built in two layers: (1) CSS gradient bg matching
       the original poster colour, (2) standalone illustration PNG
       positioned at the bottom-right so it doesn't fight the title
       block at the top-left. Lets text sit on a clean gradient
       area instead of overlapping baked-in artwork. */
    /* Exact gradient stops from the Figma source: fire = deep
       purple → violet; spark = warm orange triad; monies = magenta →
       purple. Direction matches the diagonal stop direction (top-left
       → bottom-right) used in the Figma poster artwork. */
    const RW_W_GRADIENTS = {
      fire:   'linear-gradient(135deg, #270097 0%, #5710B4 50%, #A72CE5 100%)',
      spark:  'linear-gradient(135deg, #E5724C 0%, #E96A22 50%, #EA7B02 100%)',
      monies: 'linear-gradient(135deg, #F10070 0%, #E413AB 46%, #D725E5 92%)',
    };
    const RW_W = () => {
      const squareTile = (key, ill, headline, label) => (
        <button key={key} className="tap" style={{
          width: '100%', aspectRatio: '1 / 1', padding: '20px 16px',
          borderRadius: 16,
          background: RW_W_GRADIENTS[key],
          border: 'none', boxShadow: CARD_SHADOW,
          textAlign: 'left', cursor: 'pointer', position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ ...T.h4, color: '#FFFFFF' }}>{headline}</div>
            <div style={{
              ...T.caption, color: 'rgba(255,255,255,0.85)', marginTop: 4,
            }}>{label}</div>
          </div>
          <img src={`/assets/${ill}`} alt="" aria-hidden style={{
            position: 'absolute', right: -6, bottom: -6,
            width: '62%', height: 'auto', objectFit: 'contain',
            pointerEvents: 'none',
          }} />
        </button>
      );
      const moniesBanner = (
        <button className="tap" style={{
          width: '100%', height: 104, padding: '16px 20px',
          borderRadius: 16,
          background: RW_W_GRADIENTS.monies,
          border: 'none', boxShadow: CARD_SHADOW,
          textAlign: 'left', cursor: 'pointer', position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ ...T.h3, color: '#FFFFFF',
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <MoniesGlyph size={18} color="#FFFFFF" /> 240
            </div>
            <div style={{ ...T.caption, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
              Monies earned this month
            </div>
          </div>
          <img src="/assets/rw_ill_monies.png" alt="" aria-hidden style={{
            position: 'absolute', right: 8, bottom: -4,
            height: 88, width: 'auto', objectFit: 'contain',
            pointerEvents: 'none',
          }} />
        </button>
      );
      return (
        <PagePad>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {squareTile('fire',  'rw_ill_fire.png',  '3 fires',  'Play & win')}
            {squareTile('spark', 'rw_ill_spark.png', '5 sparks', 'Live cashbacks')}
          </div>
          <div style={{ marginTop: 16 }}>
            {moniesBanner}
          </div>
        </PagePad>
      );
    };

    /* RW_V — RW_S's section treatment (tinted band + heading)
       wrapped around RW_U's content (portrait poster carousel).
       Tries U-style sectioning where the cards anchor the page but
       still get a clear "block" backing — band sets the section
       boundary, the carousel reads as the body. Heading mirrors the
       user's global headerStyle, same as RW_S. */
    const RW_V = ({ headerStyle }) => (
      <div style={{
        background: '#FDF4FD',
        paddingTop: 32, paddingBottom: 32,
      }}>
        {headerStyle === 'List' && (
          <div style={{ marginBottom: 16 }}>
            <SectionHeaderList title="Rewards & benefits" />
          </div>
        )}
        {headerStyle === 'Bold' && (
          <div style={{ marginBottom: 16 }}>
            <SectionHeaderBold title="Rewards & benefits" />
          </div>
        )}
        <RW_U />
      </div>
    );

    /* RW_T — Inlined section. Inspired by Cash App Offers: the section
       "title card" sits INSIDE the content grid as a large coloured
       block (Valentino), with the supporting tiles (Fire, Monies)
       stacked on the right. The colored card carries the section
       label + a count-pill CTA, so the grid itself plays the role of
       a section header. No separate SectionHeader needed — best paired
       with headerStyle = "None". */
    const RW_T = () => {
      const titleCard = (
        <button className="tap" style={{
          gridRow: '1 / span 2',
          padding: 20, borderRadius: 16,
          background: '#D30AD7',
          border: 'none', boxShadow: CARD_SHADOW,
          textAlign: 'left', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          minHeight: 200,
        }}>
          <div style={{
            fontFamily: 'Rubik', fontSize: 22, fontWeight: 500, lineHeight: '26px',
            color: '#FFFFFF',
          }}>Rewards<br/>for you</div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            alignSelf: 'flex-start',
            padding: '6px 12px', borderRadius: 100,
            background: '#FAE2FA',
            ...T.btnSm, color: '#87068A',
          }}>8 offers →</span>
        </button>
      );
      const smallTile = (subtext, title, iconSrc, iconSize = 40) => (
        <button className="tap" style={{
          padding: 14, borderRadius: 16,
          background: '#FFFFFF', border: CARD_BORDER, boxShadow: CARD_SHADOW,
          textAlign: 'left', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <img src={iconSrc} width={iconSize} height={iconSize} alt=""
            style={{ display: 'block' }} />
          <div style={{ marginTop: 8 }}>
            <div style={T.caption}>{subtext}</div>
            <div style={{ ...T.h4, marginTop: 2 }}>{title}</div>
          </div>
        </button>
      );
      return (
        <PagePad>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridAutoRows: '94px',
            gap: 12,
          }}>
            {titleCard}
            {smallTile('Fire games', '3 fires', '/assets/fire_sparkle.png', 40)}
            {smallTile('Monies', <><MoniesGlyph size={14} /> 240</>, '/assets/monies_icon.png', 36)}
          </div>
        </PagePad>
      );
    };

    /* RW_S — Tinted-band treatment. Reuses RW_F's content (Fire/Monies
       2-up + Spark hero) inside a full-bleed Valentino-tinted band
       with 32px vertical padding. The section heading sits INSIDE the
       band so the whole "Rewards & benefits" block reads as one
       coherent surface. Heading style mirrors the user's globally-
       selected headerStyle (Bold / List / None) so it stays consistent
       with every other section title on the page. */
    const RW_S = ({ headerStyle }) => {
      const sparkHero = <SparkHeroCard />;
      const fireMoniesRow = (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <ExploreMedium subtext="Fire games" title="3 fires"
            icon={<img src="/assets/fire_sparkle.png" width={54} height={54} alt="" />} />
          <ExploreMedium subtext="Monies"
            title={<><MoniesGlyph size={18} /> 240</>}
            icon={<img src="/assets/monies_icon.png" width={52} height={52} alt="" style={{ display: 'block' }} />} />
        </div>
      );
      return (
        <div style={{
          /* Solid subtle Valentino wash — hard top/bottom edges. The
             fade-in/out gradient was making the band read as ambiguous
             on a longer page; flat colour gives a cleaner section. */
          background: '#FDF4FD',
          paddingTop: 32, paddingBottom: 32,
        }}>
          {/* Render whichever section-header component matches the
              user's headerStyle setting. 'None' = no heading inside
              the band (cards still anchor the section). */}
          {headerStyle === 'List' && (
            <div style={{ marginBottom: 16 }}>
              <SectionHeaderList title="Rewards & benefits" />
            </div>
          )}
          {headerStyle === 'Bold' && (
            <div style={{ marginBottom: 16 }}>
              <SectionHeaderBold title="Rewards & benefits" />
            </div>
          )}
          <PagePad>
            {fireMoniesRow}
            <div style={{ marginTop: 16 }}>{sparkHero}</div>
          </PagePad>
        </div>
      );
    };

    /* RW_Q — Surface-mix variant. Same content as RW_F (Spark hero +
       Fire / Monies) but breaks the "three identical white cards"
       monotony two ways:
        · Spark hero sits on a Valentino-50 tinted surface (brand-leaning,
          not stark white) with a thin brand-gradient hairline on the
          top edge so it reads as the headline of the section.
        · Fire / Monies tiles below are flat outline tiles — no shadow,
          1px Outline/Bold border, white fill — so they recede next to
          the Spark hero instead of competing with it.
       The result is a clear hero → supporting-pair rhythm rather than
       three peer cards. */
    const RW_Q = () => {
      const sparkHero = (
        <button className="tap" style={{
          width: '100%', padding: 20, borderRadius: 16,
          background: '#FAE2FA',
          border: 'none', boxShadow: '0 2px 12px rgba(211,10,215,0.10)',
          textAlign: 'left', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 16,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Brand-gradient hairline on the top edge — slice's Valentino →
              Blue marker. Quiet but unambiguous as a brand surface. */}
          <div aria-hidden style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, #D30AD7 0%, #2B6ACF 100%)',
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...T.caption, color: 'rgba(0,0,0,0.6)' }}>Spark</div>
            <div style={{ ...T.h3, color: 'rgba(0,0,0,0.9)', marginTop: 4 }}>
              5 drops today
            </div>
          </div>
          <SparkBrandStack iconSize={44} size={32} overlap={10} />
        </button>
      );
      const flatTile = (subtext, title, iconSrc, iconSize = 44) => (
        <button className="tap" style={{
          width: '100%', height: 88, padding: 16, borderRadius: 16,
          background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.1)', boxShadow: 'none',
          textAlign: 'left', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={T.caption}>{subtext}</div>
            <div style={{ ...T.h4, marginTop: 4 }}>{title}</div>
          </div>
          <img src={iconSrc} width={iconSize} height={iconSize} alt=""
            style={{ display: 'block', flexShrink: 0 }} />
        </button>
      );
      return (
        <PagePad>
          {sparkHero}
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {flatTile('Fire games', '3 fires', '/assets/fire_sparkle.png')}
            {flatTile('Monies', <><MoniesGlyph size={16} /> 240</>, '/assets/monies_icon.png', 40)}
          </div>
        </PagePad>
      );
    };

    const RewardsSection = ({ variant, isInCard, headerStyle }) => {
      const C = { A: RW_A, B: RW_B, E: RW_E, F: RW_F, G: RW_G, H: RW_H, I: RW_I, K: RW_K, N: RW_N, O: RW_O, P: RW_P, Q: RW_Q, R: RW_R, S: RW_S, T: RW_T, U: RW_U, V: RW_V, W: RW_W, X: RW_X }[variant] || RW_F;
      return <C isInCard={isInCard} headerStyle={headerStyle} />;
    };

    /* ----- Statistics: A:bar+2cards(kept) B:list-rows(was C,kept) C/D/E:NEW ----- */

    const SpendBarChart = () => {
      const days = [
        { label: 'M', height: 38 }, { label: 'T', height: 26 }, { label: 'W', height: 56 },
        { label: 'T', height: 42 }, { label: 'F', height: 64, active: true },
        { label: 'S', height: 36 }, { label: 'S', height: 28 },
      ];
      return (
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          gap: 12, height: 80, marginTop: 24
        }}>
          {days.map((d, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
              <div style={{
                width: '100%', maxWidth: 22, height: d.height,
                background: d.active ? '#D30AD7' : '#EAEBED',
                borderRadius: '4px 4px 0 0',
              }} />
              <div style={{ ...T.caption }}>{d.label}</div>
            </div>
          ))}
        </div>
      );
    };

    const ST_A = () => (
      <PagePad>
        <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ ...T.btnSm, color: 'rgba(0,0,0,0.5)' }}>May spends</div>
              <div style={{ ...T.display, marginTop: 4 }}>₹12,487</div>
            </div>
            <TagSubtle intent="positive">↓ 18% vs Apr</TagSubtle>
          </div>
          <SpendBarChart />
        </div>
      </PagePad>
    );

    const ST_B = () => (
      <>
        <ListItemAvatar bg="#FAE2FA" glyph={<GlyphChart />}
          title="May spends" subtitle="↓ 18% vs Apr"
          trailing={<div style={T.h4}>₹12,487</div>} />
        <DividerInset />
        <ListItemAvatar bg="#F0F4F7" glyph={<GlyphMore />} title="View full report" />
      </>
    );

    /* C — Bar chart only, focused (NEW) */
    const ST_C = () => (
      <PagePad>
        <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ ...T.btnSm, color: 'rgba(0,0,0,0.5)' }}>May spends</div>
              <div style={{ ...T.display, marginTop: 4 }}>₹12,487</div>
            </div>
            <TagSubtle intent="positive">↓ 18% vs Apr</TagSubtle>
          </div>
          <SpendBarChart />
        </div>
      </PagePad>
    );

    /* ST_D — Top half of ST_L (caption + amount + delta + smooth-bezier
       sparkline with brand gradient + pulse), no categories. Cleaner,
       compact stat tile that shares ST_L's visual recipe so the section
       reads with one voice. */
    const ST_D = () => {
      const VB_W = 120, VB_H = 48;
      const pts = [
        { x: 0,   y: 38 },
        { x: 56,  y: 8  },
        { x: 108, y: 22, current: true },
      ];
      const linePath = `M${pts[0].x} ${pts[0].y} ` + pts.slice(1).map((p, i) => {
        const prev = pts[i];
        return `C${prev.x + 22} ${prev.y} ${p.x - 22} ${p.y} ${p.x} ${p.y}`;
      }).join(' ');
      const cur = pts.find(p => p.current);
      return (
        <PagePad>
          <div style={{
            background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER,
            borderRadius: 16, padding: 20,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 16,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={T.caption}>May spends</div>
                <div style={{
                  ...T.h3, color: 'rgba(0,0,0,0.9)', marginTop: 4,
                }}>₹18,400</div>
                <div style={{
                  ...T.caption, fontWeight: 500,
                  color: '#00A63E', marginTop: 8,
                }}>↓ 16% vs Apr</div>
              </div>
              <svg width={VB_W} height={VB_H} viewBox={`0 0 ${VB_W} ${VB_H}`}
                fill="none" style={{ flexShrink: 0 }}>
                <defs>
                  <linearGradient id="st_d_fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D30AD7" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#D30AD7" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="st_d_bloom"
                    x1={cur.x} y1={cur.y} x2={VB_W} y2={VB_H}
                    gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#D30AD7" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#D30AD7" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="st_d_stroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#D30AD7" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#D30AD7" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <path d={`${linePath} L${cur.x} ${VB_H} L${pts[0].x} ${VB_H} Z`}
                  fill="url(#st_d_fill)" />
                <path
                  d={`M${cur.x} ${cur.y} C${cur.x + 4} ${cur.y + 6} ${VB_W - 2} ${VB_H * 0.55} ${VB_W} ${VB_H} L${cur.x} ${VB_H} Z`}
                  fill="url(#st_d_bloom)" />
                <path d={linePath} stroke="url(#st_d_stroke)" strokeWidth="2.5"
                  fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={cur.x} cy={cur.y} r="4" fill="#D30AD7" />
                <circle cx={cur.x} cy={cur.y} r="2" fill="#FFFFFF" />
              </svg>
            </div>
          </div>
        </PagePad>
      );
    };

    /* E — Bar chart only (cashback/interest stripped per latest direction) */
    const ST_E = () => (
      <>
        <PagePad>
          <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ ...T.btnSm, color: 'rgba(0,0,0,0.5)' }}>May spends</div>
                <div style={{ ...T.display, marginTop: 4 }}>₹12,487</div>
              </div>
              <TagSubtle intent="positive">↓ 18% vs Apr</TagSubtle>
            </div>
            <SpendBarChart />
          </div>
        </PagePad>
      </>
    );

    /* F — Premium In-card Header Variant */
    const ST_F = ({ isInCard }) => (
      <PagePad>
        <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 24 }}>
          {isInCard && <InCardHeader title="Analytics" icon={<GlyphChart color="#D30AD7" />} />}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ ...T.btnSm, color: 'rgba(0,0,0,0.5)' }}>May spends</div>
              <div style={{ ...T.display, marginTop: 4 }}>₹12,487</div>
            </div>
            <TagSubtle intent="positive">↓ 18% vs Apr</TagSubtle>
          </div>
          <SpendBarChart />
        </div>
      </PagePad>
    );

    /* ST_G — Quiet 3-month spends sparkline.
       Visual element, not a full chart: smooth curve with a soft fill, pulse on
       the current month. Header carries the headline + delta — no axis labels,
       no per-point amounts, no legend. */
    const ST_G = () => {
      const VB_W = 312, VB_H = 80;
      const months = [
        { x: 0,   y: 56 },
        { x: 140, y: 18 },
        { x: 280, y: 36, current: true },
      ];
      const path = `M${months[0].x} ${months[0].y} ` + months.slice(1).map((p, i) => {
        const prev = months[i];
        const c1x = prev.x + 40, c1y = prev.y;
        const c2x = p.x - 40, c2y = p.y;
        return `C${c1x} ${c1y} ${c2x} ${c2y} ${p.x} ${p.y}`;
      }).join(' ');
      const current = months.find(m => m.current);

      return (
        <PagePad>
          <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 20, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ ...T.btnSm, color: 'rgba(0,0,0,0.5)' }}>May spends</div>
                <div style={{ fontFamily: 'Rubik', fontSize: 28, fontWeight: 500, lineHeight: '32px', letterSpacing: '-0.2px', color: 'rgba(0,0,0,0.9)', marginTop: 4 }}>₹18,400</div>
              </div>
              <span style={{
                ...T.caption, fontWeight: 500,
                color: '#00A63E', background: '#E0F4E8',
                padding: '3px 8px', borderRadius: 100, whiteSpace: 'nowrap',
              }}>↓ 16% vs Apr</span>
            </div>
            {/* Negative side margins so the curve bleeds to the card's outer edges */}
            <div style={{ position: 'relative', marginTop: 16, marginLeft: -20, marginRight: -20, marginBottom: -20, height: VB_H }}>
              <svg width="100%" height={VB_H} viewBox={`0 0 ${VB_W} ${VB_H}`} fill="none" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="st_g_fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D30AD7" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#D30AD7" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`${path} L${months[months.length-1].x} ${VB_H} L${months[0].x} ${VB_H} Z`} fill="url(#st_g_fill)" />
                <path d={path} stroke="#D30AD7" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={current.x} cy={current.y} r="11" fill="rgba(211,10,215,0.18)" />
                <circle cx={current.x} cy={current.y} r="5" fill="#D30AD7" />
              </svg>
            </div>
          </div>
        </PagePad>
      );
    };

    /* ST_I — Card-style spends. Same 3-month curve as ST_G but with the
       smaller Rewards-card typography (T.caption + T.h3) and an inline
       "↓ 16% vs Apr" delta tag. */
    const ST_I = () => {
      const VB_W = 312, VB_H = 80;
      const months = [
        { x: 0,   y: 56 },
        { x: 140, y: 18 },
        { x: 280, y: 36, current: true },
      ];
      const path = `M${months[0].x} ${months[0].y} ` + months.slice(1).map((p, i) => {
        const prev = months[i];
        const c1x = prev.x + 40, c1y = prev.y;
        const c2x = p.x - 40, c2y = p.y;
        return `C${c1x} ${c1y} ${c2x} ${c2y} ${p.x} ${p.y}`;
      }).join(' ');
      const current = months.find(m => m.current);
      return (
        <PagePad>
          <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 16, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={T.caption}>May spends</div>
                <div style={{ ...T.h3, marginTop: 4 }}>₹18,400</div>
              </div>
              <span style={{
                ...T.caption, fontWeight: 500,
                color: '#00A63E', background: '#E0F4E8',
                padding: '3px 8px', borderRadius: 100, whiteSpace: 'nowrap',
              }}>↓ 16% vs Apr</span>
            </div>
            <div style={{ position: 'relative', marginTop: 16, marginLeft: -16, marginRight: -16, marginBottom: -16, height: VB_H }}>
              <svg width="100%" height={VB_H} viewBox={`0 0 ${VB_W} ${VB_H}`} fill="none" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="st_i_fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D30AD7" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#D30AD7" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`${path} L${months[months.length-1].x} ${VB_H} L${months[0].x} ${VB_H} Z`} fill="url(#st_i_fill)" />
                <path d={path} stroke="#D30AD7" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={current.x} cy={current.y} r="11" fill="rgba(211,10,215,0.18)" />
                <circle cx={current.x} cy={current.y} r="5" fill="#D30AD7" />
              </svg>
            </div>
          </div>
        </PagePad>
      );
    };

    /* Top categories driving total May spends. Used by ST_K and the
       Analytics page so the two surfaces tell a consistent story.
       Sub copy (transaction count) intentionally omitted — PM call to
       reduce noise; only label + amount matter at the glance scale. */
    const SPEND_CATEGORIES = [
      { label: 'Food & drinks', amount: '₹4,820', icon: 'cat_food.png' },
      { label: 'Shopping',      amount: '₹3,140', icon: 'cat_shopping.png' },
      { label: 'Travel',        amount: '₹2,860', icon: 'cat_travel.png' },
    ];

    /* ST_K — Same compact top-section as ST_I (caption "May spends" + H3
       amount + inline green delta chip), the ST_I/ST_G sparkline curve
       (3-month, with the current-month dot), and a categories list
       below — no heading, no per-row sub copy. PM call: at this scale
       only "what was it" and "how much" matter. */
    const ST_K = () => {
      const VB_W = 312, VB_H = 80;
      const months = [
        { x: 0,   y: 56 },
        { x: 140, y: 18 },
        { x: 280, y: 36, current: true },
      ];
      const path = `M${months[0].x} ${months[0].y} ` + months.slice(1).map((p, i) => {
        const prev = months[i];
        const c1x = prev.x + 40, c1y = prev.y;
        const c2x = p.x - 40, c2y = p.y;
        return `C${c1x} ${c1y} ${c2x} ${c2y} ${p.x} ${p.y}`;
      }).join(' ');
      const current = months.find(m => m.current);
      return (
        <PagePad>
          <div style={{
            background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER,
            borderRadius: 16, padding: 20, overflow: 'hidden',
          }}>
            {/* Header — top-left element copied from ST_G: T.btnSm caption
                + 28px Rubik medium amount. Larger headline than ST_I,
                tighter than ST_A's full display. */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ ...T.btnSm, color: 'rgba(0,0,0,0.5)' }}>May spends</div>
                <div style={{
                  fontFamily: 'Rubik', fontSize: 28, fontWeight: 500,
                  lineHeight: '32px', letterSpacing: '-0.2px',
                  color: 'rgba(0,0,0,0.9)', marginTop: 4,
                }}>₹18,400</div>
              </div>
              <span style={{
                ...T.caption, fontWeight: 500,
                color: '#00A63E', background: '#E0F4E8',
                padding: '3px 8px', borderRadius: 100, whiteSpace: 'nowrap',
              }}>↓ 16% vs Apr</span>
            </div>
            {/* Sparkline — full-bleed inside the card. Split into two fills:
                the area under the line (up to the pulse) uses a vertical
                fade, and the post-pulse bloom uses a diagonal fade so the
                gradient softens to transparent both DOWN and RIGHT —
                reading like a mesh bloom around the current month rather
                than a hard slab to the right edge. */}
            <div style={{ position: 'relative', marginTop: 16, marginLeft: -20, marginRight: -20, height: VB_H }}>
              <svg width="100%" height={VB_H} viewBox={`0 0 ${VB_W} ${VB_H}`} fill="none" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="st_k_fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D30AD7" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#D30AD7" stopOpacity="0" />
                  </linearGradient>
                  {/* Diagonal fade anchored at the pulse — fades to
                      transparent toward the bottom-right corner so the
                      bloom tapers both right AND down. userSpaceOnUse
                      keeps the anchor at the pulse coords. */}
                  <linearGradient id="st_k_bloom"
                    x1={current.x} y1={current.y}
                    x2={VB_W} y2={VB_H}
                    gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#D30AD7" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#D30AD7" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Fill under the line up to the pulse — vertical fade. */}
                <path
                  d={`${path} L${current.x} ${VB_H} L${months[0].x} ${VB_H} Z`}
                  fill="url(#st_k_fill)" />
                {/* Post-pulse bloom — fades diagonally to bottom-right. */}
                <path
                  d={`M${current.x} ${current.y} C${current.x + 28} ${current.y - 4} ${VB_W - 4} ${VB_H * 0.5} ${VB_W} ${VB_H} L${current.x} ${VB_H} Z`}
                  fill="url(#st_k_bloom)" />
                <path d={path} stroke="#D30AD7" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={current.x} cy={current.y} r="11" fill="rgba(211,10,215,0.18)" />
                <circle cx={current.x} cy={current.y} r="5" fill="#D30AD7" />
              </svg>
            </div>
            {/* Categories — no heading, no hairline, label + amount only. */}
            <div style={{
              marginTop: 20,
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              {SPEND_CATEGORIES.map(c => (
                <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={`/assets/${c.icon}`} width={40} height={40} alt=""
                    style={{ display: 'block', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0, ...T.bodySm, fontWeight: 500, color: 'rgba(0,0,0,0.9)' }}>{c.label}</div>
                  <div style={{ ...T.bodySm, fontWeight: 500 }}>{c.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </PagePad>
      );
    };

    /* ST_L — Inline-graph header + category list.
       Top section mirrors ST_D's layout (info left, sparkline right)
       but the sparkline itself is upgraded from a flat 5-segment poly
       to a smooth-bezier curve over 3 months with a current-month pulse
       and a softer, diagonally-fading fill. Below: the same SPEND_CATEGORIES
       list ST_K uses, so the card balances at-a-glance trend with where
       the money actually went. */
    const ST_L = () => {
      /* Sparkline viewBox sized for the right-aligned slot. Data points
         mirror ST_K (Mar low → Apr high → May mid-current) so the
         narrative reads the same across variants. */
      const VB_W = 120, VB_H = 48;
      /* Pulse pulled in from x=120 to x=108 so the r=9 halo doesn't
         clip against the card edge. The post-pulse bloom still tapers
         out to the right corner. */
      const pts = [
        { x: 0,   y: 38 },
        { x: 56,  y: 8  },
        { x: 108, y: 22, current: true },
      ];
      const linePath = `M${pts[0].x} ${pts[0].y} ` + pts.slice(1).map((p, i) => {
        const prev = pts[i];
        const c1x = prev.x + 22, c1y = prev.y;
        const c2x = p.x - 22, c2y = p.y;
        return `C${c1x} ${c1y} ${c2x} ${c2y} ${p.x} ${p.y}`;
      }).join(' ');
      const cur = pts.find(p => p.current);
      return (
        <PagePad>
          <div style={{
            background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER,
            borderRadius: 16, padding: 20,
          }}>
            {/* Header — matches ST_D's split layout: caption + amount + delta
                on the left, sparkline pinned right. */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 16,
            }}>
              {/* 3-label text stack — caption, featured amount, colored
                  delta. Shared recipe with ST_D so the section reads with
                  one voice across variants. */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...T.btnSm, color: 'rgba(0,0,0,0.5)' }}>May spends</div>
                <div style={{
                  fontFamily: 'Rubik', fontSize: 28, fontWeight: 500,
                  lineHeight: '32px', letterSpacing: '-0.2px',
                  color: 'rgba(0,0,0,0.9)', marginTop: 4,
                }}>₹18,400</div>
                <div style={{
                  ...T.caption, fontWeight: 500,
                  color: '#00A63E', marginTop: 6,
                }}>↓ 16% vs Apr</div>
              </div>
              {/* Improved sparkline — smooth bezier, soft diagonal-fade fill,
                  pulse on the current month. */}
              <svg width={VB_W} height={VB_H} viewBox={`0 0 ${VB_W} ${VB_H}`}
                fill="none" style={{ flexShrink: 0 }}>
                <defs>
                  <linearGradient id="st_l_fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D30AD7" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#D30AD7" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="st_l_bloom"
                    x1={cur.x} y1={cur.y}
                    x2={VB_W} y2={VB_H}
                    gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#D30AD7" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#D30AD7" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="st_l_stroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#D30AD7" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#D30AD7" stopOpacity="1" />
                  </linearGradient>
                </defs>
                {/* Fill under the line up to the pulse. */}
                <path
                  d={`${linePath} L${cur.x} ${VB_H} L${pts[0].x} ${VB_H} Z`}
                  fill="url(#st_l_fill)" />
                {/* Post-pulse bloom — fades diagonally toward bottom-right. */}
                <path
                  d={`M${cur.x} ${cur.y} C${cur.x + 4} ${cur.y + 6} ${VB_W - 2} ${VB_H * 0.55} ${VB_W} ${VB_H} L${cur.x} ${VB_H} Z`}
                  fill="url(#st_l_bloom)" />
                {/* Line + pulse: brand stroke gets a subtle horizontal
                    gradient so the right side (current) is fully saturated. */}
                <path d={linePath} stroke="url(#st_l_stroke)" strokeWidth="2.5"
                  fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={cur.x} cy={cur.y} r="4" fill="#D30AD7" />
                <circle cx={cur.x} cy={cur.y} r="2" fill="#FFFFFF" />
              </svg>
            </div>
            {/* Hairline divider — separates the at-a-glance trend block
                from the where-the-money-went list. DLS Outline/Subtle. */}
            <div style={{
              height: 1, background: 'rgba(0,0,0,0.05)',
              marginTop: 20,
            }} />
            {/* Categories — same list as ST_K. */}
            <div style={{
              marginTop: 20,
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              {SPEND_CATEGORIES.map(c => (
                <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={`/assets/${c.icon}`} width={40} height={40} alt=""
                    style={{ display: 'block', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0, ...T.bodySm, fontWeight: 500, color: 'rgba(0,0,0,0.9)' }}>{c.label}</div>
                  <div style={{ ...T.bodySm, fontWeight: 500 }}>{c.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </PagePad>
      );
    };

    /* ST_M — Variant of ST_L where the top-of-card amount drops from the
       hero 28px down to T.h4 (16px) so its weight matches the category
       rows below. Same sparkline, same layout, quieter header. Useful
       when Stats sits alongside other section cards (Bills, Rewards)
       whose headers are all 16px — keeps the page's type rhythm even. */
    const ST_M = () => {
      const VB_W = 120, VB_H = 48;
      const pts = [
        { x: 0,   y: 38 },
        { x: 56,  y: 8  },
        { x: 108, y: 22, current: true },
      ];
      const linePath = `M${pts[0].x} ${pts[0].y} ` + pts.slice(1).map((p, i) => {
        const prev = pts[i];
        return `C${prev.x + 22} ${prev.y} ${p.x - 22} ${p.y} ${p.x} ${p.y}`;
      }).join(' ');
      const cur = pts.find(p => p.current);
      return (
        <PagePad>
          <div style={{
            background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER,
            borderRadius: 16, padding: 20,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 16,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={T.caption}>May spends</div>
                <div style={{
                  ...T.h3, color: 'rgba(0,0,0,0.9)', marginTop: 4,
                }}>₹18,400</div>
                <div style={{
                  ...T.caption, fontWeight: 500,
                  color: '#00A63E', marginTop: 6,
                }}>↓ 16% vs Apr</div>
              </div>
              <svg width={VB_W} height={VB_H} viewBox={`0 0 ${VB_W} ${VB_H}`}
                fill="none" style={{ flexShrink: 0 }}>
                <defs>
                  <linearGradient id="st_m_fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D30AD7" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#D30AD7" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="st_m_bloom"
                    x1={cur.x} y1={cur.y}
                    x2={VB_W} y2={VB_H}
                    gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#D30AD7" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#D30AD7" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="st_m_stroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#D30AD7" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#D30AD7" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <path
                  d={`${linePath} L${cur.x} ${VB_H} L${pts[0].x} ${VB_H} Z`}
                  fill="url(#st_m_fill)" />
                <path
                  d={`M${cur.x} ${cur.y} C${cur.x + 4} ${cur.y + 6} ${VB_W - 2} ${VB_H * 0.55} ${VB_W} ${VB_H} L${cur.x} ${VB_H} Z`}
                  fill="url(#st_m_bloom)" />
                <path d={linePath} stroke="url(#st_m_stroke)" strokeWidth="2.5"
                  fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={cur.x} cy={cur.y} r="4" fill="#D30AD7" />
                <circle cx={cur.x} cy={cur.y} r="2" fill="#FFFFFF" />
              </svg>
            </div>
            <div style={{
              height: 1, background: 'rgba(0,0,0,0.05)',
              marginTop: 20,
            }} />
            <div style={{
              marginTop: 20,
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              {SPEND_CATEGORIES.map(c => (
                <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={`/assets/${c.icon}`} width={40} height={40} alt=""
                    style={{ display: 'block', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0, ...T.bodySm, fontWeight: 500, color: 'rgba(0,0,0,0.9)' }}>{c.label}</div>
                  <div style={{ ...T.bodySm, fontWeight: 500 }}>{c.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </PagePad>
      );
    };

    /* ST_N — ST_M header (matched-scale amount + sparkline) on top, with
       insight statements below instead of a category breakdown. Each
       insight = small tinted avatar + 2-line copy (headline + supporting
       caption). Speaks the "what does this mean for you" angle of the
       month's spends, complementing the ST_M/ST_L "where did it go" cut. */
    /* ST_N renders a single hero insight under the spend header — one
       punchy "what does this mean for you" line. Single-line + small
       glyph so it sits beneath the sparkline as a quiet observation
       rather than a second weighty block fighting the graph. */
    const SPEND_INSIGHT = {
      glyph: <GlyphChart color="#00A63E" />,
      text: 'Lightest spend month since February',
    };
    const ST_N = () => {
      const VB_W = 120, VB_H = 48;
      const pts = [
        { x: 0,   y: 38 },
        { x: 56,  y: 8  },
        { x: 108, y: 22, current: true },
      ];
      const linePath = `M${pts[0].x} ${pts[0].y} ` + pts.slice(1).map((p, i) => {
        const prev = pts[i];
        return `C${prev.x + 22} ${prev.y} ${p.x - 22} ${p.y} ${p.x} ${p.y}`;
      }).join(' ');
      const cur = pts.find(p => p.current);
      /* All spacing values lock to the DLS scale:
         2XS=4, XS=8, S=12, M=16, L=24. Card padding = L (24, DLS card
         internal). Inset divider extends past card padding via negative
         margins of -L. */
      return (
        <PagePad>
          <div style={{
            background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER,
            borderRadius: 16, padding: 20,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 16,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={T.caption}>May spends</div>
                <div style={{
                  ...T.h3, color: 'rgba(0,0,0,0.9)', marginTop: 4,
                }}>₹18,400</div>
                <div style={{
                  ...T.caption, fontWeight: 500,
                  color: '#00A63E', marginTop: 8,
                }}>↓ 16% vs Apr</div>
              </div>
              <svg width={VB_W} height={VB_H} viewBox={`0 0 ${VB_W} ${VB_H}`}
                fill="none" style={{ flexShrink: 0 }}>
                <defs>
                  <linearGradient id="st_n_fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D30AD7" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#D30AD7" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="st_n_bloom"
                    x1={cur.x} y1={cur.y}
                    x2={VB_W} y2={VB_H}
                    gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#D30AD7" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#D30AD7" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="st_n_stroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#D30AD7" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#D30AD7" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <path
                  d={`${linePath} L${cur.x} ${VB_H} L${pts[0].x} ${VB_H} Z`}
                  fill="url(#st_n_fill)" />
                <path
                  d={`M${cur.x} ${cur.y} C${cur.x + 4} ${cur.y + 6} ${VB_W - 2} ${VB_H * 0.55} ${VB_W} ${VB_H} L${cur.x} ${VB_H} Z`}
                  fill="url(#st_n_bloom)" />
                <path d={linePath} stroke="url(#st_n_stroke)" strokeWidth="2.5"
                  fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={cur.x} cy={cur.y} r="4" fill="#D30AD7" />
                <circle cx={cur.x} cy={cur.y} r="2" fill="#FFFFFF" />
              </svg>
            </div>
            {/* Hairline above the insight row — inset within the
                card padding (no negative side margins) so it reads
                as a contained divider rather than a full-bleed cut.
                Card padding 24 + this 20 gap → insight = clear
                breathing space below the divider. */}
            <div style={{
              height: 1, background: 'rgba(0,0,0,0.05)',
              marginTop: 20,
            }} />
            {/* Insight row — bare glyph (no tinted Avatar circle) on
                the left, T.caption text on the right. The icon alone
                is enough signal; the avatar bg was redundant chrome. */}
            <div style={{
              marginTop: 20,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{
                display: 'inline-flex', width: 20, height: 20,
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <GlyphChart color="#00A63E" />
              </span>
              <div style={{ flex: 1, minWidth: 0, ...T.caption, color: 'rgba(0,0,0,0.7)' }}>
                {SPEND_INSIGHT.text}
              </div>
            </div>
          </div>
        </PagePad>
      );
    };

    const StatsSection = ({ variant, isInCard }) => {
      const C = { B: ST_B, C: ST_C, D: ST_D, E: ST_E, F: ST_F, G: ST_G, K: ST_K, L: ST_L, M: ST_M, N: ST_N }[variant];
      /* Whole stats card is a tap target. AnalyticsPage was removed —
         no navigation, just visual tap state via the .tap CSS class
         (scale 0.97 + opacity 0.9 on :active). */
      return (
        <div className="tap" style={{ cursor: 'pointer' }}>
          <C isInCard={isInCard} />
        </div>
      );
    };

    /* ----- More: VAS landing zone. Phase-1 content: AutoPay + CIBIL.
       Future products (insurance, gift cards) launch here before graduating
       into their own section. ----- */

    /* A — Two small cards using the same ExploreMedium spec as the Rewards row:
       caption subtext + H4 title + 52×52 icon pinned bottom-right. */
    const MR_A = () => (
      <PagePad>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <ExploreMedium subtext="Autopay" title="3 active"
            icon={
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                {['brand_a.png', 'brand_b.png', 'brand_c.png'].map((b, i) => (
                  <img key={b} src={`/assets/${b}`} alt="" style={{
                    width: 36, height: 36, borderRadius: 18,
                    border: '2px solid #FFFFFF', objectFit: 'cover',
                    marginLeft: i > 0 ? -10 : 0,
                  }} />
                ))}
              </div>
            } />
          <ExploreMedium subtext="Credit score" title="778"
            icon={<img src="/assets/credit_score_icon.png" width={52} height={52} alt="" style={{ display: 'block' }} />} />
        </div>
        <div style={{ marginTop: 16 }}>
          <ExploreMedium subtext="Insurance · 1 plan active" title="Premium due 12 Jul"
            icon={<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#2B6ACF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3z" /></svg>} />
        </div>
      </PagePad>
    );

    /* Shared list rows for the title-type More variants. Each entry has
       just a title + value — no descriptions, no chevrons, no avatars in
       the plain variants. Variants differ in row treatment. The data is
       enriched with subtitle + glyph + intent + asset so each variant can
       pull just the fields it needs. */
    const MR_LIST_ITEMS = [
      { label: 'AutoPay',     value: 'Active',   intent: 'positive', subtitle: '3 active',           iconAsset: 'autopay_icon.png',      glyph: <GlyphBolt color="#2B6ACF" />, bg: '#E6EDF9' },
      { label: 'CIBIL score', value: '785',      intent: 'info',     subtitle: 'updated 2 days ago', iconAsset: 'credit_score_icon.png', glyph: <GlyphChart color="#00A63E" />, bg: '#E0F4E8' },
    ];

    /* Shared edge-to-edge row primitive. Slice uses these at the bottom of
       L1 screens — no card wrapper, hairline divider between rows, page
       horizontal padding handled by PagePad. Children render the row's
       content; the wrapper handles padding, the hairline, and tap state.
       `dividerInset`: when set, the row's top hairline starts at that
       left offset (in px) instead of full-bleed — used by MR_D to align
       the divider with the label, past the avatar. */
    const MoreRow = ({ children, isFirst, dividerInset = 0 }) => (
      <div style={{ position: 'relative' }}>
        {!isFirst && (
          <div aria-hidden style={{
            position: 'absolute', top: 0, left: dividerInset, right: 0,
            height: 1, background: 'rgba(0,0,0,0.05)',
          }} />
        )}
        <button className="tap" style={{
          width: '100%', padding: '16px 0',
          background: 'transparent', border: 'none',
          display: 'flex', alignItems: 'center', gap: 12,
          cursor: 'pointer', textAlign: 'left',
        }}>
          {children}
        </button>
      </div>
    );

    /* MR_B — Edge-to-edge title + value list. No card wrapper, no avatar.
       Mirrors slice's L1-bottom list pattern (e.g. the bottom of Spend
       insights, Card controls). Title left, value right, hairlines only
       between rows. Extra 12px horizontal margin inside PagePad so the
       list inset reads stronger than a tight L1 list. */
    const MR_B = () => (
      <PagePad>
        <div style={{ paddingLeft: 12, paddingRight: 12 }}>
          {MR_LIST_ITEMS.map((row, i) => (
            <MoreRow key={row.label} isFirst={i === 0}>
              <span style={{ ...T.body, color: 'rgba(0,0,0,0.9)', flex: 1, minWidth: 0 }}>{row.label}</span>
              <span style={{ ...T.btnSm, color: 'rgba(0,0,0,0.5)' }}>{row.value}</span>
            </MoreRow>
          ))}
        </div>
      </PagePad>
    );

    /* MR_D — Edge-to-edge list with leading 32px Avatar (tinted bg + glyph).
       Adds category colour cue without wrapping the rows in a card. Extra
       12px horizontal margin matches MR_B; divider is inset by avatar +
       gap (32 + 12 = 44) so the hairline aligns with the label text. */
    const MR_D = () => (
      <PagePad>
        {MR_LIST_ITEMS.map((row, i) => (
          <MoreRow key={row.label} isFirst={i === 0} dividerInset={44}>
            <Avatar size={32} bg={row.bg} glyph={row.glyph} />
            <span style={{ ...T.body, color: 'rgba(0,0,0,0.9)', flex: 1, minWidth: 0 }}>{row.label}</span>
            <span style={{ ...T.btnSm, color: 'rgba(0,0,0,0.5)' }}>{row.value}</span>
          </MoreRow>
        ))}
      </PagePad>
    );

    const MoreSection = ({ variant, isInCard }) => {
      const C = { A: MR_A, B: MR_B, D: MR_D }[variant] || MR_A;
      return <C isInCard={isInCard} />;
    };

    /* ============= V0 — Exact replica of the live Explore page (bypasses section system) ============= */

    const OriginalExplore = () => (
      <ScreenShell>
        <PagePad>
          <div style={{ height: 16 }} />
          <BillsCompositeCard />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
            <ExploreMedium subtext="Play & win" title="5 fires"
              icon={<img src="/assets/fire_sparkle.png" width={52} height={52} alt="" style={{ display: 'block' }} />} />
            <ExploreMedium subtext="May spends" title="₹12,487"
              icon={<img src="/assets/may_spends.png" width={54} height={54} alt="" style={{ display: 'block' }} />} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
            <ExploreMedium subtext="Invite & earn" title="Get ₹150"
              icon={<img src="/assets/invite_magnet.png" width={54} height={54} alt="" style={{ display: 'block' }} />} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <ExploreSmall subtext="Credit score" title="785" />
              <ExploreSmall subtext="Autopay" title="1 active" />
            </div>
          </div>
        </PagePad>
      </ScreenShell>
    );

    /* ============= EXPLORE PAGE ============= */

    /* Zero-height marker before each section — used as the scroll target when the picker
       changes that section's variant, so the user lands on the thing they just edited. */
    const SectionAnchor = ({ id }) => <div data-section={id} style={{ height: 0 }} />;

    /* Wraps a section so it can be lifted (z-index + glow) when it's the one being edited.
       Result: while the user explores variants the affected section visually pops above the rest. */
    const SectionBlock = ({ id, active, children }) => (
      <div className={'section-block' + (active ? ' active' : '')}
        data-section-block={id}>
        {children}
      </div>
    );

    const ExplorePage = ({ sections, headerStyle, activeSection, separateMore, autoScroll, onScrollPast }) => {
      const isInCard = headerStyle === 'None';
      const isActive = (k) => activeSection === k;
      const isGradientFY = sections.forYou === 'D' || sections.forYou === 'E' || sections.forYou === 'F' || sections.forYou === 'J' || sections.forYou === 'L' || sections.forYou === 'M' || sections.forYou === 'N' || sections.forYou === 'O' || sections.forYou === 'P';
      /* I, K (card-stack engine + glass material) and H (single hero
         card) all finish flush against the next section, so downstream
         spacers need the same 28px gap before Bills. */
      const isUtilityFY = sections.forYou === 'I' || sections.forYou === 'K' || sections.forYou === 'H';
      /* FY=J + aiBanker=F combo: hide paginator dots because the AI search
         pill overlaps the carousel's bottom — the pill IS the visual anchor. */
      /* FY_J's carousel grows taller + hides paginator whenever something
         OVERLAPS its bottom edge — either the AB_F search pill (when AI
         banker is on) or the BL_J floating bills card (when AI banker is
         off). Same anchor mechanic either way. */
      /* Which element overlaps the FY_J carousel bottom edge. 'ab' = AB_F
         search pill (smaller bump); 'bills' = BL_J floating bills card
         (full bump). 'none' = no overlap → standard carousel. Drives
         FY_J's MIN_H + TEXT_BOTTOM. */
      const fyOverlap =
        sections.forYou === 'J' && sections.aiBanker === 'F' ? 'ab'
        : sections.forYou === 'J' && sections.aiBanker === 'None' && sections.bills === 'J' ? 'bills'
        : 'none';
      /* Kiosk sheet — when FY_L (image hero) is active, wrap all
         sections below it in a rounded-top white sheet that overlaps
         the bottom of the hero. Softens the hard cut between the dark
         poster and the rest of the page; reads like content sliding
         in from beneath a kiosk header. */
      const KioskWrap = sections.forYou === 'L'
        ? ({ children }) => (
            <div style={{
              position: 'relative', zIndex: 2,
              marginTop: -28,
              background: '#FFFFFF',
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              /* Tighter top inset — was 28, felt like a big dead zone
                 between the kiosk edge and the first section header. */
              paddingTop: 12,
              boxShadow: '0 -8px 24px rgba(0,0,0,0.10)',
            }}>{children}</div>
          )
        : React.Fragment;
      return (
        <ScreenShell transparentAppBar={isGradientFY} darkBg={sections.forYou === 'L' || sections.forYou === 'F' || sections.forYou === 'N'}
          /* App-bar fill + status-bar colour flip kick in when the
             kiosk's rounded TOP edge reaches the app-bar bottom
             (viewport Y=118). At scrollTop=0 the kiosk top sits at
             viewport Y = 118 + (hero flow 210 − 28 kiosk margin) = 300.
             So the threshold is 300 − 118 = 182. (Earlier 64 was a
             flow/viewport-coord mix-up that fired the flip way too
             early.) */
          scrollThreshold={sections.forYou === 'L' ? 182 : (sections.forYou === 'N' || sections.forYou === 'F') ? 120 : 0}
          onPastThreshold={onScrollPast}>
          {sections.forYou !== 'None' && (
            <>
              <SectionAnchor id="forYou" />
              {sections.forYou === 'L' ? (
                /* Bypass SectionBlock for L so the FY_L hero's
                   position: sticky containing block becomes the
                   scroll container (.screen-scroll) instead of a
                   short SectionBlock — only then does sticky pin
                   the hero through the entire page scroll. */
                <ForYouSection variant={sections.forYou} autoScroll={autoScroll} fyOverlap={fyOverlap} />
              ) : (
                <SectionBlock id="forYou" active={isActive('forYou')}>
                  <SectionWrap title="For you" headerStyle="None" isFirst>
                    <ForYouSection variant={sections.forYou} autoScroll={autoScroll} fyOverlap={fyOverlap} />
                  </SectionWrap>
                </SectionBlock>
              )}
            </>
          )}
          <KioskWrap>
          {/* Utility FY variants finish flush against the next section. Add
              clear vertical air so AI banker / Bills don't feel crammed.
              Only add this when AI banker is present — when AI banker is
              hidden, the single spacer before Bills handles the whole gap
              (otherwise it'd stack two 20s into 40). */}
          {isUtilityFY && sections.aiBanker !== 'None' && <Spacer h={20} />}
          {sections.aiBanker !== 'None' && (
            <>
              <SectionAnchor id="aiBanker" />
              <SectionBlock id="aiBanker" active={isActive('aiBanker')}>
                {/* Carousels A and F have dots inside (16px internal padding below
                    them); add another 12px so the dots-to-search-bar gap totals 28px.
                    B and V are card variants without dots — those already include their
                    own paddingBottom, so no extra spacer. */}
                {(isGradientFY || sections.forYou === 'None') && <Spacer h={16} />}
                <SectionWrap title="AI banker" headerStyle="None" isFirst>
                  <AiBankerSection variant={sections.aiBanker} />
                </SectionWrap>
              </SectionBlock>
            </>
          )}
          <SectionAnchor id="bills" />
          <SectionBlock id="bills" active={isActive('bills')}>
            {/* When For You = X (None) and headerStyle = List, suppress
               the Bills & Recharges heading — the section content speaks
               for itself when it's the first thing on screen. */}
            {(() => {
              const hideBillsHeader = sections.forYou === 'None' && headerStyle === 'List';
              const billsHeaderStyle = hideBillsHeader ? 'None' : headerStyle;
              const billsCta = sections.bills === 'L' ? 'View all' : undefined;
              const billsTag = (sections.bills === 'U' || sections.bills === 'W') ? '0% FEE' : undefined;
              if (sections.forYou === 'J' && sections.aiBanker === 'None' && sections.bills === 'J') {
                /* FY=J + AB=None + bills=J combo: render BL_J flush against
                   the carousel with NO section header and NO inter-section
                   spacer. BL_J's own negative marginTop pulls the card so its
                   vertical center lands on the carousel's hard bottom edge. */
                return <BillsSection variant={sections.bills} isInCard={isInCard} />;
              }
              if (sections.aiBanker === 'None' || sections.forYou === 'L') {
                let h = 4;
                if (hideBillsHeader) h = 12;
                else if (isUtilityFY) h = 28;
                else if (sections.forYou === 'L') h = 24;
                else if (sections.forYou === 'F' || sections.forYou === 'P') h = 0;
                else if (sections.forYou === 'N') h = 16;
                else if (sections.forYou === 'Q' || sections.forYou === 'U' || sections.forYou === 'T') h = 28;
                else if (isGradientFY) h = 32;
                return (
                  <>
                    <Spacer h={h} />
                    <SectionWrap title="Bills & Recharges" cta={billsCta} tag={billsTag} headerStyle={billsHeaderStyle} isFirst>
                      <BillsSection variant={sections.bills} isInCard={isInCard} />
                      {headerStyle === 'Bold' && <Spacer h={8} />}
                      {headerStyle === 'List' && !hideBillsHeader && <Spacer h={4} />}
                    </SectionWrap>
                  </>
                );
              }
              return (
                <SectionWrap title="Bills & Recharges" cta={billsCta} tag={billsTag} headerStyle={billsHeaderStyle}>
                  <BillsSection variant={sections.bills} isInCard={isInCard} />
                  {headerStyle === 'Bold' && <Spacer h={8} />}
                  {headerStyle === 'List' && !hideBillsHeader && <Spacer h={4} />}
                </SectionWrap>
              );
            })()}
          </SectionBlock>
          <SectionAnchor id="rewards" />
          <SectionBlock id="rewards" active={isActive('rewards')}>
            {/* RW_S paints its own band-with-heading; force headerStyle
                to 'None' so the SectionWrap doesn't double-stamp a
                title above the band. The variant receives the user's
                actual headerStyle so it can mirror Bold/List inside the
                band. */}
            <SectionWrap title="Rewards & benefits"
              headerStyle={(sections.rewards === 'S' || sections.rewards === 'V') ? 'None' : headerStyle}>
              <RewardsSection variant={sections.rewards} isInCard={isInCard} headerStyle={headerStyle} />
            </SectionWrap>
            {sections.monies !== 'None' && (
              <>
                <Spacer h={20} />
                <SectionAnchor id="monies" />
                <MoniesSection variant={sections.monies} />
              </>
            )}
          </SectionBlock>
          <SectionAnchor id="stats" />
          <SectionBlock id="stats" active={isActive('stats')}>
            <SectionWrap title="Analytics" headerStyle={headerStyle}>
              <StatsSection variant={sections.stats} isInCard={isInCard} />
              {!separateMore && (
                <>
                  <Spacer h={isInCard ? 20 : 16} />
                  {/* Anchor + nested SectionBlock so a More-variant change still
                      gets the pulse highlight and a working scroll target even
                      when More is rendered inside the Stats section. */}
                  <SectionAnchor id="more" />
                  <SectionBlock id="more" active={isActive('more')}>
                    <MoreSection variant={sections.more} isInCard={isInCard} />
                  </SectionBlock>
                </>
              )}
            </SectionWrap>
          </SectionBlock>
          {separateMore && (
            <>
              <SectionAnchor id="more" />
              <SectionBlock id="more" active={isActive('more')}>
                <SectionWrap title="More" headerStyle={headerStyle}>
                  <MoreSection variant={sections.more} isInCard={isInCard} />
                </SectionWrap>
              </SectionBlock>
            </>
          )}
          {sections.footer !== 'None' && (
            <>
              <SectionAnchor id="footer" />
              <SectionBlock id="footer" active={isActive('footer')}>
                {/* Explicit 16px pre-section gap. Lets Invite & earn
                   sit closer to the previous section than the default
                   in-card rhythm (24). */}
                <Spacer h={16} />
                <SectionWrap title="" headerStyle="None" isFirst>
                  <FooterSection variant={sections.footer} />
                </SectionWrap>
              </SectionBlock>
            </>
          )}
          </KioskWrap>
        </ScreenShell>
      );
    };

    /* ----- Footer — invite-driven closer (Figma 9774:9628 match).
       Edge-to-edge band that is THE END of the page: its #F4F7FA background
       extends below the CTA to cover the area behind the floating bottom nav,
       so there's no further scroll content visible after it. ----- */
    const FT_A = () => (
      <div style={{
        background: '#F4F7FA', padding: '42px 0 200px', marginBottom: -200,
      }}>
        <div style={{ padding: '0 32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{
            fontFamily: 'Rubik', fontSize: 32, fontWeight: 500, lineHeight: '40px',
            color: '#929496',
          }}>
            Invite & earn up<br/>to ₹500
          </div>
          <div style={{
            marginTop: 8,
            fontFamily: 'Rubik', fontSize: 12, fontWeight: 400, lineHeight: '16px', letterSpacing: '0.24px',
            color: '#929496',
          }}>
            Win a fire per friend who joins slice.
          </div>
          <button className="tap" style={{
            marginTop: 24, height: 36, padding: '0 16px',
            background: '#D30AD7', border: 'none', borderRadius: 64,
            fontFamily: 'Rubik', fontSize: 14, fontWeight: 500, lineHeight: '20px', letterSpacing: '0.28px',
            color: '#FFFFFF', cursor: 'pointer',
          }}>Send link</button>
        </div>
      </div>
    );

    /* FT_B — Magnet card. White DLS card recipe (border + shadow + radius
       16). Big magnet illustration on the right anchors the visual; caption +
       h3 + sub copy stack on the left; a single Send link pill sits at the
       bottom-left under the copy. The magnet asset carries the brand idea
       ("pull friends in"); typography stays in stock DLS tokens. */
    const FT_B = () => (
      <PagePad>
        <button className="tap" style={{
          /* Same recipe as RW_O's row card: full-width horizontal
             bar, white DLS card chrome, padding 18/20, caption + H3
             on the left, 44×44 icon on the right. Keeps invite cards
             rhyming with the rewards-row pattern. */
          width: '100%', padding: '18px 20px',
          background: '#FFFFFF', border: CARD_BORDER, boxShadow: CARD_SHADOW,
          borderRadius: 16,
          textAlign: 'left', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...T.caption, color: 'rgba(0,0,0,0.5)' }}>Invite &amp; earn</div>
            <div style={{ ...T.h3, color: 'rgba(0,0,0,0.9)', marginTop: 2 }}>
              ₹500 per friend
            </div>
          </div>
          <img src="/assets/invite_magnet.png" width={44} height={44} alt="" aria-hidden
            style={{ display: 'block', flexShrink: 0, objectFit: 'contain' }} />
        </button>
      </PagePad>
    );

    /* FT_C — Brand-gradient hero. slice brand gradient (Valentino → Blue,
       per DLS) anchors the bottom of the page as a closer moment. Big H3
       headline in white, single line of supporting copy, magnet illustration
       on the right at hero scale. Full-width white pill CTA so the closer
       button reads as the strongest single tap on the page. */
    const FT_C = () => (
      <PagePad>
        <button className="tap" style={{
          width: '100%', padding: 24, borderRadius: 16,
          background: 'linear-gradient(135deg, #D30AD7 0%, #2B6ACF 100%)',
          border: 'none', boxShadow: CARD_SHADOW,
          textAlign: 'left', cursor: 'pointer', position: 'relative', overflow: 'hidden',
        }}>
          {/* Card itself is the tap target — no inner CTA pill. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...T.caption, color: 'rgba(255,255,255,0.7)' }}>Invite &amp; earn</div>
              <div style={{ ...T.h2, color: '#FFFFFF', marginTop: 4 }}>
                ₹500 per friend
              </div>
            </div>
            <img src="/assets/invite_magnet.png" alt="" aria-hidden style={{
              width: 80, height: 80, objectFit: 'contain', flexShrink: 0,
              filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.18))',
              display: 'block',
            }} />
          </div>
        </button>
      </PagePad>
    );

    /* FT_D — FT_B card recipe (row layout: caption + ₹500 H3 left,
       44×44 magnet right) PLUS a delight reveal: when the card scrolls
       into view, a small shake fires and a few gold coins rain down
       from the top edge. CSS-driven (animations defined in index.css),
       gated by IntersectionObserver so it only triggers once per
       mount. */
    const FT_D = () => {
      const ref = React.useRef(null);
      const [revealed, setRevealed] = React.useState(false);
      React.useEffect(() => {
        if (revealed) return;
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            obs.disconnect();
          }
        }, { threshold: 0.6, rootMargin: '0px 0px -120px 0px' });
        obs.observe(el);
        return () => obs.disconnect();
      }, [revealed]);
      const coinOffsets = [22, 56, 90, 132, 170, 208];
      const coinDelays  = [0,  90, 200, 320, 460, 600];
      return (
        <PagePad>
          <div ref={ref} style={{ position: 'relative' }}>
            {revealed && coinOffsets.map((left, i) => (
              <span key={i} aria-hidden className="ft-b-coin" style={{
                left,
                animationDelay: `${coinDelays[i]}ms`,
              }} />
            ))}
            <button className={'tap' + (revealed ? ' ft-b-shake' : '')} style={{
              width: '100%', padding: '18px 20px',
              background: '#FFFFFF', border: CARD_BORDER, boxShadow: CARD_SHADOW,
              borderRadius: 16,
              textAlign: 'left', cursor: 'pointer', position: 'relative',
              display: 'flex', alignItems: 'center', gap: 16,
              overflow: 'hidden',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...T.caption, color: 'rgba(0,0,0,0.5)' }}>Invite &amp; earn</div>
                <div style={{ ...T.h3, color: 'rgba(0,0,0,0.9)', marginTop: 2 }}>
                  ₹500 per friend
                </div>
              </div>
              <img src="/assets/invite_magnet.png" width={44} height={44} alt="" aria-hidden
                style={{ display: 'block', flexShrink: 0, objectFit: 'contain' }} />
            </button>
          </div>
        </PagePad>
      );
    };

    const FooterSection = ({ variant }) => ({ A: FT_A, B: FT_B, C: FT_C, D: FT_D }[variant] || FT_A)();

    /* ============= DEBUG PANEL ============= */

    /* Curated set — only the variants the designer has decided to keep are
       exposed in the picker. `archived` holds variants pulled from the
       active palette but still rendered if someone toggles "Show archived"
       in the editor drawer (or has a saved state that points to one). */
    const SECTION_META = [
      {
        key: 'forYou', label: 'For You', variants: {
          H: 'Single card', B: 'Horizontal strip',
          F: 'Centered carousel', N: 'Centered carousel · short',
          P: 'D layout · F bg + fade', T: 'White hero centered',
          L: 'Image hero carousel', Q: 'Image hero · card',
          U: 'Image hero · card · left',
          None: 'X',
        },
        archived: {
          M: 'Full-bleed · no CTA',
          O: 'Full-bleed · matched icon',
          J: 'Full-bleed · partitioned',
          C: 'Compact dark strip',
          E: 'Full-bleed · DLS avatar',
          G: 'Grid · 2 squares + banner',
          K: 'Card stack · liquid glass',
        },
      },
      {
        key: 'aiBanker', label: 'AI banker', variants: {
          A: 'Pill + BETA tag', C: 'Input + scroll pills', E: 'Pill + rolling examples',
          F: 'Floating search pill (overlap)', None: 'X'
        }
      },
      {
        key: 'bills', label: 'Bills & Recharges', variants: {
          C: 'Grid (outline avatars)', B: 'Grid in card',
          K: 'Card stack · shuffle', L: 'Card stack · view all',
          J: 'Floating card (overlap)', N: 'Grid + stack below',
          S: 'Grid + minimal stack', T: 'Grid in card + stack',
          U: 'Card · no pagination',
          W: 'Card · progress bar',
        },
        archived: {
          A: 'Grid',
        },
      },
      {
        key: 'monies', label: 'Monies', variants: {
          A: 'Label + amount + tag',
          B: 'Heading + subtitle + amount',
          C: 'Heading + subtitle + amount + chevron',
          D: 'Valentino gradient strip',
          None: 'X',
        },
      },
      {
        key: 'rewards', label: 'Rewards & Benefits', variants: {
          K: 'Triptych palette', G: 'Fire hero + 2 below', F: 'Featured Large + 2 Med',
          R: 'Fire+Spark · Monies banner',
          U: 'Portrait card carousel', X: 'Leaderboard · Monies subtitle',
        },
        archived: {
          O: 'Source breakdown',
          P: 'Featured · drops headline',
          Q: 'Spark hero · flat tiles',
          S: 'Tinted band',
          T: 'Inlined section card',
          V: 'Portrait carousel · tinted band',
          W: 'Poster grid · R layout',
        },
      },
      {
        key: 'stats', label: 'Statistics', variants: {
          L: 'Inline graph + categories', M: 'Inline graph · matched header', N: 'Inline graph · insights', D: 'Sparkline card',
        },
        archived: {
          K: 'Bar + top categories',
          G: 'Analytics widget',
        },
      },
      {
        key: 'more', label: 'More', variants: {
          A: 'Two big tiles',
          D: 'List · avatar + title + value',
        },
        archived: {
          B: 'List · title + value',
        },
      },
      {
        key: 'footer', label: 'Invite & earn', variants: {
          A: 'Invite closer', B: 'Brand gradient hero', None: 'X'
        },
        archived: {
          C: 'Tinted soft card',
          D: 'Brand · coin-drop reveal',
        },
      },
    ];

    /* Three header styles. "None" renders no section header above content — labels live inside cards instead. */
    const HEADER_STYLES = ['Bold', 'List', 'None'];
    const HEADER_LABELS = { 'Bold': 'Bold', 'List': 'List', 'None': 'In-card' };

    /* Current = live layout (renders OriginalExplore directly).
       Exploration = section-system experimentation surface. */
    const PRESETS = {
      V0: {
        label: 'Current',
        headerStyle: 'List',
        sections: { forYou: 'B', aiBanker: 'E', bills: 'B', rewards: 'F', monies: 'None', stats: 'A', more: 'A', footer: 'None' },
      },
      V1: {
        label: 'Exploration',
        headerStyle: 'List',
        sections: { forYou: 'U', aiBanker: 'None', bills: 'S', rewards: 'X', monies: 'A', stats: 'N', more: 'A', footer: 'None' },
      },
    };

    /* Preset match check (V0 is tracked via the useOriginal flag). */
    const matchesPreset = (presetKey, headerStyle, sections) => {
      const p = PRESETS[presetKey];
      if (!p) return false;
      if (p.headerStyle !== headerStyle) return false;
      return Object.keys(p.sections).every(k => p.sections[k] === sections[k]);
    };

    /* Curated set of spacing values exposed in the picker — keeps the UI tidy. */
    const SPACING_OPTIONS = {
      gapNone: [16, 24, 32, 40],
      gapHeaderAbove: [16, 24, 32, 40, 48],
      gapHeaderBelow: [8, 12, 16, 20, 24],
    };
    const SPACING_LABELS = {
      gapNone: 'Between sections (In-card)',
      gapHeaderAbove: 'Section gap (above header)',
      gapHeaderBelow: 'Header → content',
    };


    /* Reusable hairline divider for the panel — Outline/Subtle from DLS.
       Class-based so the dark drawer can swap to a white-alpha hairline. */
    const PanelDivider = ({ mb = 20, mt = 20 }) => (
      <div className="panel-divider" style={{
        marginTop: mt, marginBottom: mb,
      }} />
    );

    /* Reusable toggle row — meta caption left, DLS switch right. */
    const ToggleRow = ({ label, value, onChange }) => (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12,
      }}>
        <span style={{ ...T.meta }}>{label}</span>
        <button
          onClick={onChange}
          style={{
            width: 36, height: 20, borderRadius: 100, position: 'relative',
            background: value ? '#D30AD7' : 'rgba(0,0,0,0.15)',
            border: 'none', cursor: 'pointer', transition: 'background 160ms',
            flexShrink: 0,
          }}>
          <span style={{
            position: 'absolute', top: 2, left: value ? 18 : 2,
            width: 16, height: 16, borderRadius: 100, background: 'white',
            transition: 'left 160ms',
          }} />
        </button>
      </div>
    );

    /* Variant chip — uniform square key button (A/B/C/…). Styling lives
       in CSS (.var-key + .var-key.active) so the dark drawer can
       theme-switch the surface and label colour without React inline
       styles fighting CSS !important. */
    const VariantTile = ({ sectionKey, variantKey, label, isActive, onClick }) => {
      const display = variantKey === 'None' ? '×' : variantKey;
      return (
        <button
          onClick={onClick}
          title={label === 'X' ? 'Hidden' : label}
          className={'var-key' + (isActive ? ' active' : '')}>
          {display}
        </button>
      );
    };

    const DebugPanel = ({
      sections, headerStyle, useOriginal,
      onSectionChange, onHeaderChange, onPresetApply,
      spacing, highlight, onSpacingChange, onHighlightToggle,
      separateMore, onSeparateMoreToggle,
      showArchived, onShowArchivedToggle,
    }) => {
      const activePreset = useOriginal
        ? 'V0'
        : (matchesPreset('V1', headerStyle, sections) ? 'V1' : null);
      return (
        <div className="debug-panel">
          {/* Panel header — DLS H3 + Caption subtitle. */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ ...T.h3, marginBottom: 2 }}>Page composition</div>
            <div style={{ ...T.caption, color: 'rgba(0,0,0,0.5)' }}>
              slice DLS · Explore prototype
            </div>
          </div>

          {/* PRESET + HEADER STYLE — compact row of two segmented
              controls side by side. Smaller meta labels, tighter
              seg-pick chassis. Frees vertical room for the section
              blocks below. */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
            marginBottom: 20,
          }}>
            <div>
              <div style={{ ...T.meta, marginBottom: 6 }}>Preset</div>
              <div className="seg-pick">
                {['V0', 'V1'].map(k => (
                  <button key={k}
                    className={'seg-btn' + (activePreset === k ? ' active' : '')}
                    onClick={() => onPresetApply(k)}>{PRESETS[k].label}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ ...T.meta, marginBottom: 6 }}>Header style</div>
              <div className="seg-pick">
                {HEADER_STYLES.map(s => (
                  <button key={s}
                    className={'seg-btn' + (headerStyle === s ? ' active' : '')}
                    onClick={() => onHeaderChange(s)}>{HEADER_LABELS[s]}</button>
                ))}
              </div>
            </div>
          </div>

          <PanelDivider mt={4} mb={20} />

          {/* SECTIONS — list rows. Each section is a single horizontal
              row: name on the left, variant key buttons aligned right.
              Rows separated by a DLS Outline/Subtle hairline. Reads
              as a settings list — dense and scannable. */}
          <div>
            {SECTION_META.map((s, idx) => {
              const currentVariantKey = sections[s.key];
              /* Conditional variants:
                 · aiBanker:
                     - FY=J → only F + None (F is the overlap pill designed
                       specifically for the J carousel)
                     - FY≠J → hide F (no carousel to overlap)
                 · bills:
                     - BL_J is the floating-card overlap variant. It is ONLY
                       available when FY=J AND aiBanker=None — that's the
                       combo where the bills card slot in as the seam anchor
                       instead of the AB_F search pill. Hidden otherwise. */
              /* Merge in archived variants when the toggle is on, OR when
                 the section is currently set to an archived variant (so
                 the picker can still display the active selection). */
              const allEntries = Object.entries(s.variants).concat(
                Object.entries(s.archived || {}).filter(([v]) =>
                  showArchived || currentVariantKey === v)
              );
              const filteredVariants = allEntries.filter(([v]) => {
                if (s.key === 'aiBanker') {
                  if (sections.forYou === 'J') return v === 'F' || v === 'None';
                  return v !== 'F';
                }
                if (s.key === 'bills' && v === 'J') {
                  return sections.forYou === 'J' && sections.aiBanker === 'None';
                }
                return true;
              });
              return (
                <div key={s.key} className="section-row" style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12, paddingTop: 12, paddingBottom: 12,
                }}>
                  <div className="section-row-label" style={{
                    ...T.btnSm,
                    flex: 1, minWidth: 0,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {s.label}
                  </div>
                  <div className="var-pills" style={{ flexShrink: 0 }}>
                    {filteredVariants.map(([v, label]) => (
                      <VariantTile key={v}
                        sectionKey={s.key}
                        variantKey={v}
                        label={label}
                        isActive={currentVariantKey === v}
                        onClick={() => onSectionChange(s.key, v)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <PanelDivider mt={28} mb={16} />

          {/* LAYOUT — page-level toggles. */}
          <div style={{ ...T.meta, marginBottom: 12 }}>Layout</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <ToggleRow label="Separate More section" value={separateMore} onChange={onSeparateMoreToggle} />
            <ToggleRow label="Show archived variants" value={showArchived} onChange={onShowArchivedToggle} />
            <ToggleRow label="Highlight spacing" value={highlight} onChange={onHighlightToggle} />
          </div>

          {/* Spacing options reveal under the Highlight toggle. */}
          {highlight && (
            <div style={{ marginTop: 16 }}>
              {Object.keys(SPACING_OPTIONS).map(key => (
                <div className="var-row" key={key} style={{ alignItems: 'center' }}>
                  <div style={{ ...T.bodySm, color: 'rgba(0,0,0,0.9)', flex: 1, minWidth: 0, paddingRight: 8 }}>
                    {SPACING_LABELS[key]}
                  </div>
                  <div className="var-pick">
                    {SPACING_OPTIONS[key].map(v => (
                      <button key={v}
                        className={'var-btn' + (spacing[key] === v ? ' active' : '')}
                        onClick={() => onSpacingChange(key, v)}>{v}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    /* ============= APP ============= */

    const useIsMobile = () => {
      const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
      );
      React.useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)');
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener ? mq.addEventListener('change', handler) : mq.addListener(handler);
        return () => {
          mq.removeEventListener ? mq.removeEventListener('change', handler) : mq.removeListener(handler);
        };
      }, []);
      return isMobile;
    };

    /* Computes the proportional scale (viewport_width / 392) and pushes it into a CSS
       variable so the phone-screen can transform-scale to fit any mobile width. */
    const useAppScale = () => {
      React.useEffect(() => {
        const BASE = 392;
        const update = () => {
          const isMobile = window.matchMedia('(max-width: 768px)').matches;
          if (!isMobile) {
            document.documentElement.style.removeProperty('--app-scale');
            return;
          }
          const scale = Math.min(1.3, Math.max(0.75, window.innerWidth / BASE));
          document.documentElement.style.setProperty('--app-scale', String(scale));
        };
        update();
        window.addEventListener('resize', update);
        window.addEventListener('orientationchange', update);
        return () => {
          window.removeEventListener('resize', update);
          window.removeEventListener('orientationchange', update);
        };
      }, []);
    };

    /* After a section's variant changes, scroll the phone to that section so the user
       can immediately see what changed. scrollIntoView works correctly even when the
       phone-screen is transform-scaled on mobile; scroll-margin-top (CSS) handles the
       offset for the fixed app bar. */
    /* Scroll the edited section into view when it's NOT already comfortably
       visible. On phone we always scroll because the drawer's bottom sheet
       covers ~half the viewport, so we need the section pinned at the top
       (effective top portion is small). On desktop we leave well-enough
       alone if the section's top edge already sits in the top 70% of the
       viewport — saves the jarring scroll-on-every-tweak. */
    /* Phone: always scroll (drawer eats most of the viewport).
       Desktop: skip the scroll ONLY when the section is fully clear of the
       app bar (top >= bar bottom + 20) AND its top is in the top 50% of the
       viewport AND its bottom is fully visible. If any of those fails —
       especially "section is hidden under the app bar" — scroll. The CSS
       scroll-margin-top lands the section 20px below the bar automatically.
       Two RAF ticks so the variant's reflow has finished before measuring. */
    const BAR_OVERLAP = 118; // matches --bar-overlap CSS default
    const BAR_GAP = 20;
    const scrollToSection = (key) => {
      const measureAndScroll = () => {
        const target = document.querySelector(`[data-section="${key}"]`);
        if (!target) return;
        const isPhone = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;
        if (isPhone) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
        const rect = target.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight || 0;
        const underBar = rect.top < BAR_OVERLAP + BAR_GAP;
        const topInTop50 = rect.top >= 0 && rect.top < vh * 0.5;
        const bottomVisible = rect.bottom <= vh;
        if (!underBar && topInTop50 && bottomVisible) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      requestAnimationFrame(() => requestAnimationFrame(measureAndScroll));
    };

    /* Top-of-drawer drag handle. A downward drag dismisses the drawer.
       Threshold: 30px downward travel, <30px horizontal drift. */
    const DrawerDragHandle = ({ onClose }) => {
      const start = React.useRef(null);
      const onTouchStart = (e) => {
        const t = e.touches[0];
        start.current = { x: t.clientX, y: t.clientY, fired: false };
      };
      const onTouchMove = (e) => {
        if (!start.current || start.current.fired) return;
        const t = e.touches[0];
        const dy = t.clientY - start.current.y;
        const dx = Math.abs(t.clientX - start.current.x);
        if (dy > 30 && dx < 30) {
          start.current.fired = true;
          onClose();
        }
      };
      const onTouchEnd = () => { start.current = null; };
      return (
        <div
          className="drawer-drag"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          aria-hidden="true" />
      );
    };

    /* Tap target centered over the bottom-nav slice logo. A tap opens the editor
       drawer. Replaces the previous swipe-up gesture so it doesn't conflict with
       the iOS home-indicator swipe. */
    const NavCenterTap = ({ onOpen, disabled }) => {
      if (disabled) return null;
      return (
        <button
          className="nav-center-tap"
          onClick={onOpen}
          aria-label="Open editor"
        />
      );
    };

    /* Every-load splash. Three-dot loader pulsing in slice Valentino over a
       white surface. Always plays — user wants the "Upgrading Explore"
       beat on every webapp open, not just first visit. */
    const Splash = ({ onDone }) => {
      const [fading, setFading] = useState(false);
      React.useEffect(() => {
        const showFor = 1800;
        const fadeFor = 450;
        const fadeTimer = setTimeout(() => setFading(true), showFor);
        const doneTimer = setTimeout(onDone, showFor + fadeFor);
        return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
      }, [onDone]);
      return (
        <div style={{
          /* White base — matches the page's starting white so the fade-out
             transitions seamlessly into the rendered page. A subtle grey
             sweep slides across it for the loading motion. */
          position: 'absolute', inset: 0, zIndex: 9999,
          background: '#FFFFFF',
          overflow: 'hidden',
          opacity: fading ? 0 : 1,
          transition: 'opacity 450ms ease',
          pointerEvents: fading ? 'none' : 'auto',
        }}>
          {/* Wider-than-screen layer so the diagonal band has room to sweep
              fully across the viewport without exposing its tilted edges. */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: '-50%', right: '-50%',
            /* 120deg = bands tilted 30° off vertical (leaning up-right).
               Soft grey peak in the middle fades to transparent at edges so
               the sweep reads as a moving diagonal highlight. */
            background: 'linear-gradient(120deg, transparent 35%, rgba(0,0,0,0.06) 50%, transparent 65%)',
            animation: 'splashShimmer 2000ms ease-in-out infinite',
          }} />
        </div>
      );
    };

    const App = () => {
      const [showSplash, setShowSplash] = useState(true);
      const [useOriginal, setUseOriginal] = useState(false);
      /* Page swiper — Savings (0) | Explore (1, default) | Home (2).
         Swipe right pulls Savings in from the left; swipe left pulls
         Home in from the right. Inner horizontal carousels carry the
         `.no-page-swipe` marker so they're not hijacked. */
      const [activePage, setActivePage] = useState(1);
      /* Live fractional position from the pager — 0 = Savings, 1 =
         Explore, 2 = Home. Updates continuously during drag so the
         bottom-nav overlays can cross-fade WITH the swipe. */
      const [pageProgress, setPageProgress] = useState(1);
      const [sections, setSections] = useState(PRESETS.V1.sections);
      const [headerStyle, setHeaderStyle] = useState(PRESETS.V1.headerStyle);
      const [spacing, setSpacing] = useState({ gapNone: 24, gapHeaderAbove: 32, gapHeaderBelow: 16 });
      const [highlight, setHighlight] = useState(false);
      const [drawerOpen, setDrawerOpen] = useState(false);
      const [separateMore, setSeparateMore] = useState(true);
      const [autoScroll, setAutoScroll] = useState(true);
      /* Set to true when the FY_L hero has scrolled past the app bar.
         Drives the app bar opacity + status bar icon colour flip. */
      const [heroScrolledPast, setHeroScrolledPast] = useState(false);
      /* Show archived variants in the editor drawer. Archived variants
         (e.g. FY_J, FY_C) are kept in the codebase but pulled out of the
         curated palette by default. Flip this on to surface them again. */
      const [showArchived, setShowArchived] = useState(false);
      /* Comment mode — vibeyard-style "select region, leave a note" feature.
         Tap any element on the phone-screen while commentMode is on; a
         popover anchors to the click point. Submitted comments become
         numbered Valentino pins persisted in localStorage. */
      const [commentMode, setCommentMode] = useState(false);
      const [comments, setComments] = useState(() => {
        try { return JSON.parse(localStorage.getItem('slice-explore-comments') || '[]'); }
        catch { return []; }
      });
      const [draftComment, setDraftComment] = useState(null);
      const [activePinId, setActivePinId] = useState(null);
      React.useEffect(() => {
        try { localStorage.setItem('slice-explore-comments', JSON.stringify(comments)); }
        catch (_) { /* quota */ }
      }, [comments]);
      const [activeSection, setActiveSection] = useState(null);
      /* Memoise the pages array so frequent `pageProgress` updates
         during a drag don't force Savings/Explore/Home to re-render —
         the AppBar inside Explore was flickering because each tick
         of progress was repainting the heavy page tree. */
      const pagerPages = React.useMemo(() => [
        <SavingsPage />,
        <ExplorePage sections={sections} headerStyle={headerStyle} activeSection={activeSection} separateMore={separateMore} autoScroll={autoScroll} onScrollPast={setHeroScrolledPast} />,
        <HomePage />,
      ], [sections, headerStyle, activeSection, separateMore, autoScroll]);
      /* True once the user has changed a More variant while the drawer is
         open. Adds extra bottom scroll-room so scrollToSection('more') can
         land the section in the upper half (above the drawer). Auto-clears
         when the drawer closes, so the spacing reverts. */
      const [moreScrollPad, setMoreScrollPad] = useState(false);
      const isMobile = useIsMobile();
      useAppScale();

      /* Bottom-nav image taps open the debug drawer. The event is dispatched
         from BottomNavGradient deep in the tree — listening at the App level
         keeps the wiring out of every intermediate prop. */
      React.useEffect(() => {
        const onOpen = () => setDrawerOpen(true);
        window.addEventListener('open-debug-drawer', onOpen);
        return () => window.removeEventListener('open-debug-drawer', onOpen);
      }, []);

/* Reset the extra-scroll flag any time the drawer closes — by any path
         (backdrop, drag, close button). */
      React.useEffect(() => {
        if (!drawerOpen) setMoreScrollPad(false);
      }, [drawerOpen]);

      const pulseTimer = React.useRef(null);
      const updateSection = (key, v) => {
        setUseOriginal(false);
        setSections(prev => {
          const next = { ...prev, [key]: v };
          /* Combo coherence for the FY_J carousel:
             · Only ONE element can overlap the carousel's bottom edge at a
               time — either AB_F (search pill) OR BL_J (bills card), never
               both.
             · BL_J is only valid when AB=None (the search pill isn't there).
             · AB_F is only valid when FY=J.
             · When FY leaves J, both overlap states reset to neutral.
             · When FY arrives at J, default to AB=F (the picker also offers
               this as the only AI banker option for FY=J). */
          if (key === 'forYou') {
            if (v === 'J') {
              if (prev.aiBanker !== 'F' && prev.aiBanker !== 'None') next.aiBanker = 'F';
            } else {
              if (prev.aiBanker === 'F') next.aiBanker = 'None';
              if (prev.bills === 'J') next.bills = 'A';
            }
          }
          if (key === 'aiBanker') {
            if (v === 'F' && prev.bills === 'J') next.bills = 'A';
            if (v === 'None' && prev.forYou === 'J' && prev.bills !== 'J') next.bills = 'J';
            if (v !== 'None' && v !== 'F' && prev.bills === 'J') next.bills = 'A';
          }
          return next;
        });
        /* Trigger the extra scroll-room only when the user edits the More
           section while the drawer is open. Other sections are far enough up
           that they don't need this. */
        if (key === 'more' && drawerOpen) setMoreScrollPad(true);
        /* Clear-then-set so the CSS animation restarts even when the user re-pulses
           the same section. Timer clears the active class after the pulse completes. */
        setActiveSection(null);
        if (pulseTimer.current) clearTimeout(pulseTimer.current);
        requestAnimationFrame(() => {
          setActiveSection(key);
          pulseTimer.current = setTimeout(() => setActiveSection(null), 700);
        });
        scrollToSection(key);
      };
      const updateHeader = (s) => {
        setUseOriginal(false);
        setHeaderStyle(s);
        /* In-card header style means the section title lives inside a card,
           so Bills needs to render the grid in a card (variant B). Section gap
           also tightens to 16 since each section is self-contained. */
        if (s === 'None') {
          setSections(prev => ({ ...prev, bills: 'B' }));
          setSpacing(prev => ({ ...prev, gapNone: 20 }));
        } else {
          setSpacing(prev => ({ ...prev, gapNone: 24 }));
        }
      };
      const updateSpacing = (key, v) => setSpacing(prev => ({ ...prev, [key]: v }));

      const applyPreset = (k) => {
        setSections(PRESETS[k].sections);
        setHeaderStyle(PRESETS[k].headerStyle);
        setUseOriginal(k === 'V0');
      };

      const debugPanel = (
        <DebugPanel
          sections={sections}
          headerStyle={headerStyle}
          useOriginal={useOriginal}
          spacing={spacing}
          highlight={highlight}
          onSectionChange={updateSection}
          onHeaderChange={updateHeader}
          onPresetApply={applyPreset}
          onSpacingChange={updateSpacing}
          onHighlightToggle={() => setHighlight(h => !h)}
          separateMore={separateMore}
          onSeparateMoreToggle={() => setSeparateMore(s => !s)}
          showArchived={showArchived}
          onShowArchivedToggle={() => setShowArchived(s => !s)} />
      );

      return (
        <SpacingCtx.Provider value={{ ...spacing, highlight }}>
          <div className="app-stage">
            <div className="phone-frame" style={{ flexShrink: 0 }}>
              <div className="btn-left btn-action" />
              <div className="btn-left btn-vol-up" />
              <div className="btn-left btn-vol-dn" />
              <div className="btn-right btn-power" />
              <div className="phone-shell">
                <div className="phone-bezel">
                  <div className={'phone-screen' + (moreScrollPad ? ' editor-open' : '')}>
                    <div className="dynamic-island" />
                    {/* StatusBar lives at the phone-screen level (above both
                        the main page and the Analytics slide-in via z:60)
                        so the time + icons stay anchored during page
                        transitions instead of sliding with the panel. */}
                    {/* Status bar adapts to whichever page is centred:
                       Home (Valentino) → white; Savings (white) → dark;
                       Explore → follows the FY-variant rule. */}
                    <StatusBar dark={
                      activePage === 2 /* Home Valentino */
                      || (activePage === 1 && !useOriginal && (sections.forYou === 'L' || sections.forYou === 'F' || sections.forYou === 'N') && !heroScrolledPast)
                    } />
                    {useOriginal
                      ? <OriginalExplore />
                      : (
                        <HorizontalPager
                          pages={pagerPages}
                          activeIndex={activePage}
                          onChange={setActivePage}
                          onProgress={setPageProgress}
                        />
                      )}
                    {/* Bottom nav cross-fades LIVE with the page drag
                       between the default slice nav (Savings + Explore)
                       and the Home quick-action footer. homeWeight runs
                       0→1 as the pager moves from Explore (1) to Home (2). */}
                    {!useOriginal && (() => {
                      const homeWeight = Math.max(0, Math.min(1, pageProgress - 1));
                      const overlay = (zIndex, opacity, active, content) => (
                        <div style={{
                          position: 'absolute', left: 0, right: 0, bottom: 0,
                          zIndex, opacity,
                          pointerEvents: active ? 'auto' : 'none',
                        }}>{content}</div>
                      );
                      return (
                        <>
                          {overlay(5, 1 - homeWeight, homeWeight <= 0.5, <BottomNavGradient />)}
                          {overlay(6, homeWeight, homeWeight > 0.5, (
                            <img src="/assets/bottom_nav_home.png" alt=""
                              style={{ width: '100%', display: 'block' }} />
                          ))}
                        </>
                      );
                    })()}
{/* Splash sits INSIDE phone-screen so it inherits the
                        transform: scale used on mobile — proportions match the
                        rendered page exactly instead of being misaligned at
                        viewport-pixel scale. */}
                    {showSplash && isMobile && <Splash onDone={() => setShowSplash(false)} />}
                  </div>
                </div>
              </div>
            </div>

            {isMobile ? (
              <React.Fragment>
                <div
                  className={'debug-backdrop' + (drawerOpen ? ' open' : '')}
                  onClick={() => setDrawerOpen(false)} />
                <div className={'debug-drawer' + (drawerOpen ? ' open' : '')}>
                  <DrawerDragHandle onClose={() => setDrawerOpen(false)} />
                  <div className="drawer-scroll">
                    {debugPanel}
                  </div>
                  <button className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close editor">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 2.5 L11.5 11.5 M11.5 2.5 L2.5 11.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <NavCenterTap onOpen={() => setDrawerOpen(true)} disabled={drawerOpen} />
              </React.Fragment>
            ) : debugPanel}
          </div>
        </SpacingCtx.Provider>
      );
    };


export default App;
