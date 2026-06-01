// Transaction Detail L1 — canonical per Figma AVC-2025 node 2410:22541
// (light "Deposit payment · Success" variant — file KXA1BbYZvzygD1XUOTIwUa).
//
// Canonical anatomy (light mode):
//   1. App bar Standard: chevron back left only. No title. No trailing action.
//   2. Hero (24px page padding, left-aligned, top):
//        — LEFT column: ₹amount + label (e.g. "deposit payment" / "sent to {name}").
//          Display H2 24/32 Medium primary, 2 lines.
//        — RIGHT: 32-40px state badge (green circle + checkmark for success,
//          amber for pending, red for failed).
//        — Sub-row: "From {source}" (14/20 Regular primary).
//        — Timestamp: "DD Mon 'YY, HH:MM am/pm" (12/16 Regular tertiary).
//   3. 8px bold divider (full-width slate-30).
//   4. Details section (24px page padding):
//        — Header row: "Details" (16/20 M primary) + "Share" (16/20 M V-500).
//        — Detail rows (each with title on top + value below, trailing
//          action icon on right):
//          • Transaction ID — copy icon trailing
//          • From slice savings — chevron-right
//          • Deposit details — chevron-right
//   5. 8px divider.
//   6. Notes section: "Add extra notes" placeholder.
//   7. 8px divider.
//   8. "Contact us" centered V-500 link.
//
// State variants (badge + amount color):
//   sent       → no badge / slate-down arrow, amount text-primary
//   received   → green checkmark badge, amount positive green
//   failed     → red X badge, amount negative red, "Try again" CTA in footer
//   pending    → amber clock badge, amount amber-700, "Awaiting" copy
//   success    → green checkmark badge, amount text-primary (default deposit-like flow)

import React, { useRef } from 'react';
import { AppBar, usePageScroll } from '../../components/AppBar.jsx';
import { ChevronBackGlyph } from '../../icons/ChevronBack.jsx';
import formatINR from '../../utils/formatINR.js';
import { TEXT_PRIMARY, TEXT_TERTIARY, OUTLINE_SUBTLE, V_500, POSITIVE, NEGATIVE, AMBER, SLATE_30, PAGE_BG } from '../../tokens.js';

const PAGE_PAD = 24;

function ChevronRightGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M7.5 4L13 10L7.5 16"
        stroke={TEXT_TERTIARY}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyGlyph() {
  // R24 cont-15: canonical slice DLS 2.0 Copy icon (General/Copy, file
  // ncGqxiE6wUOqgOURwHx6Hp node 586:128). Inlined from the published library
  // export with fill→TEXT_TERTIARY so it reads correctly inside the detail-
  // row trailing slot. Was previously an inline stroke approximation that
  // didn't match the canonical filled glyph.
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.1133 13.7734C17.5545 13.7736 13.8398 17.4966 13.8398 22.0664V33.707C13.8398 38.2769 17.5545 41.9998 22.1133 42L33.7266 42C38.2855 42 42 38.277 42 33.707L42 22.0664C42 17.4965 38.2855 13.7734 33.7266 13.7734H22.1133ZM33.7266 18.7363C35.5541 18.7363 37.0488 20.2345 37.0488 22.0664V33.707C37.0488 35.5389 35.5541 37.0352 33.7266 37.0352H22.1133C20.2859 37.035 18.793 35.5388 18.793 33.707L18.793 22.0664C18.793 20.2346 20.2859 18.7365 22.1133 18.7363L33.7266 18.7363Z"
        fill={TEXT_TERTIARY}
      />
      <path
        d="M20.6797 6C12.5836 6 6 12.5992 6 20.7148L6 28.1602C6 29.5193 7.10114 30.623 8.45703 30.623C9.8126 30.6227 10.9121 29.5191 10.9121 28.1602V20.7148C10.9121 15.3176 15.2954 10.9238 20.6797 10.9238H28.1074C29.4629 10.9236 30.5622 9.82162 30.5625 8.46289C30.5625 7.1039 29.4631 6.00028 28.1074 6L20.6797 6Z"
        fill={TEXT_TERTIARY}
      />
    </svg>
  );
}

function StateBadge({ state }) {
  // R24 cont-5: match canonical AVC-2025 badge (Figma node 2410:39712). The
  // canonical badge has a halo: outer ring at low-opacity state color (~25%)
  // surrounding a smaller solid inner circle with a white glyph. Sizes:
  //   • halo outer 60px (positive 25% green)
  //   • inner solid 40px (positive 100% green)
  //   • ring thickness 10px each side
  //   • glyph 22px white check
  // Same scaling applied to failed (red) and pending (amber) variants.
  const halo = 60;
  const inner = 40;
  const renderBadge = (haloColor, innerColor, glyph) => (
    <div
      style={{
        width: halo,
        height: halo,
        borderRadius: '50%',
        background: haloColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <div
        style={{
          width: inner,
          height: inner,
          borderRadius: '50%',
          background: innerColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {glyph}
      </div>
    </div>
  );

  if (state === 'received' || state === 'success') {
    return renderBadge(
      'rgba(0, 166, 62, 0.25)',
      POSITIVE,
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
          d="M5.5 11.5L9.2 15L16.5 7.5"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (state === 'failed') {
    return renderBadge(
      'rgba(206, 29, 38, 0.25)',
      NEGATIVE,
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M5 5L15 15M15 5L5 15" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (state === 'pending') {
    return renderBadge(
      'rgba(255, 154, 23, 0.25)',
      AMBER,
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="7" stroke="#FFFFFF" strokeWidth="2.4" />
        <path d="M11 7v4l3 2" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // sent / default — no badge (canonical shows none for "I sent" txns)
  return null;
}

function DetailRow({ title, value, trailing }) {
  // R24 cont-14: removed inter-row borderBottom. User: "there is an extra
  // divider right below UPI reference". The last row's borderBottom was
  // stacking on top of the 8px slate divider below the Details section,
  // visually reading as two stacked lines. Canonical (Figma node 2410:39712)
  // has NO inter-row dividers between detail rows — they're separated by
  // padding only, with a single slate divider closing the section.
  return (
    <div
      style={{
        display: 'flex',
        // R24 cont-17: vertically center the trailing icon (copy / chevron)
        // against the title+value text block. Per user "the copy button
        // should be centered to the list item, not top-aligned".
        alignItems: 'center',
        gap: 16,
        padding: '16px 0',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'Rubik, sans-serif',
            fontSize: 16,
            lineHeight: '24px',
            fontWeight: 400,
            letterSpacing: '0.32px',
            color: TEXT_PRIMARY,
          }}
        >
          {title}
        </div>
        {value && (
          <div
            style={{
              fontFamily: 'Rubik, sans-serif',
              fontSize: 14,
              lineHeight: '20px',
              fontWeight: 400,
              letterSpacing: '0.28px',
              color: TEXT_TERTIARY,
              marginTop: 2,
              wordBreak: 'break-all',
            }}
          >
            {value}
          </div>
        )}
      </div>
      {trailing && <div style={{ flexShrink: 0 }}>{trailing}</div>}
    </div>
  );
}

function BoldDivider() {
  return <div style={{ height: 8, background: SLATE_30, width: '100%' }} />;
}

export default function TxnDetailL1({ onClose, txn }) {
  const scrollRef = useRef(null);
  const scrolled = usePageScroll(scrollRef);

  // Sensible defaults if no txn prop passed (registry init / dev).
  const t = txn || {
    name: 'slice savings',
    amount: 10000,
    state: 'success',
    label: 'deposit payment',
    fromLabel: 'From slice savings',
    timestamp: "25 Aug '24, 11:58 pm",
    txnId: 'Ax12617637926147hjfhef',
    sourceLabel: 'From slice savings',
    sourceValue: 'xxx1234',
    detailLabel: 'Deposit details',
    detailValue: 'OD00051901512200005190151',
  };

  // Build the hero label based on state + txn data
  let heroLabel = t.label || 'payment';
  if (!t.label) {
    if (t.state === 'received') heroLabel = `received from ${t.name}`;
    else if (t.state === 'failed') heroLabel = `payment to ${t.name} failed`;
    else if (t.state === 'pending') heroLabel = `pending request to ${t.name}`;
    else heroLabel = `sent to ${t.name}`;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: PAGE_BG }}>
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
        <div style={{ height: 54, flexShrink: 0 }} />
        <AppBar
          scroll={scrolled}
          variant="standard"
          title={null}
          leading={<ChevronBackGlyph />}
          onBack={onClose}
          actions={[]}
          background="var(--page-bg)"
        />

        {/* Hero — left-aligned amount + label + status badge top-right. R24
            cont-6: bumped top padding 8→32 and bottom 24→32 so the hero has
            canonical breathing room between AppBar and the BoldDivider below.
            User: "transaction details has some spacing issues" — this matches
            Figma node 2410:39712's vertical rhythm. */}
        <div style={{ padding: `32px ${PAGE_PAD}px 32px` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* R24 cont-5: hero amount + label as a single inline phrase.
                  Per user feedback "no line break after amount" — they sit on
                  one line, wrapping naturally if the phone width can't hold
                  them. Removes the literal `<br />` that previously forced a
                  hard split. */}
              <div
                style={{
                  fontFamily: 'Rubik, sans-serif',
                  fontSize: 24,
                  lineHeight: '32px',
                  fontWeight: 500,
                  letterSpacing: '0.48px',
                  color: TEXT_PRIMARY,
                }}
              >
                ₹{formatINR(t.amount)} {heroLabel}
              </div>
              <div
                style={{
                  fontFamily: 'Rubik, sans-serif',
                  fontSize: 14,
                  lineHeight: '20px',
                  fontWeight: 400,
                  letterSpacing: '0.28px',
                  color: TEXT_PRIMARY,
                  marginTop: 12,
                }}
              >
                {t.fromLabel || t.sourceLabel || `From ${t.name}`}
              </div>
              <div
                style={{
                  fontFamily: 'Rubik, sans-serif',
                  fontSize: 12,
                  lineHeight: '16px',
                  fontWeight: 400,
                  letterSpacing: '0.24px',
                  color: TEXT_TERTIARY,
                  marginTop: 4,
                }}
              >
                {t.timestamp || t.dateTime}
              </div>
            </div>
            <StateBadge state={t.state} />
          </div>
        </div>

        <BoldDivider />

        {/* Details section */}
        <div style={{ padding: `20px ${PAGE_PAD}px 8px` }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 12,
              borderBottom: `1px solid ${OUTLINE_SUBTLE}`,
            }}
          >
            <span
              style={{
                fontFamily: 'Rubik, sans-serif',
                fontSize: 16,
                lineHeight: '20px',
                fontWeight: 500,
                letterSpacing: '0.32px',
                color: TEXT_PRIMARY,
              }}
            >
              Details
            </span>
            <button
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'Rubik, sans-serif',
                fontSize: 16,
                lineHeight: '20px',
                fontWeight: 500,
                letterSpacing: '0.32px',
                color: V_500,
              }}
              aria-label="share"
            >
              Share
            </button>
          </div>

          {/* R24 cont-14: only Transaction ID gets a trailing icon (copy).
              User: "there are chevrons which we don't use". Removed the
              ChevronRightGlyph from source + detail rows — they're plain
              info rows, not navigable. */}
          <DetailRow
            title="Transaction ID"
            value={t.txnId || t.refId}
            trailing={<CopyGlyph />}
          />
          <DetailRow
            title={t.sourceLabel || 'From slice savings'}
            value={t.sourceValue || 'xxx1234'}
          />
          <DetailRow
            title={t.detailLabel || 'Deposit details'}
            value={t.detailValue}
          />
        </div>

        <BoldDivider />

        {/* Notes */}
        <div style={{ padding: `16px ${PAGE_PAD}px` }}>
          <input
            type="text"
            placeholder="Add extra notes"
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: 'Rubik, sans-serif',
              fontSize: 16,
              lineHeight: '24px',
              fontWeight: 400,
              letterSpacing: '0.32px',
              color: TEXT_TERTIARY,
              padding: 0,
            }}
          />
        </div>

        <BoldDivider />

        {/* Contact us footer */}
        <div style={{ padding: `20px ${PAGE_PAD}px 32px`, textAlign: 'center' }}>
          <button
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'Rubik, sans-serif',
              fontSize: 16,
              lineHeight: '24px',
              fontWeight: 500,
              letterSpacing: '0.32px',
              color: V_500,
            }}
            aria-label="contact support"
          >
            Contact us
          </button>
        </div>

        <div style={{ height: 32, flexShrink: 0 }} />
      </div>
    </div>
  );
}
