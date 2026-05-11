# explore — base version

Current implemented state of the slice Explore page (web proto, single-file React).

## Run
```
cd ~/claude/slice/projects/explore-base
python3 -m http.server 8765
# open http://localhost:8765
```

## Stack
React 18 + Tailwind + Babel via CDN. No build step. DLS 2.0 tokens inline.

## What's on screen (top → bottom)
1. App bar L0 — "Explore" + avatar
2. Composite Recharge & bills card (icon grid + reward row)
3. 2 × Medium cards — Play & win, May spends
4. 1 × Medium + 2 × Small stack — Invite & earn, Credit score, Autopay
5. Bottom nav (PNG)

## Status
This is the base from which we iterate. Sections missing vs the redesign brief:
For You, AI Banker, Rewards & Benefits (as section), Statistics (as section), More.

## Changes 2026-05-07
- Get assured row text restyled to card-footer pattern (`buttonSmall` medium, brand `#D30AD7`) — title was too plain/heavy in Body Normal style
- Solid divider replaces dashed inside Bills card (DLS convention for inside-card row separators)
- Phone shell tuned to iPhone-realistic look (Dynamic Island, titanium frame, side buttons)
- Original PNG icons preserved (`flame_orange.png` on Get assured, `fire_sparkle.png` on Play & win) — they read as on-brand pink/sparkle and look better than synthesized glyphs

## Open / known
- Bottom nav is a PNG, not the DLS Bottom nav component
- No section structure yet (no Section headers / Divider/Big) — addressed in upcoming iterations
- Recharge & bills card duplicates the Bills section (anti-redundancy concern from brief)
