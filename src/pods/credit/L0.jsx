// Credit L0 — canonical per Figma file PNUz3Dr9KSlFJSnsXsC0nL node 885:20015.
// Icons + photo avatar extracted directly from canonical (R23 cal:2026-05-29).
//
// Anatomy:
//   • App bar L0: "Credit" title (24/32 Medium) + photo Avatar trailing (40×40 in 48 hit)
//   • L0 Large card:
//       — "Spends • 5 Jun - 4 Jul" caption (14/20 Medium, tertiary text)
//       — ₹1,00,550 Display Small (48/56 Medium, -0.48 letter-spacing)
//       — 2 inline insight rows with 16px line glyphs (NOT mini-Avatars):
//           Blue car + "Paid ₹370 to Uber"
//           Red bag + "Paid ₹180 to Sampath stores"
//       — In-card slate-10 callout "Invite a friend / You have the power"
//         with the canonical scatter glyph (24px)
//   • L0 Medium card: "Meet your slice super card / Discover the benefits"
//     with super_card_mascot illustration trailing
//   • Page bg #FFFFFF — content scrolls under sticky AppBar with elevation

import React, { useEffect, useRef } from 'react';
import { AppBar, usePageScroll } from '../../components/AppBar.jsx';
import { useL1 } from '../../components/L1Stack.jsx';
import { SLATE_10, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, PAGE_BG, SURFACE } from '../../tokens.js';

const CARD_BG = SURFACE;
const CARD_SHADOW = '0px 4px 24px 0px rgba(0,0,0,0.08)';
const CARD_BORDER = '1px solid rgba(0,0,0,0.05)';
const CARD_RADIUS = 16;
const PAGE_PAD = 24;
const CARD_PAD = 24;
const CARD_GAP = 16;
const NAV_INSET = 120;

function PhotoAvatar() {
  return (
    <img
      src="/assets/avatar_only.png"
      alt=""
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      aria-label="profile photo"
    />
  );
}

// Official slice "friends" glyph (credit marketing card, Figma node 6571:59977
// → Cashback/Friends). Inlined so `currentColor` themes it — neutral dark in
// light, WHITE in dark — instead of a baked black that vanishes on a dark card.
// Native viewBox 20×18 renders at true size, centered in the 24px slot.
function InviteFriendsIcon() {
  return (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{ display: 'block' }}>
      <path d="M20 14.58C20 13.0447 18.9726 11.7106 17.5561 11.4141C16.9676 11.2871 16.7382 11.3506 16.7382 11.3506C15.7207 11.4247 14.7631 11.3506 13.8953 10.8C12.5187 9.93176 11.8005 8.64 11.7606 6.93529C11.7606 6.04588 11.0524 5.33647 10.2145 5.4L9.60598 5.44235C8.84788 5.49529 8.24938 6.17294 8.24938 6.97765V7.38C8.44888 10.9588 10.7232 13.9129 13.985 14.8341C14.1247 14.8765 14.1446 14.94 14.1446 15.0776C14.1446 16.8988 14.1446 15.3953 14.1446 17.2059C14.1446 17.6294 14.4738 17.9788 14.8728 17.9788C16.3491 17.9788 17.8155 17.9788 19.2918 17.9788C19.6808 17.9788 20 17.6294 20 17.2165C20 15.2365 20 16.56 20 14.58Z" fill="currentColor" />
      <path d="M7.09227 9.92118C6.88279 10.2071 6.96259 10.1224 6.70324 10.3553C6.18454 10.8106 5.56608 11.1282 4.90773 11.2765C4.1197 11.4565 3.31172 11.2659 2.51372 11.4141C1.82544 11.5518 1.15711 11.9012 0.698254 12.4835C0.259352 13.0341 0 13.7435 0 14.4635C0 16.5282 0 15.2471 0 17.3118C0 17.7459 0.239402 18 0.658354 18C2.16459 18 3.67082 18 5.16708 18C5.62593 18 5.84539 17.7671 5.85536 17.2694C5.85536 15.4482 5.85536 16.9518 5.85536 15.1306C5.85536 14.94 5.89526 14.8447 6.07481 14.8235C7.83042 14.6118 8.82793 13.3412 8.82793 13.3412C8.82793 13.3412 7.54115 12.24 7.10224 9.91059L7.09227 9.92118Z" fill="currentColor" />
      <path d="M17.5461 10.1753C18.9027 10.1753 20 9.01059 20 7.57059C20 6.13059 18.9027 4.96588 17.5461 4.96588C16.1895 4.96588 15.0923 6.13059 15.0923 7.57059C15.0923 9.01059 16.1895 10.1753 17.5461 10.1753Z" fill="currentColor" />
      <path d="M2.66334 10.1753C4.01995 10.1753 5.11721 9.01059 5.11721 7.57059C5.11721 6.13059 4.01995 4.96588 2.66334 4.96588C1.30673 4.96588 0.209476 6.13059 0.209476 7.57059C0.209476 9.01059 1.30673 10.1753 2.66334 10.1753Z" fill="currentColor" />
      <path d="M5.73566 4.28824C5.93516 4.5 6.19451 4.60588 6.45386 4.60588C6.71322 4.60588 6.95262 4.51059 7.15212 4.30941C7.55112 3.89647 7.5611 3.22941 7.17207 2.80588L5.82544 1.33412C5.43641 0.910588 4.80798 0.9 4.40898 1.31294C4.00997 1.72588 4 2.39294 4.38903 2.81647L5.73566 4.28824Z" fill="currentColor" />
      <path d="M13.187 4.61647C13.4464 4.61647 13.7057 4.51059 13.9052 4.29882L15.2519 2.82706C15.6409 2.40353 15.6309 1.73647 15.2319 1.32353C14.8329 0.910588 14.2045 0.921177 13.8155 1.34471L12.4688 2.81647C12.0798 3.24 12.0898 3.90706 12.4888 4.32C12.6783 4.52118 12.9377 4.61647 13.187 4.61647Z" fill="currentColor" />
      <path d="M9.86534 4.17176H9.88529C10.4239 4.17176 10.8728 3.70588 10.8828 3.13412L10.9227 1.08C10.9327 0.497647 10.4938 0.0105882 9.94514 0H9.92519C9.38653 0 8.93766 0.465882 8.92768 1.03765L8.88778 3.09176C8.87781 3.67412 9.31671 4.16118 9.86534 4.17176Z" fill="currentColor" />
    </svg>
  );
}

function SpendsCard() {
  return (
    <div
      style={{
        background: CARD_BG,
        border: CARD_BORDER,
        boxShadow: CARD_SHADOW,
        borderRadius: CARD_RADIUS,
        padding: CARD_PAD,
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Caption */}
        <div
          style={{
            fontFamily: 'Rubik, sans-serif',
            fontSize: 14,
            lineHeight: '20px',
            fontWeight: 500,
            letterSpacing: '0.28px',
            color: TEXT_TERTIARY,
          }}
        >
          Spends • 5 Jun - 4 Jul
        </div>

        {/* Display amount + 2 inline insight rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              fontFamily: 'Rubik, sans-serif',
              fontSize: 48,
              lineHeight: '56px',
              fontWeight: 500,
              letterSpacing: '-0.48px',
              color: TEXT_PRIMARY,
            }}
          >
            ₹1,00,550
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <InsightRow icon="/assets/credit_car.svg" w={13.33} h={12} text="Paid ₹370 to Uber" />
            <InsightRow icon="/assets/credit_bag.svg" w={13.33} h={13.33} text="Paid ₹180 to Sampath stores" />
          </div>
        </div>
      </div>

      {/* Invite-friend in-card callout */}
      <button
        type="button"
        style={{
          background: SLATE_10,
          borderRadius: CARD_RADIUS,
          padding: 16,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            width: 24,
            height: 24,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: TEXT_PRIMARY,
          }}
        >
          <InviteFriendsIcon />
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div
            style={{
              fontFamily: 'Rubik, sans-serif',
              fontSize: 14,
              lineHeight: '20px',
              fontWeight: 500,
              letterSpacing: '0.28px',
              color: TEXT_PRIMARY,
            }}
          >
            Invite a friend
          </div>
          <div
            style={{
              fontFamily: 'Rubik, sans-serif',
              fontSize: 12,
              lineHeight: '16px',
              fontWeight: 400,
              letterSpacing: '0.24px',
              color: TEXT_TERTIARY,
            }}
          >
            You have the power
          </div>
        </div>
      </button>
    </div>
  );
}

// Insight icons (car/store) are official slice glyphs whose native viewBox is
// SMALLER than the 16px icon slot (e.g. car 13.3×12). Earlier they were forced
// to width/height 16 with preserveAspectRatio="none" → stretched & oversized
// (user: "much bigger than the design"). Render each at its TRUE viewBox size,
// centered in a 16px slot, exactly like the canonical component.
function InsightRow({ icon, w, h, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span
        style={{
          width: 16,
          height: 16,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <img src={icon} alt="" width={w} height={h} style={{ display: 'block' }} />
      </span>
      <span
        style={{
          fontFamily: 'Rubik, sans-serif',
          fontSize: 14,
          lineHeight: '20px',
          fontWeight: 400,
          letterSpacing: '0.28px',
          color: TEXT_TERTIARY,
        }}
      >
        {text}
      </span>
    </div>
  );
}

function SuperCardPromo() {
  return (
    <div
      style={{
        background: CARD_BG,
        border: CARD_BORDER,
        boxShadow: CARD_SHADOW,
        borderRadius: CARD_RADIUS,
        padding: CARD_PAD,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div
          style={{
            fontFamily: 'Rubik, sans-serif',
            fontSize: 20,
            lineHeight: '24px',
            fontWeight: 500,
            letterSpacing: '0.4px',
            color: TEXT_PRIMARY,
          }}
        >
          Meet your slice<br />super card
        </div>
        <div
          style={{
            fontFamily: 'Rubik, sans-serif',
            fontSize: 12,
            lineHeight: '16px',
            fontWeight: 400,
            letterSpacing: '0.24px',
            color: TEXT_SECONDARY,
          }}
        >
          Discover the benefits
        </div>
      </div>
      <img
        src="/assets/super_card_mascot.png"
        alt=""
        width={108}
        height={108}
        style={{ flexShrink: 0, objectFit: 'contain' }}
      />
    </div>
  );
}

export default function CreditL0({ onScrollChange }) {
  const scrollRef = useRef(null);
  const scrolled = usePageScroll(scrollRef);
  const { push } = useL1();
  // R24 cont-13: lift scroll state so App.jsx's status reserve paints white.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onScrollChange?.(scrolled); }, [scrolled]); // dep [scrolled] only — R24 cont-24 audit

  return (
    <div
      ref={scrollRef}
      style={{
        width: '100%',
        height: '100%',
        background: PAGE_BG,
        fontFamily: 'Rubik, sans-serif',
        overflowY: 'auto',
        overflowX: 'hidden',
        touchAction: 'pan-y', // horizontal swipe → Pager on touch (see cont-38)
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar
        scroll={scrolled}
        variant="l0"
        title="Credit"
        avatar={<PhotoAvatar />}
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
        <SpendsCard />
        <SuperCardPromo />
      </div>
    </div>
  );
}
