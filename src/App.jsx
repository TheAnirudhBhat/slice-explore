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

    const StatusBar = () => (
      <div className="status-bar" style={{ color: '#000' }}>
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
              border: '1px solid rgba(0,0,0,0.35)', borderRadius: 3.5,
              padding: 1.5, boxSizing: 'border-box',
            }}>
              <span style={{ display: 'block', height: '100%', width: '78%', background: '#000', borderRadius: 1.5 }} />
            </span>
            <span style={{
              display: 'inline-block', width: 1.5, height: 4,
              background: 'rgba(0,0,0,0.35)', borderRadius: '0 1px 1px 0', marginLeft: 1
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
    const AppBarL0 = React.forwardRef(({ transparent }, ref) => {
      const fillRef = React.useRef(null);
      const rootRef = React.useRef(null);
      React.useImperativeHandle(ref, () => ({
        setScrolled: (scrolled) => {
          const opaque = scrolled || !transparent;
          if (fillRef.current) fillRef.current.style.opacity = opaque ? '1' : '0';
          if (rootRef.current) rootRef.current.style.boxShadow = scrolled
            ? '0 6px 8px 0 rgba(0,0,0,0.05)' : 'none';
        },
      }), [transparent]);
      const initialOpaque = !transparent;
      return (
        <div ref={rootRef} className="app-bar-l0" style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
          paddingTop: 54, height: 54 + 64,
          paddingLeft: 24, paddingRight: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'transparent',
          boxShadow: 'none',
          transition: 'box-shadow 160ms ease',
        }}>
          <div ref={fillRef} style={{
            position: 'absolute', inset: 0,
            background: '#FFFFFF',
            opacity: initialOpaque ? 1 : 0,
            pointerEvents: 'none', zIndex: 0,
            willChange: 'opacity',
          }} />
          <h1 style={{ ...T.h2, position: 'relative', zIndex: 1 }}>Explore</h1>
          <div style={{ width: 48, height: 48, display: 'grid', placeItems: 'center', position: 'relative', zIndex: 1 }}>
            <img src="/assets/avatar_only.png" width={40} height={40} alt=""
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
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          background: 'transparent',
          zIndex: 5, pointerEvents: 'none',
        }}>
          {/* white band sits behind the icon row + 12px safe area below.
              Kept short so it doesn't bleed into the PNG's transparent
              fade at the top. */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0,
            height: 48, background: 'white',
          }} />
          <img src="/assets/bottom_nav_v3.png" alt="" onClick={openDebug} style={{
            width: '100%', display: 'block',
            position: 'relative', marginBottom: 12,
            pointerEvents: 'auto', cursor: 'pointer',
          }} />
        </div>
      );
    };

    const ScreenShell = ({ children, transparentAppBar }) => {
      const barRef = React.useRef(null);
      const lastScrolled = React.useRef(false);
      const onScroll = (e) => {
        const s = e.currentTarget.scrollTop > 0;
        if (s !== lastScrolled.current) {
          lastScrolled.current = s;
          barRef.current && barRef.current.setScrolled(s);
        }
      };
      return (
        <div className="absolute inset-0 bg-white">
          <AppBarL0 ref={barRef} transparent={transparentAppBar} />
          <div className="scrollbar-hide screen-scroll" onScroll={onScroll} style={{
            position: 'absolute', inset: 0,
            paddingTop: 'var(--bar-overlap, 118px)',
            paddingBottom: 200,
            overflowY: 'auto'
          }}>
            {children}
          </div>
          <BottomNavGradient />
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
        paddingLeft: 32, paddingRight: 24, lineHeight: '20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={T.h4}>{title}</span>
        {cta && <button className="tap" style={{
          background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
          ...T.btnSm, color: '#D30AD7',
        }}>{cta}</button>}
      </div>
    );
    const SectionHeaderList = ({ title }) => (
      <div style={{ paddingLeft: 28, paddingRight: 24, lineHeight: '12px' }}>
        <span style={T.meta}>{title}</span>
      </div>
    );

    /* Section gap = 32 between sections (Spacer 16 + header padding-top 16). No DividerBig.
       Header bottom padding = 16 → 16 between header and section content.
       'None' (In-card): title is handled by the section component itself (injected via inCardTitle prop),
       so SectionWrap just renders the spacer + children. */
    const SectionWrap = ({ title, cta, headerStyle, isFirst, children }) => {
      const { gapNone, gapHeaderAbove, gapHeaderBelow } = useSpacing();
      if (headerStyle === 'None') {
        return <>{!isFirst && <Spacer h={gapNone} label="section" />}{children}</>;
      }
      if (headerStyle === 'List') {
        return (
          <>
            {!isFirst && <Spacer h={gapHeaderAbove} label="section" />}
            <SectionHeaderList title={title} />
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
      brands = ['brand_a.png', 'brand_b.png', 'brand_c.png', 'brand_d.png'],
      size = 32,
      overlap = 10,
      durationMs = 500,
      staggerMs = 180,
      startDelayMs = 100,
      /* `animate` controls the right-to-left fade-in. Off by default for
         contexts where the stack sits next to static text — the staggered
         entrance reads awkward when the text is already there. Opt in
         explicitly (e.g. the original FY hero spark card). */
      animate = false,
    }) => {
      const rootRef = React.useRef(null);
      const [play, setPlay] = React.useState(!animate);
      React.useEffect(() => {
        if (!animate) return;
        const el = rootRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            const t = setTimeout(() => setPlay(true), startDelayMs);
            obs.disconnect();
            return () => clearTimeout(t);
          }
        }, { threshold: 0.2 });
        obs.observe(el);
        return () => obs.disconnect();
      }, [animate, startDelayMs]);
      const display = [...brands].reverse();
      return (
        <div ref={rootRef} style={{
          display: 'flex', flexDirection: 'row', alignItems: 'center',
        }}>
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
                animation: animate && play ? `spark-brand-in ${durationMs}ms ease-out forwards 1` : 'none',
                animationDelay: animate && play ? `${animI * staggerMs}ms` : '0ms',
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

    const BillsShortcutGrid = ({ columnGap = 8, avatarVariant = 'tinted' }) => (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: columnGap }}>
        {BILL_ICONS.map((b, i) => (
          <button key={i} className="tap" style={{
            background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <BillAvatar variant={avatarVariant}>{b.glyph}</BillAvatar>
            <div style={{ ...T.caption, textAlign: 'center', marginTop: 8, whiteSpace: 'pre-line', color: 'rgba(0,0,0,0.7)' }}>
              {b.t}
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
      }} className="scrollbar-hide">
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

    /* Shared slide data + colour schemes for all For You carousel variants */
    const FY_SLIDES = [
      {
        title: 'Electricity bill due today', sub: '₹1,240 · due in 3 days', cta: 'Pay now',
        heroImg: 'fy_3d_bill.png', centeredImg: 'fy_centered_bill.png', bannerImg: 'fy_banner_bill.png'
      },
      {
        title: 'New Spark Drop', sub: 'Fresh rewards just dropped', cta: 'Explore',
        heroImg: 'fy_3d_drop.png', centeredImg: 'fy_centered_drop.png', bannerImg: 'fy_banner_drop.png'
      },
      {
        title: 'Spent ₹18K last month', sub: '22% higher than usual', cta: 'See report',
        heroImg: 'fy_3d_spends.png', centeredImg: 'fy_centered_spends.png', bannerImg: 'fy_banner_spends.png'
      },
    ];
    const FY_SCHEMES = [
      ['#FCE3FC', '#F5C8F5', '#E5A8E5'],
      ['#E0F4E0', '#C2E6C2', '#9CD49C'],
      ['#FFE7CC', '#FAD0A8', '#F2B884'],
    ];

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
    const useInfiniteCarousel = (slideCount) => {
      const ref = React.useRef(null);
      const [idx, setIdx] = useState(0);
      const [progress, setProgress] = useState(0);
      const paused = React.useRef(false);
      const teleporting = React.useRef(false);

      React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        /* Start on the first real slide (position 1; position 0 is cloneLast). */
        const setInitial = () => {
          const cw = el.offsetWidth;
          if (cw === 0) { requestAnimationFrame(setInitial); return; }
          el.scrollLeft = cw;
        };
        setInitial();
      }, []);

      React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let settleTimer;
        const onScroll = () => {
          const cw = el.offsetWidth;
          if (cw === 0) return;
          const raw = el.scrollLeft / cw; /* 0..N+1 */
          /* Logical position: raw=1 → real slide 0, raw=N → real slide N-1 */
          const logical = raw - 1;
          const wrapped = ((logical % slideCount) + slideCount) % slideCount;
          setProgress(wrapped);
          setIdx(Math.round(wrapped) % slideCount);

          if (teleporting.current) return;
          clearTimeout(settleTimer);
          settleTimer = setTimeout(() => {
            const pos = Math.round(raw);
            if (pos <= 0) {
              /* On cloneLast → jump to real last (position N) without animation */
              teleporting.current = true;
              const prev = el.style.scrollBehavior;
              el.style.scrollBehavior = 'auto';
              el.scrollLeft = cw * slideCount;
              requestAnimationFrame(() => {
                el.style.scrollBehavior = prev;
                teleporting.current = false;
              });
            } else if (pos >= slideCount + 1) {
              /* On cloneFirst → jump back to real first (position 1) */
              teleporting.current = true;
              const prev = el.style.scrollBehavior;
              el.style.scrollBehavior = 'auto';
              el.scrollLeft = cw;
              requestAnimationFrame(() => {
                el.style.scrollBehavior = prev;
                teleporting.current = false;
              });
            }
          }, 140);
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        const onDown = () => { paused.current = true; };
        const onUp = () => { setTimeout(() => { paused.current = false; }, 3000); };
        el.addEventListener('pointerdown', onDown);
        el.addEventListener('pointerup', onUp);
        return () => {
          clearTimeout(settleTimer);
          el.removeEventListener('scroll', onScroll);
          el.removeEventListener('pointerdown', onDown);
          el.removeEventListener('pointerup', onUp);
        };
      }, [slideCount]);

      React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const t = setInterval(() => {
          if (paused.current) return;
          const cw = el.offsetWidth;
          if (cw === 0) return;
          el.scrollBy({ left: cw, behavior: 'smooth' });
        }, 4000);
        return () => clearInterval(t);
      }, []);

      return [ref, idx, progress];
    };

    /* Dot indicators — quiet pill: thinner inactive dots, slate-toned active. */
    const CarouselDots = ({ count, activeIdx, bottom = 14 }) => (
      <div style={{
        position: 'absolute', bottom, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 4, pointerEvents: 'none', zIndex: 2,
      }}>
        {Array.from({ length: count }, (_, i) => (
          <div key={i} style={{
            width: i === activeIdx ? 14 : 4, height: 4, borderRadius: 2,
            background: i === activeIdx ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.12)',
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
      const [ref, idx, progress] = useInfiniteCarousel(FY_SLIDES.length);
      /* Wrapped progress → lo/hi schemes; hi wraps to 0 when crossing the last slide. */
      const lo = Math.floor(progress) % FY_SCHEMES.length;
      const hi = (lo + 1) % FY_SCHEMES.length;
      const t = progress - Math.floor(progress);
      const scheme = lerpScheme(FY_SCHEMES[lo], FY_SCHEMES[hi], t);
      const renderedSlides = [FY_SLIDES[FY_SLIDES.length - 1], ...FY_SLIDES, FY_SLIDES[0]];

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
            }} className="scrollbar-hide">
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
            <CarouselDots count={FY_SLIDES.length} activeIdx={idx} bottom={16} />
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
      const MIN_H = 220;
      const SLIDE_PCT = 100;
      const TEXT_BOTTOM = 52;
      const slideBg = (s) => {
        /* Color holds at scheme[0] for the top quarter (covering the app bar
           area), eases through scheme[1], then dissolves to white at the
           bottom edge — opposite of FY_A which starts white at the top. */
        return `linear-gradient(to bottom, ${s[0]} 0%, ${s[0]} 30%, ${s[1]} 70%, #FFFFFF 100%)`;
      };
      const [ref, idx, progress] = useInfiniteCarousel(FY_SLIDES.length);
      const lo = Math.floor(progress) % FY_SCHEMES.length;
      const hi = (lo + 1) % FY_SCHEMES.length;
      const t = progress - Math.floor(progress);
      const scheme = lerpScheme(FY_SCHEMES[lo], FY_SCHEMES[hi], t);
      const renderedSlides = [FY_SLIDES[FY_SLIDES.length - 1], ...FY_SLIDES, FY_SLIDES[0]];

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
            }} className="scrollbar-hide">
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
            <CarouselDots count={FY_SLIDES.length} activeIdx={idx} bottom={16} />
          </div>
        </>
      );
    };

    /* For You F — centered layout carousel. Text + CTA centred within slide,
       illustration above text. Infinite scroll via cloned edge slides. */
    const FY_F = () => {
      const PAD_TOP_CSS = 'calc(var(--bar-overlap, 118px) + 4px)';
      const MIN_H = 220;
      const SLIDE_PCT = 100;
      const slideBg = (s) => {
        return `linear-gradient(to bottom, #FFFFFF 0%, ${s[0]} 35%, ${s[1]} 60%, #FFFFFF 100%)`;
      };
      const [ref, idx, progress] = useInfiniteCarousel(FY_SLIDES.length);
      const lo = Math.floor(progress) % FY_SCHEMES.length;
      const hi = (lo + 1) % FY_SCHEMES.length;
      const t = progress - Math.floor(progress);
      const scheme = lerpScheme(FY_SCHEMES[lo], FY_SCHEMES[hi], t);
      const renderedSlides = [FY_SLIDES[FY_SLIDES.length - 1], ...FY_SLIDES, FY_SLIDES[0]];

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
            }} className="scrollbar-hide">
              {renderedSlides.map((s, i) => (
                <div key={i} style={{
                  flex: `0 0 ${SLIDE_PCT}%`, scrollSnapAlign: 'start',
                  position: 'relative', minHeight: MIN_H, overflow: 'hidden',
                  background: 'transparent',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  textAlign: 'center',
                  paddingTop: PAD_TOP_CSS, paddingRight: 36, paddingBottom: 53, paddingLeft: 36,
                  boxSizing: 'border-box',
                }}>
                  <img src={`/assets/${s.heroImg}`} alt="" style={{
                    width: 96, height: 96, objectFit: 'contain',
                    display: 'block', marginBottom: 16, borderRadius: 20,
                  }} />
                  <div style={{ ...T.h4, lineHeight: '20px' }}>{s.title}</div>
                  <div style={{ ...T.caption, color: 'rgba(0,0,0,0.7)', marginTop: 4 }}>{s.sub}</div>
                  <button className="tap" style={{
                    marginTop: 12,
                    padding: '6px 14px', background: '#000', border: 'none', borderRadius: 100,
                    ...T.btnSm, color: 'white', cursor: 'pointer', whiteSpace: 'nowrap',
                  }}>{s.cta}</button>
                </div>
              ))}
            </div>
            {/* The slide-bg gradient ends in white at its bottom, so no overlay
                is needed — the CTA sits cleanly on the colored portion above. */}
            <CarouselDots count={FY_SLIDES.length} activeIdx={idx} bottom={16} />
          </div>
        </>
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
    const FY_I = ({ autoScroll }) => {
      const items = FY_SLIDES;
      const N = items.length;
      const [order, setOrder] = React.useState(() => items.map((_, i) => i));
      const [drag, setDrag] = React.useState({ x: 0, y: 0 });
      const [dragging, setDragging] = React.useState(false);
      const start = React.useRef({ x: 0, y: 0 });
      const cardRefs = React.useRef({});
      /* Lower commit threshold so a small flick triggers the deal-back.
         Was 100px — too far. 55 reads as a definite gesture but doesn't
         demand a full screen pull. */
      const COMMIT_DIST = 55;
      /* Bounded drag region so the card can't be pulled all the way to
         the screen edges. Card stays inside a centred zone — tight on
         Y to feel constrained, slightly looser on X for the swipe feel. */
      const DRAG_LIMIT_X = 130;
      const DRAG_LIMIT_Y = 70;
      /* ease-out-expo — punchy at start, long quiet tail. Combined with a
         longer duration (820ms) the deal-back reads as a smooth settle
         rather than a quick snap. */
      const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
      const CARD_H = 76;
      const PEEK = 14;
      const stackHeight = CARD_H + (N - 1) * PEEK + 4;

      const cancelInProgress = (origIdx) => {
        const el = cardRefs.current[origIdx];
        if (el && el.getAnimations) el.getAnimations().forEach(a => a.cancel());
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

         Z-index: 35 (above app bar) through lift+dwell, dropped to 1
         right when the descent begins, so the card slides UNDER the
         rising cards. */
      React.useEffect(() => {
        if (!autoScroll || dragging || cooldown) return;
        const id = setTimeout(() => {
          const topId = order[0];
          const topEl = cardRefs.current[topId];
          if (!topEl || !topEl.animate) return;
          /* Locked-in animation values (tuned via the live panel and
             frozen). Rise uses ease-out-cubic so the lift accelerates
             gently then decelerates into the apex; descent uses
             ease-out-quart so the card eases into the rear slot. */
          const LIFT_DIST = 24;
          const DURATION = 800;
          const APEX_AT = 0.2;
          const RISE_EASE = 'cubic-bezier(0.33, 1, 0.68, 1)';
          const DESCENT_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
          const newOrder = [...order.slice(1), order[0]];
          /* Lift leaving card above the deck via React state — no inline
             style.zIndex manipulation. */
          setZOverride({ id: topId, z: 35 });
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
            el.animate(keyframes, { duration: DURATION, fill: 'forwards' });
          });
          /* Z drops at the apex so the descending half passes UNDER. */
          setTimeout(() => {
            setZOverride({ id: topId, z: 0 });
          }, DURATION * APEX_AT);
          setTimeout(() => {
            setOrder(newOrder);
            setZOverride(null);
          }, DURATION + 30);
        }, 2500);
        return () => clearTimeout(id);
      }, [autoScroll, dragging, cooldown, order]);

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
          <div style={{ paddingTop: 16 }}>
            <div style={{ position: 'relative', height: stackHeight }}>
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
                           1. Auto-cycle override (lift to 35, drop to 0)
                           2. Drag lift (35, above app bar, below status bar)
                           3. Stack position (top = highest)
                         React-only — never set el.style.zIndex via JS. */
                      zIndex:
                        zOverride && zOverride.id === origIdx ? zOverride.z
                        : isTop && dragging ? 35
                        : N - stackPos,
                      background: '#FFFFFF',
                      boxShadow: STACK_CARD_SHADOW,
                      border: CARD_BORDER,
                      borderRadius: 16,
                      padding: '12px 16px',
                      display: 'flex', alignItems: 'center', gap: 12,
                      pointerEvents: isTop ? 'auto' : 'none',
                      cursor: isTop ? 'grab' : 'default',
                      userSelect: 'none',
                      touchAction: 'none',
                    }}>
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
                  </div>
                );
              })}
            </div>
          </div>
        </PagePad>
      );
    };

    /* FY_B — HScroll banner carousel themed with slice DLS palette.
       Per-slide visual identity:
         · Bill due  → Valentino-50 (#FAE2FA) — urgency in slice's signature pink
         · Spark drop → slice brand gradient (#D30AD7 → #2B6ACF) with white text
         · Spends    → Slate-10 (#F6F9FC) light neutral
       CTAs reuse slice purple / white / slate-900 per surface contrast. */
    /* CTA is the same dark pill on every banner so the action affordance is
       instantly recognisable regardless of slide. Matches the dark-pill CTA
       used in FY_A. */
    const FY_B_CTA_BG = '#171A1F';
    const FY_B_CTA_COLOR = '#FFFFFF';
    const FY_B_THEMES = [
      /* Bill due — pink (matching FY_A scheme[0] → scheme[2]) */
      { bg: 'linear-gradient(135deg, #FCE3FC 0%, #F5C8F5 50%, #E5A8E5 100%)',
        titleColor: 'rgba(0,0,0,0.9)', subColor: 'rgba(0,0,0,0.7)', ctaBg: FY_B_CTA_BG, ctaColor: FY_B_CTA_COLOR },
      /* Spark — peach pastel from DLS Orange-50 → 400 family. Warm "fresh
       drop" energy that sits in the same soft tonal family as the pink bill
       and green spends cards instead of fighting them with a saturated
       brand gradient. */
      { bg: 'linear-gradient(135deg, #FFF3E3 0%, #FAD0A8 50%, #F2B884 100%)',
        titleColor: 'rgba(0,0,0,0.9)', subColor: 'rgba(0,0,0,0.7)', ctaBg: FY_B_CTA_BG, ctaColor: FY_B_CTA_COLOR },
      /* Spends — green (matching FY_A scheme[0] → scheme[2]) */
      { bg: 'linear-gradient(135deg, #E0F4E0 0%, #C2E6C2 50%, #9CD49C 100%)',
        titleColor: 'rgba(0,0,0,0.9)', subColor: 'rgba(0,0,0,0.7)', ctaBg: FY_B_CTA_BG, ctaColor: FY_B_CTA_COLOR },
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
      const N = FY_SLIDES.length;
      const renderedSlides = [FY_SLIDES[N - 1], ...FY_SLIDES, FY_SLIDES[0]];

      React.useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const init = () => {
          if (el.clientWidth === 0) { requestAnimationFrame(init); return; }
          el.scrollLeft = STRIDE; /* land on the first real card */
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

      /* Auto-advance every 4s — pauses for 3s after any user touch. */
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
        <div style={{ paddingTop: 16, paddingBottom: 40 }}>
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
          }} className="scrollbar-hide">
            <div style={{ display: 'flex', gap: GAP }}>
              {renderedSlides.map((s, i) => {
                const themeIdx = i === 0 ? N - 1 : i === N + 1 ? 0 : i - 1;
                const th = FY_B_THEMES[themeIdx % FY_B_THEMES.length];
                return (
                  <button className="tap" key={i} style={{
                    flex: `0 0 ${CARD_W}px`, minHeight: 136, borderRadius: 16, padding: 24,
                    background: th.bg, border: 'none',
                    boxShadow: CARD_SHADOW,
                    scrollSnapAlign: 'start',
                    /* Explicit pan-x so iOS treats a touch-and-drag on the
                       button as a horizontal scroll gesture instead of a
                       held-down tap. Quick single taps still register. */
                    touchAction: 'pan-x',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    {/* Title runs the full card width — the hero sits in the
                        bottom-right corner so there's no vertical overlap with
                        the title row. Sub gets paddingRight to clear the hero
                        only on its own line. */}
                    <div style={{ width: '100%', position: 'relative', zIndex: 1 }}>
                      <div style={{
                        ...T.h4, lineHeight: '20px', color: th.titleColor,
                      }}>{s.title}</div>
                      <div style={{
                        ...T.caption, color: th.subColor, marginTop: 4,
                        paddingRight: 80,
                      }}>{s.sub}</div>
                    </div>
                    <div style={{
                      marginTop: 16, padding: '6px 14px', background: th.ctaBg, borderRadius: 100,
                      ...T.btnSm, color: th.ctaColor, alignSelf: 'flex-start', position: 'relative', zIndex: 1
                    }}>{s.cta}</div>
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
          }} className="scrollbar-hide">
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


    const ForYouSection = ({ variant, autoScroll }) => {
      const C = { A: FY_A, B: FY_B, C: FY_C, D: FY_D, F: FY_F, I: FY_I }[variant] || FY_I;
      return <C autoScroll={autoScroll} />;
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
          }} className="scrollbar-hide">
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
            <Chevron color="#D30AD7" />
          </button>
        </PagePad>
      );
    };

    const AiBankerSection = ({ variant }) => ({ A: AB_A, B: AB_B, C: AB_C, D: AB_D, E: AB_E }[variant])();

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
      <PagePad style={{ paddingTop: 8 }}>
        <BillsShortcutGrid avatarVariant="outline" />
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

    const BillsSection = ({ variant, isInCard }) => {
      const C = { A: BL_A, B: BL_B, C: BL_C, D: BL_D, E: BL_E, F: BL_F }[variant];
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
    const RW_F = ({ isInCard }) => {
      /* Simplified spark hero — same content pattern as the spark tile
         in RW_K, scaled up to hero size. Single icon + single label/value
         pair + chevron. Two states (default copy here = "drops available"):
           · "5 drops" / sub "Tap to browse" → goes to spark list
           · "1 active" / sub "Tap to claim" → direct claim
         The previous version had: title row + divider + brand-logo stack
         + meta line ("4 sparks live · Due in 5 days"). All of that is
         repeat content for a one-glance Explore card — pruned. */
      const sparkHero = (
        <button className="tap" style={{
          width: '100%', padding: 20, borderRadius: 16,
          background: '#FFFFFF', border: CARD_BORDER, boxShadow: CARD_SHADOW,
          textAlign: 'left', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 16,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...T.caption, color: 'rgba(0,0,0,0.5)' }}>Spark</div>
            <div style={{ ...T.h4, color: 'rgba(0,0,0,0.9)', marginTop: 2 }}>
              5 drops
            </div>
          </div>
          {/* Brand-logo stack pinned right, with the right-to-left
              fade-in animation re-enabled. The text on the left stays
              put while the brand circles cascade in on mount. */}
          <div style={{ flexShrink: 0 }}>
            <SparkBrandStack animate />
          </div>
        </button>
      );
      const bottomRow = (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <ExploreMedium subtext="Fire games" title="5 fires"
            icon={<img src="/assets/fire_sparkle.png" width={54} height={54} alt="" />} />
          <ExploreMedium subtext="Monies"
            title={<><MoniesGlyph size={18} /> 240</>}
            icon={<img src="/assets/monies_icon.png" width={52} height={52} alt="" style={{ display: 'block' }} />} />
        </div>
      );
      return (
        <PagePad>
          {sparkHero}
          {bottomRow}
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
              icon={<SparkBrandStack />} />
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
        key: 'monies',
        surface: 'card',
        iconAsset: 'monies_icon.png',
        label: 'Monies',
        valueNode: <><MoniesGlyph size={14} /> 240</>,
      },
    ];
    const RW_K = () => (
      <PagePad>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {RW_K_TILES.map(t => {
            const isBrand = t.surface === 'brand';
            const labelColor = isBrand ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)';
            const valueColor = isBrand ? '#FFFFFF' : 'rgba(0,0,0,0.9)';
            return (
              <button key={t.key} className="tap" style={{
                padding: '20px 12px', borderRadius: 16,
                background: isBrand
                  ? 'linear-gradient(135deg, #D30AD7 0%, #2B6ACF 100%)'
                  : '#FFFFFF',
                border: isBrand ? 'none' : CARD_BORDER,
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
                  ? <img src={`/assets/${t.iconAsset}`} width={48} height={48} alt=""
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



    const RewardsSection = ({ variant, isInCard }) => {
      const C = { A: RW_A, B: RW_B, E: RW_E, F: RW_F, G: RW_G, H: RW_H, I: RW_I, K: RW_K, N: RW_N }[variant] || RW_F;
      return <C isInCard={isInCard} />;
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
                <circle cx={cur.x} cy={cur.y} r="9" fill="rgba(211,10,215,0.18)" />
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
          {isInCard && <InCardHeader title="Statistics" icon={<GlyphChart color="#D30AD7" />} />}
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
                <circle cx={cur.x} cy={cur.y} r="9" fill="rgba(211,10,215,0.18)" />
                <circle cx={cur.x} cy={cur.y} r="4" fill="#D30AD7" />
                <circle cx={cur.x} cy={cur.y} r="2" fill="#FFFFFF" />
              </svg>
            </div>
            {/* Hairline divider — separates the at-a-glance trend block
                from the where-the-money-went list. DLS Outline/Subtle. */}
            <div style={{
              height: 1, background: 'rgba(0,0,0,0.05)',
              marginTop: 20, marginLeft: -20, marginRight: -20,
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

    const StatsSection = ({ variant, isInCard }) => {
      const C = { B: ST_B, C: ST_C, D: ST_D, E: ST_E, F: ST_F, G: ST_G, K: ST_K, L: ST_L }[variant];
      /* Whole stats card is a tap target — opens the Analytics page. */
      const openAnalytics = () => window.dispatchEvent(new CustomEvent('open-analytics'));
      return (
        <div onClick={openAnalytics} style={{ cursor: 'pointer' }}>
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
            icon={<img src="/assets/autopay_icon.png" width={52} height={52} alt="" style={{ display: 'block' }} />} />
          <ExploreMedium subtext="Credit score" title="778"
            icon={<img src="/assets/credit_score_icon.png" width={52} height={52} alt="" style={{ display: 'block' }} />} />
        </div>
      </PagePad>
    );

    /* MR_B — flat list with the figma 3D icons, no chevrons, condensed copy. */
    const MR_B_ROW = ({ icon, title, subtitle, trailing }) => (
      <div className="tap" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px' }}>
        {icon}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={T.body}>{title}</div>
          <div style={{ ...T.caption, marginTop: 2 }}>{subtitle}</div>
        </div>
        {trailing}
      </div>
    );
    const MR_B = () => (
      <>
        <MR_B_ROW
          icon={<img src="/assets/autopay_icon.png" width={44} height={44} alt="" style={{ display: 'block' }} />}
          title="Autopay"
          subtitle="3 active" />
        <DividerInset />
        <MR_B_ROW
          icon={<img src="/assets/credit_score_icon.png" width={44} height={44} alt="" style={{ display: 'block' }} />}
          title="Credit score"
          subtitle="Updated 5 May"
          trailing={<div style={{ ...T.h4, color: '#00A63E' }}>778</div>} />
      </>
    );

    /* C — Compact 2-column tile rows */
    const MR_C = () => (
      <PagePad>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { glyph: <GlyphBolt color="#2B6ACF" />, bg: '#E6EDF9', label: 'AutoPay', sub: '1 mandate active' },
            { glyph: <GlyphChart color="#00A63E" />, bg: '#E0F4E8', label: 'CIBIL', sub: '785 · +12' },
          ].map((m, i) => (
            <button key={i} className="tap" style={{
              background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 12,
              padding: 12, display: 'flex', alignItems: 'center', gap: 10,
              cursor: 'pointer', textAlign: 'left',
            }}>
              <Avatar size={36} bg={m.bg} glyph={m.glyph} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={T.bodySm}>{m.label}</div>
                <div style={{ ...T.caption, marginTop: 2 }}>{m.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </PagePad>
    );

    /* D — Grouped sub-headers + lists */
    const MR_D = () => (
      <>
        <div style={{ padding: '0 24px 4px', ...T.meta }}>Payments</div>
        <ListItemAvatar bg="#E6EDF9" glyph={<GlyphBolt color="#2B6ACF" />}
          title="AutoPay" subtitle="1 mandate active · next ₹239 on 8 May" />
        <Spacer h={16} />
        <div style={{ padding: '0 24px 4px', ...T.meta }}>Credit</div>
        <ListItemAvatar bg="#E0F4E8" glyph={<GlyphChart color="#00A63E" />}
          title="CIBIL score" subtitle="+12 this month"
          trailing={<div style={{ ...T.h4, color: '#00A63E' }}>785</div>} />
      </>
    );

    /* E — Condensed text-only rows */
    const MR_E = () => (
      <PagePad>
        <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, overflow: 'hidden' }}>
          {[
            { label: 'AutoPay', value: '1 active' },
            { label: 'CIBIL score', value: '785' },
          ].map((row, i) => (
            <button key={i} className="tap" style={{
              width: '100%', padding: '14px 16px',
              background: 'transparent', border: 'none',
              borderTop: i > 0 ? '1px solid rgba(0,0,0,0.05)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', textAlign: 'left',
            }}>
              <span style={{ ...T.body, color: 'rgba(0,0,0,0.9)' }}>{row.label}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ ...T.btnSm, color: 'rgba(0,0,0,0.5)' }}>{row.value}</span>
                <Chevron />
              </span>
            </button>
          ))}
        </div>
      </PagePad>
    );

    /* F — Premium In-card Header Variant. Always renders an in-card header so F stays
       distinct from E regardless of outer header style. Full title + CTA when outer
       header is hidden, otherwise a subtle "Edit" CTA inside the card. */
    const MR_F = ({ isInCard }) => (
      <PagePad>
        <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '24px 24px 0' }}>
            {isInCard
              ? <InCardHeader title="More" cta="Edit" />
              : (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
                  <button className="tap" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, ...T.btnSm, color: '#D30AD7' }}>Edit</button>
                </div>
              )}
          </div>
          <div style={{ padding: '8px 16px 16px' }}>
            {[
              { label: 'AutoPay', sub: '1 mandate active', glyph: <GlyphBolt color="#2B6ACF" />, value: null },
              { label: 'CIBIL score', sub: '+12 this month', glyph: <GlyphChart color="#00A63E" />, value: '785' },
            ].map((row, i) => (
              <button key={i} className="tap" style={{
                width: '100%', padding: '12px 8px',
                background: 'transparent', border: 'none',
                display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'pointer', textAlign: 'left',
              }}>
                <Avatar size={36} bg="#F0F4F7" glyph={row.glyph} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={T.body}>{row.label}</div>
                  <div style={{ ...T.caption, marginTop: 2 }}>{row.sub}</div>
                </div>
                {row.value && <div style={{ ...T.h4, color: '#00A63E' }}>{row.value}</div>}
                <Chevron />
              </button>
            ))}
          </div>
        </div>
      </PagePad>
    );

    const MoreSection = ({ variant, isInCard }) => {
      const C = { A: MR_A, B: MR_B, C: MR_C, D: MR_D, E: MR_E, F: MR_F }[variant];
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

    const ExplorePage = ({ sections, headerStyle, activeSection, separateMore, autoScroll }) => {
      const isInCard = headerStyle === 'None';
      const isActive = (k) => activeSection === k;
      const isGradientFY = sections.forYou === 'D' || sections.forYou === 'F';
      const isUtilityFY = sections.forYou === 'I';
      return (
        <ScreenShell transparentAppBar={isGradientFY}>
          <SectionAnchor id="forYou" />
          <SectionBlock id="forYou" active={isActive('forYou')}>
            <SectionWrap title="For you" headerStyle="None" isFirst>
              <ForYouSection variant={sections.forYou} autoScroll={autoScroll} />
            </SectionWrap>
          </SectionBlock>
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
                {isGradientFY && <Spacer h={12} />}
                <SectionWrap title="AI banker" headerStyle="None" isFirst>
                  <AiBankerSection variant={sections.aiBanker} />
                </SectionWrap>
              </SectionBlock>
            </>
          )}
          <SectionAnchor id="bills" />
          <SectionBlock id="bills" active={isActive('bills')}>
            {sections.aiBanker === 'None' ? (
              <>
                {/* AI banker hidden → extra +12 breathing room before
                    the Bills heading so it doesn't feel crammed against
                    the For You section. Utility FY (card-stack) ends
                    flush, so it gets a full 36. Carousel FYs self-pad
                    on the bottom but still need 12 to read cleanly. */}
                <Spacer h={isUtilityFY ? 36 : 12} />
                <SectionWrap title="Bills & Recharges" headerStyle={headerStyle} isFirst>
                  <BillsSection variant={sections.bills} isInCard={isInCard} />
                  {headerStyle === 'Bold' && <Spacer h={8} />}
              {headerStyle === 'List' && <Spacer h={4} />}
                </SectionWrap>
              </>
            ) : (
              <SectionWrap title="Bills & Recharges" headerStyle={headerStyle}>
                <BillsSection variant={sections.bills} isInCard={isInCard} />
                {headerStyle === 'Bold' && <Spacer h={8} />}
              {headerStyle === 'List' && <Spacer h={4} />}
              </SectionWrap>
            )}
          </SectionBlock>
          <SectionAnchor id="rewards" />
          <SectionBlock id="rewards" active={isActive('rewards')}>
            <SectionWrap title="Rewards & benefits" headerStyle={headerStyle}>
              <RewardsSection variant={sections.rewards} isInCard={isInCard} />
            </SectionWrap>
          </SectionBlock>
          <SectionAnchor id="stats" />
          <SectionBlock id="stats" active={isActive('stats')}>
            <SectionWrap title="Statistics" headerStyle={headerStyle}>
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
                <Spacer h={8} />
                <SectionWrap title="" headerStyle="None">
                  <FooterSection variant={sections.footer} />
                </SectionWrap>
              </SectionBlock>
            </>
          )}
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
    /* FT_B — Brand-gradient hero push. Edge-to-edge card using the
       slice brand gradient (Valentino → Blue) so the invite feels like a
       reward, not a footnote. White copy + white-pill CTA reverses the
       hierarchy so the card itself becomes the surface for action.
       The magnet illustration peeks from the right with negative margins
       so the card has a hero feel, not a stat-tile feel. */
    const FT_B = () => (
      <PagePad>
        <div style={{
          borderRadius: 16, padding: 20, paddingRight: 0,
          background: 'linear-gradient(135deg, #D30AD7 0%, #2B6ACF 100%)',
          boxShadow: CARD_SHADOW,
          position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...T.h3, color: '#FFFFFF' }}>
              Invite &amp; earn <MoniesGlyph size={16} /> 500
            </div>
            <div style={{
              ...T.caption, color: 'rgba(255,255,255,0.7)', marginTop: 6,
            }}>
              Win a fire per friend who joins slice
            </div>
            <button className="tap" style={{
              marginTop: 16, height: 36, padding: '0 16px',
              background: '#FFFFFF', border: 'none', borderRadius: 100,
              ...T.btnSm, color: '#D30AD7', cursor: 'pointer',
            }}>Send link</button>
          </div>
          <img src="/assets/invite_magnet.png" alt="" style={{
            width: 110, height: 110, objectFit: 'contain', display: 'block',
            flexShrink: 0, marginRight: -12,
          }} />
        </div>
      </PagePad>
    );

    /* FT_C — Tinted soft card. Valentino-50 background is the gentler
       version of FT_B — still on-brand, but the page can have multiple
       brand-toned cards above (FY/RW) without the gradient hero
       competing. Avatar-style icon on the left mirrors the rest of the
       page's card recipe (Bills, Rewards). Filled Valentino CTA on the
       trailing edge so the action is unmissable. */
    const FT_C = () => (
      <PagePad>
        <div style={{
          borderRadius: 16, padding: 20,
          background: '#FAE2FA',
          boxShadow: CARD_SHADOW,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 100, flexShrink: 0,
            background: '#FFFFFF',
            display: 'grid', placeItems: 'center', overflow: 'hidden',
          }}>
            <img src="/assets/magnet.png" alt="" width={40} height={40}
              style={{ display: 'block' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...T.h4, color: 'rgba(0,0,0,0.9)' }}>
              Invite &amp; earn <MoniesGlyph size={14} /> 500
            </div>
            <div style={{ ...T.caption, color: 'rgba(0,0,0,0.7)', marginTop: 4 }}>
              Win a fire per friend
            </div>
            <button className="tap" style={{
              marginTop: 12, height: 32, padding: '0 14px',
              background: '#D30AD7', border: 'none', borderRadius: 100,
              ...T.btnSm, color: '#FFFFFF', cursor: 'pointer',
            }}>Send link</button>
          </div>
        </div>
      </PagePad>
    );

    const FooterSection = ({ variant }) => ({ A: FT_A, B: FT_B, C: FT_C }[variant] || FT_A)();

    /* ============= DEBUG PANEL ============= */

    /* Curated set — only the variants the designer has decided to keep are exposed in the picker. */
    const SECTION_META = [
      {
        key: 'forYou', label: 'For You', variants: {
          I: 'Card stack · shuffle',
          D: 'Full-bleed (top-tinted, PWA)', F: 'Centered carousel', B: 'Horizontal strip', C: 'Compact dark strip',
        }
      },
      {
        key: 'aiBanker', label: 'AI banker', variants: {
          A: 'Pill + BETA tag', C: 'Input + scroll pills', E: 'Pill + rolling examples', None: 'X'
        }
      },
      {
        key: 'bills', label: 'Bills & Recharges', variants: {
          A: 'Grid', C: 'Grid (outline avatars)', B: 'Grid in card',
        }
      },
      {
        key: 'rewards', label: 'Rewards & Benefits', variants: {
          K: 'Triptych palette', N: 'Bento · abstract shapes', G: 'Fire hero + 2 below', F: 'Featured Large + 2 Med',
        }
      },
      {
        key: 'stats', label: 'Statistics', variants: {
          L: 'Inline graph + categories', K: 'Bar + top categories', D: 'Sparkline card', G: 'Analytics widget',
        }
      },
      {
        key: 'more', label: 'More', variants: {
          A: 'List rows', E: 'Condensed text-only',
        }
      },
      {
        key: 'footer', label: 'Invite & earn', variants: {
          A: 'Invite closer', B: 'Brand gradient hero', C: 'Tinted soft card', None: 'X'
        }
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
        sections: { forYou: 'B', aiBanker: 'E', bills: 'B', rewards: 'F', stats: 'A', more: 'A', footer: 'None' },
      },
      V1: {
        label: 'Exploration',
        headerStyle: 'List',
        sections: { forYou: 'D', aiBanker: 'None', bills: 'C', rewards: 'F', stats: 'L', more: 'A', footer: 'A' },
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
                    {Object.entries(s.variants).map(([v, label]) => (
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
    const scrollToSection = (key) => {
      requestAnimationFrame(() => {
        const target = document.querySelector(`[data-section="${key}"]`);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
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
    /* AnalyticsPage — slides in from the right when the May spends card
       is tapped. Lives at phone-screen scope (sibling of the main page)
       so the slide-in only covers the phone, not the desktop layout.
       Back button slides it back out to the right. */
    const AnalyticsPage = ({ open, onClose }) => {
      return (
        <div style={{
          position: 'absolute', inset: 0,
          background: '#FFFFFF',
          zIndex: 50,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Top bar: back chevron + title. Sits above the dynamic island
              zone to mimic a stacked navigation feel. */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            paddingTop: 54, paddingLeft: 16, paddingRight: 24,
            height: 54 + 64, flexShrink: 0,
            background: '#FFFFFF',
          }}>
            <button onClick={onClose} className="tap" style={{
              width: 44, height: 44, borderRadius: 100,
              background: 'transparent', border: 'none',
              display: 'grid', placeItems: 'center', cursor: 'pointer',
            }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M14 4 L7 11 L14 18" stroke="rgba(0,0,0,0.9)"
                  strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div style={{ ...T.h3 }}>Analytics</div>
          </div>
          {/* Scrollable content */}
          <div style={{
            flex: 1, overflowY: 'auto',
            paddingBottom: 40,
          }} className="scrollbar-hide">
            <PagePad>
              <div style={{ paddingTop: 8 }}>
                <div style={{ ...T.btnSm, color: 'rgba(0,0,0,0.5)' }}>May spends</div>
                <div style={{ ...T.display, marginTop: 4 }}>₹12,487</div>
                <div style={{ marginTop: 8 }}>
                  <TagSubtle intent="positive">↓ 18% vs Apr</TagSubtle>
                </div>
              </div>
            </PagePad>
            <PagePad>
              <div style={{ marginTop: 24, background: '#FFFFFF', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 24 }}>
                <div style={{ ...T.meta, marginBottom: 8 }}>Weekly pattern</div>
                <SpendBarChart />
              </div>
            </PagePad>
            <PagePad>
              <div style={{ marginTop: 16, background: '#FFFFFF', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ ...T.meta }}>Top categories</div>
                  <div style={{ ...T.caption, color: 'rgba(0,0,0,0.5)' }}>This month</div>
                </div>
                {SPEND_CATEGORIES.map(c => (
                  <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={`/assets/${c.icon}`} width={44} height={44} alt=""
                      style={{ display: 'block', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0, ...T.h4 }}>{c.label}</div>
                    <div style={{ ...T.h4 }}>{c.amount}</div>
                  </div>
                ))}
              </div>
            </PagePad>
            <PagePad>
              <div style={{ marginTop: 16, background: '#FFFFFF', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 24 }}>
                <div style={{ ...T.meta, marginBottom: 12 }}>Insights</div>
                <div style={{ ...T.bodySm }}>You spent ₹1,820 less than April. Food &amp; drinks is your biggest category this month.</div>
              </div>
            </PagePad>
          </div>
        </div>
      );
    };

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
      const [sections, setSections] = useState(PRESETS.V1.sections);
      const [headerStyle, setHeaderStyle] = useState(PRESETS.V1.headerStyle);
      const [spacing, setSpacing] = useState({ gapNone: 24, gapHeaderAbove: 32, gapHeaderBelow: 16 });
      const [highlight, setHighlight] = useState(false);
      const [drawerOpen, setDrawerOpen] = useState(false);
      const [separateMore, setSeparateMore] = useState(false);
      const [autoScroll, setAutoScroll] = useState(true);
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
      const [analyticsOpen, setAnalyticsOpen] = useState(false);
      const [activeSection, setActiveSection] = useState(null);
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

      /* Tapping the May spends card anywhere in the page dispatches
         'open-analytics' — listened here so the analytics page can mount
         at the phone-screen level. */
      React.useEffect(() => {
        const onOpen = () => setAnalyticsOpen(true);
        window.addEventListener('open-analytics', onOpen);
        return () => window.removeEventListener('open-analytics', onOpen);
      }, []);

      /* Reset the extra-scroll flag any time the drawer closes — by any path
         (backdrop, drag, close button). */
      React.useEffect(() => {
        if (!drawerOpen) setMoreScrollPad(false);
      }, [drawerOpen]);

      const pulseTimer = React.useRef(null);
      const updateSection = (key, v) => {
        setUseOriginal(false);
        setSections(prev => ({ ...prev, [key]: v }));
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
          onSeparateMoreToggle={() => setSeparateMore(s => !s)} />
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
                    <StatusBar />
                    {useOriginal
                      ? <OriginalExplore />
                      : <ExplorePage sections={sections} headerStyle={headerStyle} activeSection={activeSection} separateMore={separateMore} autoScroll={autoScroll} />}
                    <AnalyticsPage open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} />
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
