// Banking L0 — canonical per Figma node 885:19757 (PNUz3Dr9KSlFJSnsXsC0nL · cal:2026-05-29 R23 rewrite).
//
// Canonical anatomy (top to bottom):
//   1. App bar L0 — "Banking" H2 + eye-toggle + photo Avatar trailing
//   2. L0 Large card — Savings hero
//        — caption "Savings ••••5732" (14/20 Medium, tertiary)
//        — Display Small ₹45,800 (48/56 Medium, -0.48px tracking)
//        — green up-arrow + "Earn interest at 100% RBI repo rate" (14/20 Medium, positive)
//        — full-bleed divider within card
//        — Row: "Grow your savings (V-500 14M) / Earn interest daily (12R secondary)"
//          + V-500 "Add money" pill (14M, no icon)
//   3. L0 Medium card — Fixed deposits + rocket-mascot corner
//   4. L0 Medium card — monies + inline monies-mark glyph + cluster corner
//
// R23 fix-it pass:
//   • Page bg now transparent so App.jsx slate-10 wrapper bg shows through →
//     card 0.05-alpha drop shadows actually visible.
//   • Bottom fade overlay added (transparent → slate-10) above the floating
//     nav, matching the canonical bottom-nav gradient.
//   • monies brand mark now rendered as inline SVG (the PNG asset was too
//     small/transparent to read against white) — V-500 droplet + orange dot.

import React, { useEffect, useRef, useState } from 'react';
import { AppBar, EyeOpenGlyph, EyeClosedGlyph, usePageScroll } from '../../components/AppBar.jsx';
import BottomFade from '../../components/BottomFade.jsx';
import { useL1 } from '../../components/L1Stack.jsx';
import { TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, OUTLINE_SUBTLE, V_500, POSITIVE, SURFACE } from '../../tokens.js';

// ---- Tokens ----
const CARD_BG = SURFACE;
const CARD_SHADOW = '0px 4px 24px 0px rgba(0,0,0,0.08)';
const CARD_RADIUS = 16;
const PAGE_PAD = 24;
const CARD_PAD = 24;
const CARD_GAP = 16;
const NAV_INSET = 140; // floating nav reserve

// ---- Inline glyphs ----
function ArrowUpIcon({ size = 16, color = POSITIVE }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 13V3M8 3 4 7M8 3l4 4"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Canonical monies brand mark — vector path from Figma (Group.svg). Themeable
// via `color` so it can render black on light surfaces and white on dark/V-500
// surfaces. Uses currentColor by default. viewBox 21×37 (the glyph's intrinsic
// aspect), width auto so height drives the scale.
function MoniesMark({ height = 36, color = 'currentColor' }) {
  return (
    <svg
      height={height}
      viewBox="0 0 21 37"
      fill="none"
      aria-hidden="true"
      style={{ width: 'auto', display: 'block', pointerEvents: 'none', userSelect: 'none' }}
    >
      <path d="M7.28834 28.7385H10.4706C13.1738 28.7385 15.7743 27.6695 17.7931 25.7384C19.7606 23.8245 20.8385 21.2727 20.8385 18.5657C20.8385 15.8587 19.7606 13.2896 17.7931 11.393C15.8427 9.49638 13.2251 8.44461 10.4192 8.44461C5.56035 8.44461 1.40292 11.6172 0.307958 16.1518L0.239523 16.5139C0.0855437 17.2553 0.239523 18.014 0.667242 18.6692C1.07785 19.2726 1.71088 19.6864 2.44656 19.8416C2.61764 19.8761 2.80584 19.8934 2.97693 19.8934C4.03767 19.8934 5.02998 19.2726 5.50903 18.2898L5.90253 17.445C6.99749 15.238 8.53728 14.1 10.4706 14.1C11.7195 14.1 12.9 14.5655 13.7555 15.4104C14.628 16.2725 15.1071 17.3933 15.1071 18.6002C15.1071 19.8071 14.628 20.9279 13.7726 21.7727C12.8658 22.6348 11.7024 23.1176 10.5048 23.1176H2.80584C1.26605 23.1176 0 24.3763 0 25.9453C0 28.6696 1.07785 31.2214 3.04536 33.118C4.96155 34.9974 7.66473 36.0664 10.4192 36.0664H11.0352C12.575 36.0664 13.841 34.8078 13.841 33.2387C13.841 31.6697 12.5921 30.411 11.0352 30.411H10.4535C9.20452 30.411 8.02402 29.9455 7.16858 29.1006C7.08303 29.0144 7.11725 28.911 7.13436 28.8765C7.13436 28.842 7.2028 28.7558 7.30545 28.7558L7.28834 28.7385Z" fill={color} />
      <path d="M3.9089 5.68989H16.9155C18.5408 5.68989 19.8582 4.41397 19.8582 2.84494C19.8582 1.27591 18.5408 0 16.9155 0H3.9089C2.28356 0 0.966187 1.27591 0.966187 2.84494C0.966187 4.41397 2.28356 5.68989 3.9089 5.68989Z" fill={color} />
    </svg>
  );
}

// ---- Savings hero — L0 Large card ----
function SavingsHero({ balanceHidden }) {
  return (
    <div
      style={{
        background: CARD_BG,
        borderRadius: CARD_RADIUS,
        padding: CARD_PAD,
        boxShadow: CARD_SHADOW,
        border: `1px solid ${OUTLINE_SUBTLE}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            fontFamily: 'Rubik, sans-serif',
            fontSize: 14,
            lineHeight: '20px',
            letterSpacing: '0.28px',
            color: TEXT_TERTIARY,
            fontWeight: 500,
          }}
        >
          Savings ••••5732
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              fontFamily: 'Rubik, sans-serif',
              fontSize: 48,
              lineHeight: '56px',
              letterSpacing: '-0.48px',
              color: TEXT_PRIMARY,
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            {balanceHidden ? '₹•••••' : '₹45,800'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 24 }}>
            <ArrowUpIcon size={16} color={POSITIVE} />
            <span
              style={{
                fontFamily: 'Rubik, sans-serif',
                fontSize: 14,
                lineHeight: '20px',
                letterSpacing: '0.28px',
                color: POSITIVE,
                fontWeight: 500,
              }}
            >
              Earn interest at 100% RBI repo rate
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            height: 1,
            background: OUTLINE_SUBTLE,
            // MIDDLE divider — respects the card's L/R padding on BOTH sides
            // (NOT full-bleed, and NOT an "inset" divider — inset is the
            // avatar-list type, indented under the leading avatar only).
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 8,
            paddingTop: 16,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
            <span
              style={{
                fontFamily: 'Rubik, sans-serif',
                fontSize: 14,
                lineHeight: '20px',
                letterSpacing: '0.28px',
                color: V_500,
                fontWeight: 500,
              }}
            >
              Grow your savings
            </span>
            <span
              style={{
                fontFamily: 'Rubik, sans-serif',
                fontSize: 12,
                lineHeight: '16px',
                letterSpacing: '0.24px',
                color: TEXT_SECONDARY,
                fontWeight: 400,
              }}
            >
              Earn interest daily
            </span>
          </div>
          <button
            style={{
              background: V_500,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 100,
              padding: '8px 16px',
              fontFamily: 'Rubik, sans-serif',
              fontSize: 14,
              lineHeight: '20px',
              letterSpacing: '0.28px',
              fontWeight: 500,
              cursor: 'pointer',
              flexShrink: 0,
              outline: 'none',
            }}
            aria-label="add money"
          >
            Add money
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Fixed deposits — L0 Medium card with rocket-mascot corner ----
function FixedDepositsCard({ balanceHidden }) {
  return (
    <div
      style={{
        position: 'relative',
        background: CARD_BG,
        borderRadius: CARD_RADIUS,
        padding: CARD_PAD,
        boxShadow: CARD_SHADOW,
        border: `1px solid ${OUTLINE_SUBTLE}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          fontFamily: 'Rubik, sans-serif',
          fontSize: 14,
          lineHeight: '20px',
          letterSpacing: '0.28px',
          color: TEXT_TERTIARY,
          fontWeight: 500,
        }}
      >
        Fixed deposits
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            fontFamily: 'Rubik, sans-serif',
            fontSize: 48,
            lineHeight: '56px',
            letterSpacing: '-0.48px',
            color: TEXT_PRIMARY,
            fontWeight: 500,
          }}
        >
          {balanceHidden ? '₹•••' : '₹0'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 24 }}>
          <ArrowUpIcon size={16} color={POSITIVE} />
          <span
            style={{
              fontFamily: 'Rubik, sans-serif',
              fontSize: 14,
              lineHeight: '20px',
              letterSpacing: '0.28px',
              color: POSITIVE,
              fontWeight: 500,
            }}
          >
            Earn interest up to 7.75 p.a.
          </span>
        </div>
      </div>
      {/* Rocket mascot — TRANSPARENT SVG (Figma imgLayer2 illustration only, no
         baked "Card Background"). The old fd_card_corner.png had an opaque bg →
         white box in dark mode. */}
      <img
        src="/assets/fd_card_corner.svg"
        alt=""
        aria-hidden="true"
        style={{
          // Per Figma "Live deposit" corner (885:19672): 96×96 box flush to the
          // top-right with the mascot inset 32.21%/30.27%/29.13%/24.78% → the art
          // resolves to ~43×37 at top 30 / right 28 from the card corner.
          position: 'absolute',
          top: 30,
          right: 28,
          width: 43,
          height: 'auto',
          objectFit: 'contain',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
    </div>
  );
}

// ---- monies — L0 Medium card with inline brand glyph + cluster corner ----
function MoniesCard({ balanceHidden }) {
  return (
    <div
      style={{
        position: 'relative',
        background: CARD_BG,
        borderRadius: CARD_RADIUS,
        padding: CARD_PAD,
        boxShadow: CARD_SHADOW,
        border: `1px solid ${OUTLINE_SUBTLE}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          fontFamily: 'Rubik, sans-serif',
          fontSize: 14,
          lineHeight: '20px',
          letterSpacing: '0.28px',
          color: TEXT_TERTIARY,
          fontWeight: 500,
        }}
      >
        monies
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MoniesMark height={40} color={TEXT_PRIMARY} />
          <span
            style={{
              fontFamily: 'Rubik, sans-serif',
              fontSize: 48,
              lineHeight: '56px',
              letterSpacing: '-0.48px',
              color: TEXT_PRIMARY,
              fontWeight: 500,
            }}
          >
            {balanceHidden ? '•••••' : '12,740'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 24 }}>
          <span
            style={{
              fontFamily: 'Rubik, sans-serif',
              fontSize: 14,
              lineHeight: '20px',
              letterSpacing: '0.28px',
              color: V_500,
              fontWeight: 500,
            }}
          >
            Reward rate at 1%
          </span>
        </div>
      </div>
      {/* monies cluster — TRANSPARENT render (Figma illustration only, no baked
         "Card Background"). The old monies_card_corner.png had an opaque bg →
         white box in dark mode. */}
      <img
        src="/assets/monies_card_corner.png"
        alt=""
        aria-hidden="true"
        style={{
          // Per Figma "Monies" corner (885:24850): 96×96 box flush to the
          // top-right with the cluster inset 26.67%/29.2%/28.47%/28.67% → the art
          // resolves to ~40×43 at top 25 / right 27 from the card corner.
          position: 'absolute',
          top: 25,
          right: 27,
          height: 43,
          width: 'auto',
          objectFit: 'contain',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
    </div>
  );
}

// ---- Page ----
export default function BankingL0({ onScrollChange }) {
  const [balanceHidden, setBalanceHidden] = useState(false);
  const scrollRef = useRef(null);
  const scrolled = usePageScroll(scrollRef);
  const { push } = useL1();
  // R24 cont-13: lift scroll state up so App.jsx's 54px status reserve can
  // also paint white when this L0 is scrolled (matches the AppBar's scroll
  // elevation so the cards don't bleed past the chrome).
  // Depend on `scrolled` only — `onScrollChange` is a fresh inline arrow on
  // every App render, so including it re-fired this effect each render (R24
  // cont-24 audit). setScrolledByPod uses the updater form, no stale closure.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onScrollChange?.(scrolled); }, [scrolled]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        ref={scrollRef}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent', // let App.jsx slate-10 page bg show through
          fontFamily: 'Rubik, sans-serif',
          overflowY: 'auto',
          overflowX: 'hidden',
          // A scroll container must declare pan-y itself or it claims horizontal
          // touch gestures and the Pager swipe never fires (ancestor pan-y is NOT
          // enough). pan-y = vertical scroll stays, horizontal swipe → Pager. (cont-38)
          touchAction: 'pan-y',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AppBar
          scroll={scrolled}
          variant="l0"
          title="Banking"
          actions={[
            <button
              key="eye"
              onClick={() => setBalanceHidden((v) => !v)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                // R24 cont-11: color removed — let parent ActionSlot drive the
                // tertiary fill via opacity:0.5 (works for both the PNG eye and
                // future inline SVG icons).
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
              aria-label={balanceHidden ? 'show balance' : 'hide balance'}
            >
              {balanceHidden ? <EyeClosedGlyph /> : <EyeOpenGlyph />}
            </button>,
          ]}
          avatar={
            <img
              src="/assets/avatar_only.png"
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              aria-label="profile photo"
            />
          }
          onAvatarTap={() => push('profile')}
        />

        <div
          style={{
            padding: `8px ${PAGE_PAD}px ${NAV_INSET}px`,
            display: 'flex',
            flexDirection: 'column',
            gap: CARD_GAP,
          }}
        >
          <SavingsHero balanceHidden={balanceHidden} />
          <FixedDepositsCard balanceHidden={balanceHidden} />
          <MoniesCard balanceHidden={balanceHidden} />
        </div>
      </div>
      <BottomFade color="var(--page-bg)" height={200} bottom={12} />
    </div>
  );
}
