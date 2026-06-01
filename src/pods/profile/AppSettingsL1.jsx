// App Settings L1 — canonical per Figma "App visual fix" node 4594:10703.
// Opened from Profile → "App Settings". App bar Standard (chevron-back + "App
// settings" title) + a flat control/standard list:
//   • Touch ID/ Face ID   — control row, subtitle "Active" (positive green), switch ON
//   • Change slice PIN     — standard tap row
//   • Dark mode            — control row, switch wired to the THEME TRANSITION
//   • Notification preferences — standard tap row
//   • Logout               — standard tap row
//
// Each leading icon is the official DLS glyph on a themed card-bg chip (white in
// light / dark-surface in dark) with an outline-subtle ring; the glyph is a CSS
// MASK painted with a themed token so it recolours slate→white (the source SVGs
// fill var(--fill-0, black) and would otherwise vanish in dark via <img>).
// (The Figma frame shows an Android status bar + a theme bottom-sheet — both
// ignored: the proto uses the iOS chrome and the Dark mode switch triggers the
// canonical slide transition directly.)

import React, { useRef } from 'react';
import { AppBar, usePageScroll } from '../../components/AppBar.jsx';
import { TEXT_PRIMARY, TEXT_TERTIARY, SURFACE, OUTLINE_SUBTLE, PAGE_BG } from '../../tokens.js';
import { useTheme } from '../../theme-context.js';

const POSITIVE = 'var(--positive)';
const SWITCH_OFF = '#CFCFCF'; // canonical off-track; only ever shown on a white surface

// Visual-only switch (the ROW is the tap target, so this never nests a button).
function Switch({ on }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: 40,
        height: 24,
        borderRadius: 100,
        position: 'relative',
        flexShrink: 0,
        background: on ? POSITIVE : SWITCH_OFF,
        transition: 'background 200ms ease',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 4,
          left: on ? 20 : 4,
          width: 16,
          height: 16,
          borderRadius: 100,
          background: '#FFFFFF',
          boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
          transition: 'left 200ms cubic-bezier(0.25,0.1,0.25,1)',
        }}
      />
    </div>
  );
}

function MaskIcon({ src, size = 20, color = TEXT_TERTIARY }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  );
}

function SettingRow({ icon, label, subtitle, subtitleColor, control, onTap }) {
  const Tag = onTap ? 'button' : 'div';
  return (
    <Tag
      onClick={onTap}
      aria-label={onTap ? label : undefined}
      style={{
        width: '100%',
        background: 'transparent',
        border: 'none',
        outline: 'none',
        cursor: onTap ? 'pointer' : 'default',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        textAlign: 'left',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* themed card-bg avatar chip + masked official glyph */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 100,
          flexShrink: 0,
          background: SURFACE,
          border: `1px solid ${OUTLINE_SUBTLE}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaskIcon src={icon} />
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
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
        {subtitle && (
          <span
            style={{
              fontFamily: 'Rubik, sans-serif',
              fontWeight: 400,
              fontSize: 12,
              lineHeight: '16px',
              letterSpacing: '0.24px',
              color: subtitleColor || TEXT_TERTIARY,
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
      {control}
    </Tag>
  );
}

export default function AppSettingsL1({ onClose }) {
  const scrollRef = useRef(null);
  const scrolled = usePageScroll(scrollRef);
  const { theme, toggleTheme } = useTheme();

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
        {/* Reserve for the fixed status-bar overlay */}
        <div style={{ height: 54, flexShrink: 0 }} />

        <AppBar scroll={scrolled} variant="standard" title="App settings" onBack={onClose} actions={[]} />

        <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 16, paddingBottom: 32 }}>
          <SettingRow
            icon="/assets/icons/settings_fingerid.svg"
            label="Touch ID/ Face ID"
            subtitle="Active"
            subtitleColor={POSITIVE}
            control={<Switch on />}
          />
          <SettingRow icon="/assets/icons/settings_pin.svg" label="Change slice PIN" onTap={() => {}} />
          <SettingRow
            icon="/assets/icons/settings_moon.svg"
            label="Dark mode"
            onTap={toggleTheme}
            control={<Switch on={theme === 'dark'} />}
          />
          <SettingRow icon="/assets/icons/settings_bell.svg" label="Notification preferences" onTap={() => {}} />
          <SettingRow icon="/assets/icons/settings_logout.svg" label="Logout" onTap={() => {}} />
        </div>
      </div>
    </div>
  );
}
