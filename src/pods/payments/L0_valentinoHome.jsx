// Payments L0 — "Valentino home" — canonical per Figma node 885:19901
// (PNUz3Dr9KSlFJSnsXsC0nL · cal:2026-05-29 R23 rewrite).
//
// Canonical anatomy (top to bottom):
//   1. Status bar (rendered globally by App.jsx as fixed overlay)
//   2. App bar — 64px row:
//        LEFT  : "Check balance" pill (transparent bg + white-20 border, 14/20 Regular)
//        RIGHT : audio/voice icon (40×40 white-20 border circle) + photo avatar
//   3. Top Section (centered, flex-1):
//        — ₹0 Display Large (80/96 Regular, -0.8px letter-spacing)
//        — UPI ID pill: BHIM-UPI logo + "ID: rajan@sliceaxis" + chevron-right
//          (white-10 bg, 16/8 padding, 24px radius)
//   4. Bottom Section (anchored, 16px gap between rows):
//        — Custom keypad (4 rows × 3 cols, 20/24 Medium digits, 72px gap between cols)
//        — Request | Transfer button row (white-20 bg, 16/24 Medium, equal flex)
//   5. Bottom nav (rendered by App.jsx)

import React, { useState } from 'react';
import { useL1 } from '../../components/L1Stack.jsx';
import Avatar from '../../components/Avatar.jsx';
import formatINR from '../../utils/formatINR.js';

import { BRAND_BG, WHITE_10, WHITE_20, WHITE_30 } from '../../tokens.js';

const USER_AVATAR_URL = '/assets/avatar_only.png';
const UPI_ID = 'rajan@sliceaxis';

const KEYPAD = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'backspace'],
];

function fontSizeForAmount(amountStr) {
  const digits = String(amountStr).split('.')[0].replace(/\D/g, '').length;
  if (digits <= 3) return 80;
  if (digits === 4) return 72;
  if (digits === 5) return 64;
  if (digits === 6) return 56;
  return 48;
}

function AppBar({ onAvatarTap }) {
  // Canonical per Figma node 885:19901 — `pl-16 pr-20 py-8` row, total ~64px.
  // LEFT: Check balance pill — 1px white-20 border, padding 8px/16px, 14/20 R.
  // RIGHT (gap 8): 48px hit-area wrapping a 40×40 audio circle with 1px
  // white-30 border, then 48px hit-area wrapping a 40×40 avatar with 1px
  // white-30 border. R23 fix-it-2-cont-6 — exact canonical sizes restored
  // (was 52h / 36×36 in earlier round).
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 20,
        paddingTop: 8,
        paddingBottom: 8,
      }}
    >
      <button
        style={{
          background: 'transparent',
          border: `1px solid ${WHITE_20}`,
          color: '#FFFFFF',
          padding: '8px 16px',
          borderRadius: 100,
          fontFamily: 'Rubik, sans-serif',
          fontWeight: 400,
          fontSize: 14,
          lineHeight: '20px',
          letterSpacing: '0.28px',
          cursor: 'pointer',
          outline: 'none',
        }}
        aria-label="check balance"
      >
        Check balance
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Audio: 48 hit-area + 40 inner circle with white-30 border */}
        <button
          style={{
            width: 48,
            height: 48,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="voice input"
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: `1px solid ${WHITE_30}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src="/assets/valentino_audio_icon.svg" alt="" width={20} height={20} />
          </div>
        </button>

        {/* Avatar: 48 hit-area + 44 inner photo, NO ring — shared Avatar at the
           `plain` tone. Tap opens Profile L1. */}
        <Avatar size={44} photo={USER_AVATAR_URL} hit onTap={onAvatarTap} ariaLabel="profile" />
      </div>
    </div>
  );
}

function AmountHero({ amount }) {
  const formatted = formatINR(amount);
  const fontSize = fontSizeForAmount(amount);
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        minHeight: 0,
      }}
    >
      {/* ₹0 Display Large — 80/96 Regular, -0.8 letter-spacing */}
      <div
        style={{
          fontFamily: 'Rubik, sans-serif',
          fontWeight: 400,
          fontSize,
          lineHeight: '96px',
          letterSpacing: '-0.8px',
          color: '#FFFFFF',
          whiteSpace: 'nowrap',
          transition: 'font-size 220ms cubic-bezier(0.25,0.1,0.25,1)',
        }}
      >
        ₹{formatted}
      </div>
      {/* UPI ID pill — BHIM UPI mark + ID + chevron */}
      <button
        style={{
          background: WHITE_10,
          padding: '8px 16px',
          borderRadius: 24,
          border: 'none',
          cursor: 'pointer',
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
        aria-label="UPI ID"
      >
        {/* UPI mark. PLACEHOLDER (dummy) until the user's exact image is dropped
           in at public/assets/upi_pill.png — overwrite that file and it renders
           AS-IS (no trace, no processing). Pasted-inline images aren't written
           to disk, so the file must live in the repo to be used. */}
        <img
          src="/assets/upi_pill.png"
          alt="UPI"
          style={{ height: 12, width: 'auto', display: 'block', pointerEvents: 'none', userSelect: 'none' }}
        />
        <span
          style={{
            fontFamily: 'Rubik, sans-serif',
            fontWeight: 400,
            fontSize: 12,
            lineHeight: '16px',
            letterSpacing: '0.24px',
            color: '#FFFFFF',
          }}
        >
          ID: {UPI_ID}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4 2L8 6L4 10" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

function KeypadKey({ value, onTap }) {
  const isBackspace = value === 'backspace';
  return (
    <button
      onClick={() => onTap(value)}
      style={{
        width: 48,
        height: 48,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        WebkitTapHighlightColor: 'transparent',
      }}
      aria-label={isBackspace ? 'backspace' : value}
      className="slice-keypad-key"
    >
      {isBackspace ? (
        // Backspace = chevron rotated to point left, white
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 6L9 12L15 18"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : value === '.' ? (
        <span style={{ fontFamily: 'Rubik, sans-serif', fontSize: 24, color: '#FFFFFF', lineHeight: 1 }}>
          •
        </span>
      ) : (
        <span
          style={{
            fontFamily: 'Rubik, sans-serif',
            fontWeight: 500,
            fontSize: 20,
            lineHeight: '24px',
            letterSpacing: '0.4px',
            color: '#FFFFFF',
          }}
        >
          {value}
        </span>
      )}
    </button>
  );
}

function Keypad({ onTap }) {
  // Per canonical Figma node 885:19901 + R23 fix-it-2 user direction: keypad
  // rows respect the SAME horizontal margin (24px) as the Request|Transfer
  // row below — 3 keys distributed via `space-between` across the full width
  // minus 24px gutters, so the leftmost (1/4/7/.) sits on the same vertical
  // axis as the left edge of the Request pill, and the rightmost (3/6/9/⌫)
  // sits on the right edge of the Transfer pill.
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '100%',
      }}
    >
      {KEYPAD.map((row, ri) => (
        <div
          key={ri}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            // R23 fix-it-2-cont-9: user direction — "the margin on the keypad
            // should be 12 instead of 8". So 24px page gutter + 12px breathing
            // = 36px each side. Tighter cluster, same canonical-aligned rule.
            padding: '0 36px',
          }}
        >
          {row.map((key, i) => (
            <KeypadKey key={`${ri}-${i}`} value={key} onTap={onTap} />
          ))}
        </div>
      ))}
    </div>
  );
}

function RequestTransferRow() {
  // Below the keypad. Both buttons share the row equally (flex 1 each).
  return (
    <div style={{ display: 'flex', gap: 16, padding: '0 24px', width: '100%' }}>
      <button
        style={{
          flex: 1,
          background: WHITE_20,
          color: '#FFFFFF',
          border: 'none',
          padding: '12px 24px',
          borderRadius: 100,
          fontFamily: 'Rubik, sans-serif',
          fontWeight: 500,
          fontSize: 16,
          lineHeight: '24px',
          letterSpacing: '0.32px',
          cursor: 'pointer',
          outline: 'none',
        }}
        aria-label="request money"
      >
        Request
      </button>
      <button
        style={{
          flex: 1,
          background: WHITE_20,
          color: '#FFFFFF',
          border: 'none',
          padding: '12px 24px',
          borderRadius: 100,
          fontFamily: 'Rubik, sans-serif',
          fontWeight: 500,
          fontSize: 16,
          lineHeight: '24px',
          letterSpacing: '0.32px',
          cursor: 'pointer',
          outline: 'none',
        }}
        aria-label="transfer money"
      >
        Transfer
      </button>
    </div>
  );
}

export default function L0ValentinoHome({ onScrollChange }) {
  // eslint-disable-next-line no-unused-vars
  const _ = onScrollChange; // R24 cont-13: Pay/Valentino is immersive (no scroll-elevation chrome) — accept and ignore.
  const [amount, setAmount] = useState('0');
  const { push } = useL1();

  const handleKey = (key) => {
    setAmount((prev) => {
      if (key === 'backspace') {
        if (prev.length <= 1) return '0';
        return prev.slice(0, -1);
      }
      if (key === '.') {
        if (prev.includes('.')) return prev;
        return prev + '.';
      }
      if (prev === '0') return key;
      const [intPart, decPart] = prev.split('.');
      if (decPart === undefined) {
        const proposed = Number(intPart + key);
        if (proposed > 5000000) return prev; // ₹50,00,000 cap
        if ((intPart + key).length > 7) return prev;
      }
      return prev + key;
    });
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: BRAND_BG,
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 140, // floating bottom nav reserve
      }}
    >
      <AppBar onAvatarTap={() => push('profile')} />
      <AmountHero amount={amount} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          paddingBottom: 8,
        }}
      >
        <Keypad onTap={handleKey} />
        <RequestTransferRow />
      </div>
    </div>
  );
}
