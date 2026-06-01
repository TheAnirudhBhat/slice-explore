// Profile L1 — canonical per Figma node 2486:75064 (PNUz3Dr9KSlFJSnsXsC0nL).
//
// Canonical anatomy:
//   • App bar Standard: 64px row with X close icon (24×24 in 48 hit area) on
//     left; no title; no trailing actions.
//   • Content (vertical, gap 24, 16px top padding):
//       — Profile section (centered, gap 16):
//           ◦ 128×128 photo avatar with 1px subtle outline-bold border
//           ◦ Name "Nupur Mathur" (20/24 Medium primary, centered)
//           ◦ Phone "+91 8789127654" (14/20 Regular tertiary, centered)
//       — Primary CTA "Invite & earn ₹150" (V-500 button, full width minus
//         24px page padding, 16/24 Medium white text)
//       — Menu list (4px gap between items, no dividers):
//           ◦ Action centre
//           ◦ UPI settings
//           ◦ Pricing
//           ◦ App Settings
//           ◦ Help & support
//           ◦ About
//         Each row: 24px hor padding, 16px vert padding, 12px gap between
//         leading-icon (24×24) and label (16/24 Regular primary). Max height
//         72px per row.
//       — Footer (centered, gap 8):
//           ◦ "Version 14.5.0(80867)" (12/16 Regular tertiary)
//           ◦ "Last login · 23 Jan '26 11:18:04 IST" (12/16 Regular tertiary)

import React, { useRef } from 'react';
import { AppBar, usePageScroll } from '../../components/AppBar.jsx';
import Avatar from '../../components/Avatar.jsx';
import { useL1 } from '../../components/L1Stack.jsx';
import { V_500, TEXT_PRIMARY, TEXT_TERTIARY, PAGE_BG } from '../../tokens.js';

const PAGE_PAD = 24;

function CloseGlyph() {
  // Canonical glyph is 14×14 inside a 24×24 hit-area. Wrapper centers the
  // natural-size image so aspect ratio isn't stretched.
  return (
    <div
      style={{
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-hidden="true"
    >
      {/* Masked official close glyph → recolours with the theme (white in dark). */}
      <div
        style={{
          width: 14,
          height: 14,
          backgroundColor: TEXT_PRIMARY,
          WebkitMaskImage: 'url(/assets/icons/profile_close.svg)',
          maskImage: 'url(/assets/icons/profile_close.svg)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
      />
    </div>
  );
}

function MenuRow({ icon, iconW, iconH, label, onTap }) {
  // Icon wrapper is a fixed 24×24 box; the actual img uses the icon's NATIVE
  // viewBox size so the glyph isn't stretched (different icons have different
  // canonical aspect ratios — settings is 20×18, upi is 18×11, etc.).
  return (
    <button
      onClick={onTap}
      style={{
        width: '100%',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        padding: `16px ${PAGE_PAD}px`,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        maxHeight: 72,
        textAlign: 'left',
      }}
      aria-label={label}
    >
      <div
        style={{
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {/* Official icon used as a CSS mask so it RECOLOURS with the theme. The
           source SVGs fill `var(--fill-0, black)` → via <img> they fell back to
           black and vanished in dark. Masking keeps the exact official shape and
           paints it with a themed token: tertiary = white-50% in dark. */}
        <div
          style={{
            width: iconW,
            height: iconH,
            backgroundColor: TEXT_TERTIARY,
            WebkitMaskImage: `url(${icon})`,
            maskImage: `url(${icon})`,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
          }}
        />
      </div>
      <span
        style={{
          flex: 1,
          fontFamily: 'Rubik, sans-serif',
          fontWeight: 400,
          fontSize: 16,
          lineHeight: '24px',
          letterSpacing: '0.32px',
          color: TEXT_PRIMARY,
        }}
      >
        {label}
      </span>
    </button>
  );
}

// Each icon's natural viewBox dimensions per the Figma exports (different
// aspect ratios — square, wider, taller). Setting img width/height to these
// preserves aspect ratio inside the 24×24 wrapper.
const MENU = [
  { id: 'action-centre', label: 'Action centre',   icon: '/assets/icons/profile_action_centre.svg', iconW: 18, iconH: 18 },
  { id: 'upi',           label: 'UPI settings',    icon: '/assets/icons/profile_upi_settings.svg',  iconW: 18, iconH: 11 },
  { id: 'pricing',       label: 'Pricing',         icon: '/assets/icons/profile_pricing.svg',       iconW: 18, iconH: 20 },
  { id: 'app-settings',  label: 'App Settings',    icon: '/assets/icons/profile_settings.svg',      iconW: 20, iconH: 18 },
  { id: 'help',          label: 'Help & support',  icon: '/assets/icons/profile_help.svg',          iconW: 18, iconH: 18 },
  { id: 'about',         label: 'About',           icon: '/assets/icons/profile_about.svg',         iconW: 18, iconH: 18 },
];

export default function ProfileL1({ onClose }) {
  const scrollRef = useRef(null);
  const scrolled = usePageScroll(scrollRef);
  const { push } = useL1();

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: PAGE_BG,
      }}
    >
      <div
        ref={scrollRef}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
          fontFamily: 'Rubik, sans-serif',
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Reserve for the fixed status bar overlay */}
        <div style={{ height: 54, flexShrink: 0 }} />

        <AppBar
          scroll={scrolled}
          variant="standard"
          title={null}
          leading={<CloseGlyph />}
          onBack={onClose}
          actions={[]}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
            paddingTop: 16,
            paddingBottom: 32,
          }}
        >
          {/* Profile section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              padding: `0 ${PAGE_PAD}px`,
              width: '100%',
            }}
          >
            <Avatar size={128} photo="/assets/avatar_only.png" tone="subtle" ariaLabel="profile photo" />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                textAlign: 'center',
                width: '100%',
              }}
            >
              <div
                style={{
                  fontFamily: 'Rubik, sans-serif',
                  fontWeight: 500,
                  fontSize: 20,
                  lineHeight: '24px',
                  letterSpacing: '0.4px',
                  color: TEXT_PRIMARY,
                }}
              >
                Nupur Mathur
              </div>
              <div
                style={{
                  fontFamily: 'Rubik, sans-serif',
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: '20px',
                  letterSpacing: '0.28px',
                  color: TEXT_TERTIARY,
                }}
              >
                +91 8789127654
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <button
            style={{
              width: `calc(100% - ${PAGE_PAD * 2}px)`,
              background: V_500,
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 100,
              padding: '12px 24px',
              fontFamily: 'Rubik, sans-serif',
              fontWeight: 500,
              fontSize: 16,
              lineHeight: '24px',
              letterSpacing: '0.32px',
              cursor: 'pointer',
              outline: 'none',
              marginLeft: PAGE_PAD,
              marginRight: PAGE_PAD,
            }}
            aria-label="invite and earn"
          >
            Invite & earn ₹150
          </button>

          {/* Menu list */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {MENU.map((item) => (
              <MenuRow
                key={item.id}
                icon={item.icon}
                iconW={item.iconW}
                iconH={item.iconH}
                label={item.label}
                onTap={item.id === 'app-settings' ? () => push('appSettings') : undefined}
              />
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'Rubik, sans-serif',
                fontWeight: 400,
                fontSize: 12,
                lineHeight: '16px',
                letterSpacing: '0.24px',
                color: TEXT_TERTIARY,
              }}
            >
              Version 14.5.0(80867)
            </div>
            <div
              style={{
                fontFamily: 'Rubik, sans-serif',
                fontWeight: 400,
                fontSize: 12,
                lineHeight: '16px',
                letterSpacing: '0.24px',
                color: TEXT_TERTIARY,
              }}
            >
              Last login · 23 Jan '26 11:18:04 IST
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
