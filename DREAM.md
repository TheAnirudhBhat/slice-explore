# Forward-looking ideas (no code yet)

Things this proto could become with another round of work — captured so they don't get lost.

## Composition
- Extract a `<FYInfiniteCarousel renderSlide={...} />` wrapper. FY_A and FY_F share
  ~95% of their scaffolding (slide bg, scheme lerp, scroller, dots, cloned-edge
  teleport). Only the per-slide JSX differs.
- Promote `RollingText` / `RollingStack` / the cloned-edge infinite carousel
  pattern into a small `proto-toolkit.html` you can `<script src>` from new
  protos. Right now every new proto re-derives these.

## Design exploration UX
- The "Highlight spacing" mode is good but unloved. A future mini-tool: hover
  over any section in the picker and the matching SectionBlock in the phone
  glows + the tape-measure overlay shows section-gap / header-below numbers.
  Today you have to flip Highlight on globally.
- Per-section "lock" toggle so a designer reviewing the proto can lock 2-3
  variants they like and re-randomize the rest with a single keystroke. Useful
  for "show me 5 different combinations of what I haven't locked".

## Data realism
- All numbers are static today (₹18,400, ₹240, 5 fires, etc). Wire a tiny
  `data.json` so designers can edit the JSON and the proto reflects it instantly
  — no React knowledge required. Great for handing off to PMs to fill with real
  copy before user testing.
- Two profiles to demo: "new user (sparse)" and "engaged user (rich)". Picker
  toggles which one drives every section's content. Tests every empty/loading
  state without rebuilding the proto.

## Motion polish
- Cross-section pulse animation when the picker changes a variant. Today there's
  a single pulse on the affected section — fine but a chained pulse + viewport
  auto-scroll-to could turn picker flips into a tiny narrative.
- The RollingStack mask-fade is right at top/bottom edges (20% / 80%) — works,
  but a measurable polish step would be matching the easing curve to the
  scroll-snap easing on the For You carousels so all rolls in the page feel
  like one motion language.

## Real wiring
- Bottom nav is still a single PNG. Replacing with the DLS Bottom Nav component
  unblocks: active-tab indication, badge counts (e.g. "3" on the slice logo
  when the user has unclaimed sparks), and the eventual swipe-up gesture for
  the AI banker (instead of the tap target we just added).
- Hook the swipe-down-to-dismiss + center-tap-to-open into a single
  `useDrawerGesture(...)` hook so adding a second drawer later (e.g. a
  notifications panel from the top) is trivial.
