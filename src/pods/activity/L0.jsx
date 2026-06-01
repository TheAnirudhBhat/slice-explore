// Activity L0 — canonical per Figma node 885:20122 (PNUz3Dr9KSlFJSnsXsC0nL · R23 fix-it).
//
// Canonical anatomy:
//   1. App bar L0 — "Activity" H2 + photo Avatar trailing (NO eye toggle)
//   2. Search row — search input (rounded pill, slate-10 bg, 48h) + 48×48 filter pill
//      (sits BELOW the app bar, scrolls WITH the list per Figma)
//   3. Flat transaction list — each row 56-72px, no section headers in this state
//      (canonical state shows undated/mixed; section headers are an opt-in)
//        — 40×40 avatar (photo / initial monogram / icon variant)
//        — name (16/24 Regular primary)
//        — date subtitle (12/16 Regular secondary) — OR status subtitle for failed/pending
//        — right-aligned amount (16/24 Regular)
//          • primary for sent/debit
//          • Positive Green for received/cashback/interest
//          • Negative Red for failed
//          • Amber-700 for pending
//   4. Bottom fade overlay (transparent → white) above floating nav.
//
// R23 fix-it pass:
//   • Search row hoisted to a sticky position below the app bar so it stays visible.
//   • Bottom fade re-implemented as proper absolute overlay (no flex/order hacks).
//   • Failed/pending avatars now use canonical pattern: regular avatar + small
//     status badge bottom-right + status-colored subtitle (instead of jarring
//     full-red-circle / amber-ring-only avatars).

import React, { useEffect, useRef } from 'react';
import { AppBar, usePageScroll } from '../../components/AppBar.jsx';
import BottomFade from '../../components/BottomFade.jsx';
import { useL1 } from '../../components/L1Stack.jsx';
import Avatar from '../../components/Avatar.jsx';
import { TrendUpIcon, RecurringIcon } from '../../icons/ActivityIcons.jsx';
import formatINR from '../../utils/formatINR.js';
import useTapGuard from '../../utils/useTapGuard.js';
import {
  WHITE, PAGE_BG, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, OUTLINE_SUBTLE,
  V_500, V_100, V_50, POSITIVE, POSITIVE_50, NEGATIVE, NEGATIVE_50,
  AMBER, AMBER_50, AMBER_700, BLUE_500, SLATE_10, SLATE_30, SLATE_100, SLATE_400, SLATE_900,
} from '../../tokens.js';

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

// ───────────────── tokens ─────────────────
const COLORS = {
  pageBg: PAGE_BG,
  textPrimary: TEXT_PRIMARY,
  textSecondary: TEXT_SECONDARY,
  textTertiary: TEXT_TERTIARY,
  outlineSubtle: OUTLINE_SUBTLE,
  v500: V_500,
  v100: V_100,
  v50: V_50,
  positive: POSITIVE,
  positive50: POSITIVE_50,
  negative: NEGATIVE,
  negative50: NEGATIVE_50,
  amber: AMBER,
  amber50: AMBER_50,
  amber700: AMBER_700,
  blue: BLUE_500,
  slate10: SLATE_10,
  slate30: SLATE_30,
  slate100: SLATE_100,
  slate400: SLATE_400,
  slate900: SLATE_900,
  white: WHITE,
};

// ───────────────── mock transactions ─────────────────
// Per Figma list-item states (node 6577:60247) + mixed-avatar list (6577:60417):
//   type:   'sent' | 'received' | 'failed' | 'pending' | 'requested'
//           — sets the right-side amount colour + the status line UNDER it.
//             The left subtitle is ALWAYS "<date> · UPI" (status never goes there).
//   avatar: { kind:'photo', src } | { kind:'icon', glyph:'trendup'|'recurring' }
//           | { kind:'mono', letter, fg? }   (fg overrides the grey letter, e.g. brand-red)
const TXNS = [
  { id: 't1',  name: 'Aman Saxena',         date: 'Today',      amount: 250,   type: 'sent',      avatar: { kind: 'photo', src: '/assets/avatar_only.png' } },
  { id: 't2',  name: 'Deepika Jain',        date: '24 Jan ‘26', amount: 1200,  type: 'received',  avatar: { kind: 'photo', src: '/assets/contact_deepika.png' } },
  { id: 't3',  name: 'Dec savings interest',date: '21 Jan ‘26', amount: 0.05,  type: 'received',  avatar: { kind: 'icon',  glyph: 'trendup' } },
  { id: 't4',  name: 'Sunny Shop',          date: '23 Jan ‘26', amount: 18,    type: 'sent',      avatar: { kind: 'mono',  letter: 'S' } },
  { id: 't5',  name: 'Jan fires',           date: '20 Jan ‘26', amount: 129,   type: 'received',  avatar: { kind: 'icon',  glyph: 'recurring' } },
  { id: 't6',  name: 'BluSmart',            date: '23 Jan ‘26', amount: 387,   type: 'failed',    avatar: { kind: 'mono',  letter: 'B' } },
  { id: 't7',  name: 'Help Mate Service',   date: '20 Jan ‘26', amount: 18450, type: 'sent',      avatar: { kind: 'mono',  letter: 'H' } },
  { id: 't8',  name: 'Karan Verma',         date: '22 Jan ‘26', amount: 5000,  type: 'pending',   avatar: { kind: 'mono',  letter: 'K' } },
  { id: 't9',  name: 'Zomato',              date: '20 Jan ‘26', amount: 419,   type: 'sent',      avatar: { kind: 'mono',  letter: 'Z', fg: NEGATIVE } },
  { id: 't10', name: 'Riya Mehta',          date: '18 Jan ‘26', amount: 800,   type: 'requested', avatar: { kind: 'mono',  letter: 'R' } },
  { id: 't11', name: 'Dec fires',           date: '31 Dec ‘25', amount: 129,   type: 'received',  avatar: { kind: 'icon',  glyph: 'recurring' } },
  { id: 't12', name: 'Amazon Pay',          date: '18 Jan ‘26', amount: 2499,  type: 'sent',      avatar: { kind: 'mono',  letter: 'A' } },
  { id: 't13', name: 'Vikas Tiwari',        date: '17 Jan ‘26', amount: 350,   type: 'failed',    avatar: { kind: 'mono',  letter: 'V' } },
  { id: 't14', name: 'Meera Pillai',        date: '10 Jan ‘26', amount: 600,   type: 'requested', avatar: { kind: 'mono',  letter: 'M' } },
];

// avatar renderer — photo (no ring) / official income icon / grey-letter monogram,
// all on the white DLS chip. NO outline ring on photos (user: "we don't keep
// these with an outline ever").
function TxnAvatar({ avatar }) {
  if (avatar.kind === 'photo') {
    return <Avatar size={40} tone="plain" photo={avatar.src} />;
  }
  if (avatar.kind === 'icon') {
    return (
      <Avatar size={40} tone="chip">
        {avatar.glyph === 'trendup' ? <TrendUpIcon size={20} /> : <RecurringIcon size={20} />}
      </Avatar>
    );
  }
  return <Avatar size={40} tone="chip" initial={avatar.letter} fg={avatar.fg} />;
}

// ───────────────── icons ─────────────────
const SearchIcon = ({ size = 20, color = COLORS.textTertiary }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="6.25" stroke={color} strokeWidth="1.8" />
    <path d="M13.5 13.5L17 17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const FilterIcon = ({ size = 20, color = COLORS.textPrimary }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M3 5h14M5.5 10h9M8 15h4"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

// Search row — sticky just below the app bar so it remains visible while the
// txn list scrolls under it. Per canonical Figma it lives at top of the txn list.
function SearchBarRow() {
  return (
    <div
      style={{
        padding: '8px 24px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: COLORS.pageBg,
      }}
    >
      <label
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: COLORS.pageBg,
          border: `2px solid ${COLORS.outlineSubtle}`,
          borderRadius: 100,
          padding: '0 16px',
          height: 48,
        }}
      >
        <SearchIcon size={20} color={COLORS.textTertiary} />
        <input
          type="text"
          placeholder="Search"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'Rubik, sans-serif',
            fontSize: 14,
            lineHeight: '20px',
            letterSpacing: '0.28px',
            color: COLORS.textPrimary,
            minWidth: 0,
          }}
        />
      </label>
      <button
        type="button"
        style={{
          width: 48,
          height: 48,
          borderRadius: 100,
          background: COLORS.pageBg,
          border: `2px solid ${COLORS.outlineSubtle}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
        }}
        aria-label="filter"
      >
        <FilterIcon size={20} color={COLORS.textPrimary} />
      </button>
    </div>
  );
}

// ───────────────── transaction row ─────────────────
// Per Figma states (node 6577:60247): amount colour by type, and the STATUS word
// (Failed / Pending / Requested) sits on the RIGHT, UNDER the amount — never as
// the left subtitle. Left subtitle is always "<date> · UPI".
const AMOUNT_STATE = {
  sent:      { color: COLORS.textPrimary,  status: null },
  received:  { color: COLORS.positive,     status: null },
  failed:    { color: COLORS.textTertiary, status: 'Failed',    statusColor: COLORS.negative },
  pending:   { color: COLORS.textTertiary, status: 'Pending',   statusColor: COLORS.textSecondary },
  requested: { color: COLORS.textPrimary,  status: 'Requested', statusColor: COLORS.blue },
};

function TxnRow({ txn, onTap }) {
  const a = AMOUNT_STATE[txn.type] || AMOUNT_STATE.sent;
  const subtitleText = `${txn.date} · UPI`;

  // Tap-vs-drag guard: rows sit on the L0 pager, so a swipe must NOT fire a tap
  // and open the txn detail. Shared hook (was a duplicated inline guard — cont-37
  // code-review dedupe; the hook was originally extracted FROM this row).
  const tap = useTapGuard(() => onTap && onTap(txn));
  return (
    <button
      {...tap}
      style={{
        width: '100%',
        // R24 cont-19: padding from the actual published variant — pulled
        // List item/Transaction (key 57e2a21c6b1758903b732050281bfb146cc1a4fd,
        // node 796:27298) from DLS 2.0 library. visualSpec.layout says
        // paddingTop/Bottom 16, paddingLeft/Right 24, itemSpacing 12,
        // counterAxisAlign CENTER, bounds 360×76. No more guessing — this is
        // the canonical row.
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: COLORS.pageBg,
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        font: 'inherit',
        touchAction: 'pan-y', // allow horizontal swipe to bubble to Pager
      }}
      aria-label={`transaction ${txn.name}`}
    >
      <TxnAvatar avatar={txn.avatar} />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        {/* left: name (Body Normal regular) + "<date> · UPI" subtitle */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div
            style={{
              fontFamily: 'Rubik, sans-serif',
              fontSize: 16,
              lineHeight: '24px',
              fontWeight: 400,
              letterSpacing: '0.32px',
              color: COLORS.textPrimary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {txn.name}
          </div>
          <div
            style={{
              fontFamily: 'Rubik, sans-serif',
              fontSize: 12,
              lineHeight: '16px',
              fontWeight: 400,
              letterSpacing: '0.24px',
              color: COLORS.textSecondary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {subtitleText}
          </div>
        </div>
        {/* right: amount + optional status word (Failed / Pending / Requested) */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div
            style={{
              fontFamily: 'Rubik, sans-serif',
              fontSize: 16,
              lineHeight: '24px',
              fontWeight: 400,
              letterSpacing: '0.32px',
              color: a.color,
              whiteSpace: 'nowrap',
            }}
          >
            ₹{formatINR(txn.amount)}
          </div>
          {a.status && (
            <div
              style={{
                fontFamily: 'Rubik, sans-serif',
                fontSize: 12,
                lineHeight: '16px',
                fontWeight: 500,
                letterSpacing: '0.24px',
                color: a.statusColor,
                whiteSpace: 'nowrap',
              }}
            >
              {a.status}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

// ───────────────── page ─────────────────
export default function ActivityL0({ onScrollChange }) {
  const scrollRef = useRef(null);
  const scrolled = usePageScroll(scrollRef);
  const { push } = useL1();
  // R24 cont-13: lift scroll state so App.jsx's status reserve paints white.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onScrollChange?.(scrolled); }, [scrolled]); // dep [scrolled] only — R24 cont-24 audit

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div
        ref={scrollRef}
        style={{
          width: '100%',
          height: '100%',
          background: COLORS.pageBg,
          fontFamily: 'Rubik, sans-serif',
          overflowY: 'auto',
          overflowX: 'hidden',
          overscrollBehaviorY: 'none', // no vertical rubber-band (user, 2026-06-02)
          touchAction: 'pan-y', // horizontal swipe → Pager on touch (see cont-38)
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AppBar
          scroll={scrolled}
          variant="l0"
          title="Activity"
          avatar={<PhotoAvatar />}
          onAvatarTap={() => push('profile')}
          background="var(--page-bg)"
        />
        <SearchBarRow />
        <div style={{ paddingBottom: 140 }}>
          {TXNS.map((t) => (
            <TxnRow
              key={t.id}
              txn={t}
              onTap={(txn) =>
                push('txnDetail', {
                  txn: {
                    name: txn.name,
                    amount: txn.amount,
                    state:
                      txn.type === 'received' ? 'success' :
                      txn.type === 'failed' ? 'failed' :
                      txn.type === 'pending' || txn.type === 'requested' ? 'pending' :
                      'success',
                    label:
                      txn.type === 'received' ? `received from ${txn.name}` :
                      txn.type === 'failed' ? `payment to ${txn.name} failed` :
                      txn.type === 'pending' ? `request to ${txn.name} pending` :
                      txn.type === 'requested' ? `requested from ${txn.name}` :
                      `sent to ${txn.name}`,
                    fromLabel: txn.type === 'received' ? `From ${txn.name}` : `To ${txn.name}`,
                    timestamp: `${txn.date}, 9:41 am`,
                    txnId: `Ax${Date.now().toString().slice(-10)}${Math.floor(Math.random() * 1e9).toString(16)}`,
                    sourceLabel: 'From slice savings',
                    sourceValue: 'xxx1234',
                    detailLabel: 'UPI reference',
                    detailValue: `0D${Date.now().toString().slice(-13)}${Math.floor(Math.random() * 1e6)}`,
                  },
                })
              }
            />
          ))}
        </div>
      </div>
      <BottomFade color={COLORS.pageBg} height={200} bottom={12} />
    </div>
  );
}
