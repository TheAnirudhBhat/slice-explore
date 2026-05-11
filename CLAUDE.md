# explore-base

Base version of the slice Explore page — web proto for the redesign track. Parent `slice/CLAUDE.md` covers DLS 2.0, brand voice, tokens, and proto conventions. This file is project-specific only.

## Run
```
python3 -m http.server 8765
# http://localhost:8765
```

## Stack
Single-file `index.html`, React 18 + Tailwind + Babel via CDN. No build step. DLS 2.0 tokens inlined.

## Files
- `index.html` — the proto
- `recovery.js` — snapshot/backup of prior working state; do not import or edit unless restoring
- `remove_bg.py`, `check_alpha.py` — asset helpers for the `assets/` PNGs
- `assets/` — Figma-exported PNGs (icons, illustrations, bottom nav)
- `screenshot-current.png` — latest visual reference

## Current screen (top → bottom)
1. App bar L0 — "Explore" + avatar
2. Composite Recharge & bills card (icon grid + reward row)
3. 2 × Medium cards — Play & win, May spends
4. 1 × Medium + 2 × Small stack — Invite & earn, Credit score, Autopay
5. Bottom nav (PNG, not the DLS component yet)

## Status
Base from which we iterate. Missing vs redesign brief: For You, AI Banker, Rewards & Benefits section, Statistics section, More.

## Project-specific decisions
- Bottom nav is currently a PNG — replacing with DLS Bottom nav component is a known TODO, don't silently swap mid-task
- Original PNG icons (`flame_orange.png`, `fire_sparkle.png`) read as on-brand pink/sparkle — keep them, don't replace with synthesized glyphs
- Get assured row uses card-footer pattern: `buttonSmall` medium, brand `#D30AD7`
- Inside-card row separators are solid dividers, not dashed
- Phone shell tuned to iPhone-realistic (Dynamic Island, titanium frame, side buttons) — keep this when re-rendering the shell

## Known issues
- Recharge & bills card duplicates the Bills section (anti-redundancy concern from brief — flag before adding more bill entry points)
- No section structure yet (no Section headers / Divider/Big)
