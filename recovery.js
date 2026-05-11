const FY_D = () => (
  <PagePad>
    <L0CardLarge
      label="DUE IN 2 DAYS"
      amount="₹1,240"
      insightText="Electricity bill · Tata Power"
      ctaTitle="Pay now to avoid late fee"
      ctaSubtitle="Auto-debit available"
      ctaText="Pay now"/>
  </PagePad>
);

const FY_E = () => (
  <PagePad>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <ExploreSmall subtext="Pay bill" title="₹1,240"
        trailing={<TagSubtle intent="negative">Mon</TagSubtle>}/>
      <ExploreSmall subtext="Spin" title="Win ₹50"
        trailing={<TagSubtle intent="main">Live</TagSubtle>}/>
    </div>
  </PagePad>
);

const ForYouSection = ({ variant }) => {
  if (variant === 'A') return <FY_A/>;
  if (variant === 'C') return <FY_C/>;
  if (variant === 'F') return <FY_F/>;
  return ({ B:FY_B, D:FY_D, E:FY_E }[variant])();
};

/* ----- AI Banker — all 5 are inline-input variants (extends previous E) ----- */

/* AI Banker A — clean pill with BETA tag, gradient star avatar (from Claude design).
   DLS fixes: font sizes mapped to DLS scale (bodySm + Metadata), shadow → DLS Card token, radius → Circle 100. */
const AB_A = () => (
  <PagePad>
    <div className="tap" style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 16px',
      background: 'white', border: CARD_BORDER, borderRadius: 100,
      boxShadow: CARD_SHADOW,
      cursor: 'text',
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 100, flexShrink: 0,
        background: 'linear-gradient(135deg, #D30AD7 0%, #2B6ACF 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </div>
      <span style={{ ...T.bodySm, color: 'rgba(0,0,0,0.5)', flex: 1 }}>Ask AI banker…</span>
      <span style={{
        ...T.meta, fontWeight: 500,
        background: '#FAE2FA', color: '#A008A3',
        padding: '3px 8px', borderRadius: 100, flexShrink: 0,
      }}>BETA</span>
    </div>
  </PagePad>
);

const AB_B = () => (
  <PagePad>
    <button className="tap" style={{
      width: '100%', padding: '14px 16px',
      background: 'white', border: '1px solid #D30AD7', borderRadius: 100,
      boxShadow: '0 0 0 4px rgba(211,10,215,0.06)',
      display: 'flex', alignItems: 'center', gap: 12,
      cursor: 'pointer', textAlign: 'left',
    }}>
      <GlyphAi/>
      <span style={{ ...T.body, color: 'rgba(0,0,0,0.5)', flex: 1 }}>Ask AI banker anything…</span>
      <Chevron color="#D30AD7"/>
    </button>
    <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
      <TagSubtle intent="neutral">Bills due?</TagSubtle>
      <TagSubtle intent="neutral">May spends?</TagSubtle>
      <TagSubtle intent="neutral">Best FD rate?</TagSubtle>
    </div>
  </PagePad>
);

const AB_C = () => (
  <PagePad>
    <div className="tap" style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '8px 8px 8px 16px',
      background: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 100,
      boxShadow: CARD_SHADOW,
    }}>
      <Avatar size={32} bg="#FAE2FA" glyph={<GlyphAi/>}/>
      <span style={{ ...T.body, color: 'rgba(0,0,0,0.5)', flex: 1 }}>Ask anything…</span>
      <button style={{
        width: 36, height: 36, borderRadius: 100, background: '#D30AD7',
        border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer', flexShrink: 0,
      }}>
        <GlyphSend/>
      </button>
    </div>
  </PagePad>
);

const AB_D = () => (
  <PagePad>
    <button className="tap" style={{
      background: 'transparent', border: 'none', cursor: 'pointer',
      padding: '8px 0', display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <GlyphAi/>
      <span style={{ ...T.btnSm, color: '#D30AD7' }}>Ask AI banker</span>
      <GlyphArrow color="#D30AD7"/>
    </button>
  </PagePad>
);

const AB_E = () => {
  const examples = [
    'How much did I spend on food last month?',
    'When is my next bill due?',
    'Should I increase my FD?',
  ];
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setIdx(prev => (prev + 1) % examples.length), 2500);
    return () => clearInterval(t);
  }, []);
  return (
    <PagePad>
      <button className="tap" style={{
        width: '100%', padding: '14px 16px',
        background: 'white', border: '1px solid #D30AD7', borderRadius: 100,
        boxShadow: '0 0 0 4px rgba(211,10,215,0.06)',
        display: 'flex', alignItems: 'center', gap: 12,
        cursor: 'pointer', textAlign: 'left',
      }}>
        <GlyphAi/>
        <span style={{
          ...T.bodySm, color: 'rgba(0,0,0,0.5)', flex: 1,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {examples[idx]}
        </span>
        <Chevron color="#D30AD7"/>
      </button>
    </PagePad>
  );
};

const AiBankerSection = ({ variant }) => ({ A:AB_A, B:AB_B, C:AB_C, D:AB_D, E:AB_E }[variant])();

/* ----- Bills & Recharges — no nudges (urgency lives in For You). No inner heading
   (the section header above is the title). 5 ways to present the shortcut surface. ----- */

const InCardHeader = ({ title, cta, icon }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)', marginBottom: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {icon && <div style={{ display: 'flex', color: '#D30AD7' }}>{icon}</div>}
      <span style={{ ...T.h4 }}>{title}</span>
    </div>
    {cta && <button className="tap" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, ...T.btnSm, color: '#D30AD7' }}>{cta}</button>}
  </div>
);

/* A — Plain shortcut grid, no card wrapper */
const BL_A = () => (
  <PagePad>
    <BillsShortcutGrid/>
  </PagePad>
);

/* B — Grid in a card, no inner heading */
const BL_B = () => (
  <PagePad>
    <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 24 }}>
      <BillsShortcutGrid/>
    </div>
  </PagePad>
);

/* C — Card with grid + reward footer (no inner heading; reward kept as the persuasion layer) */
const BL_C = () => (
  <PagePad>
    <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 24 }}>
      <BillsShortcutGrid/>
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', margin: '20px 0 16px' }}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar bg="#FAE2FA" glyph={<GlyphSpark color="#D30AD7"/>}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...T.btnSm, color: 'rgba(0,0,0,0.9)' }}>Get assured ₹10</div>
          <div style={{ ...T.caption, marginTop: 2 }}>Reward on 1st bill payment</div>
        </div>
        <Chevron/>
      </div>
    </div>
  </PagePad>
);

/* D — Two-row grid, 8 shortcuts inside a card */
const BL_D = () => {
  const tiles = [
    { src: 'bill_credit',   t: 'Credit\ncard' },
    { src: 'bill_electric', t: 'Electricity' },
    { src: 'bill_mobile',   t: 'Mobile' },
    { src: 'bill_more',     t: 'DTH' },
    { src: 'bill_credit',   t: 'Loans' },
    { src: 'bill_electric', t: 'Gas' },
    { src: 'bill_mobile',   t: 'Insurance' },
    { src: 'bill_more',     t: 'View all' },
  ];
  return (
    <PagePad>
      <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: 8, rowGap: 20 }}>
          {tiles.map((b, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={`./assets/${b.src}.png`} width={40} height={40} alt="" style={{ display: 'block' }}/>
              <div style={{ ...T.caption, textAlign: 'center', marginTop: 8, whiteSpace: 'pre-line', color: 'rgba(0,0,0,0.7)' }}>
                {b.t}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PagePad>
  );
};

/* E — List-style (4 list rows with avatars; alternative directory pattern) */
const BL_E = () => (
  <>
    <ListItemAvatar asset="bill_credit.png"   title="Credit card"      subtitle="3 cards linked"/>
    <DividerInset/>
    <ListItemAvatar asset="bill_electric.png" title="Electricity bill" subtitle="Tata Power"/>
    <DividerInset/>
    <ListItemAvatar asset="bill_mobile.png"   title="Mobile recharge"  subtitle="Airtel · autopay on"/>
    <DividerInset/>
    <ListItemAvatar bg="#F0F4F7" glyph={<GlyphMore/>} title="View all bills"/>
  </>
);

/* F — Premium In-card Header Variant */
const BL_F = () => (
  <PagePad>
    <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 24 }}>
      <InCardHeader title="Bills & Recharges" cta="History" />
      <BillsShortcutGrid/>
    </div>
  </PagePad>
);

const BillsSection = ({ variant }) => {
  const C = { A:BL_A, B:BL_B, C:BL_C, D:BL_D, E:BL_E, F:BL_F }[variant];
  return <C/>;
};

/* ----- Rewards & Benefits: A:carousel(kept) B:marketing+rows(kept) C/D/E:NEW ----- */

const RW_A = () => (
  <HScroll gap={12}>
    <div style={{ flex: '0 0 200px' }}>
      <ExploreMedium subtext="Play & win" title="5 fires"
        icon={<img src="./assets/fire_sparkle.png" width={54} height={54} alt=""/>}/>
    </div>
    <div style={{ flex: '0 0 200px' }}>
      <ExploreMedium subtext="Cashback" title="₹85 earned"
        icon={<Avatar size={44} bg="#E0F4E8" glyph={<GlyphSpark color="#00A63E"/>}/>}/>
    </div>
    <div style={{ flex: '0 0 200px' }}>
      <ExploreMedium subtext="Invite" title="Get ₹150"
        icon={<img src="./assets/invite_magnet.png" width={54} height={54} alt=""/>}/>
    </div>
  </HScroll>
);

const RW_B = () => (
  <>
    <PagePad>
      <MarketingCard glyph={<img src="./assets/fire_sparkle.png" width={32} height={32} alt=""/>}
        title="5 fires earned" subtitle="Spin the wheel to claim 2x cashback"/>
    </PagePad>
    <Spacer h={12}/>
    <ListItemAvatar bg="#E0F4E8" glyph={<GlyphSpark color="#00A63E"/>}
      title="Cashback ₹85" subtitle="Earned this month"/>
    <DividerInset/>
    <ListItemAvatar asset="invite_magnet.png"
      title="Invite & earn" subtitle="Get ₹150 per friend"/>
  </>
);

/* C — Featured Large + 2 Mediums (NEW, extends Marketing concept) */
const RW_C = () => (
  <PagePad>
    <ExploreLarge
      intent={<TagSubtle intent="main">5 fires earned</TagSubtle>}
      subtext="Play & win"
      title="Spin to claim 2x rewards"
      icon={<img src="./assets/fire_sparkle.png" width={56} height={56} alt=""/>}/>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
      <ExploreMedium subtext="Cashback" title="₹85"
        icon={<Avatar size={44} bg="#E0F4E8" glyph={<GlyphSpark color="#00A63E"/>}/>}/>
      <ExploreMedium subtext="Invite" title="Get ₹150"
        icon={<img src="./assets/invite_magnet.png" width={54} height={54} alt=""/>}/>
    </div>
  </PagePad>
);

/* D — Carousel with first card brand-gradient (NEW, extends carousel) */
const RW_D = () => (
  <HScroll gap={12}>
    <div style={{ flex: '0 0 220px' }}>
      <button className="tap" style={{
        width: '100%', height: 148, padding: 16, borderRadius: 16,
        background: 'linear-gradient(135deg, #D30AD7 0%, #2B6ACF 100%)',
        border: 'none', boxShadow: CARD_SHADOW,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        textAlign: 'left', position: 'relative', overflow: 'hidden',
        cursor: 'pointer',
      }}>
        <div style={{ ...T.caption, color: 'rgba(255,255,255,0.7)' }}>Fire hour live</div>
        <div style={{ ...T.h4, color: 'white', marginTop: 4 }}>5 fires earned</div>
        <div style={{ ...T.caption, color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>Tap to spin</div>
        <img src="./assets/fire_sparkle.png" width={54} height={54} alt=""
          style={{ position: 'absolute', right: 16, bottom: 16 }}/>
      </button>
    </div>
    <div style={{ flex: '0 0 200px' }}>
      <ExploreMedium subtext="Cashback" title="₹85 earned"
        icon={<Avatar size={44} bg="#E0F4E8" glyph={<GlyphSpark color="#00A63E"/>}/>}/>
    </div>
    <div style={{ flex: '0 0 200px' }}>
      <ExploreMedium subtext="Invite" title="Get ₹150"
        icon={<img src="./assets/invite_magnet.png" width={54} height={54} alt=""/>}/>
    </div>
    <div style={{ flex: '0 0 200px' }}>
      <ExploreMedium subtext="Offers" title="12 nearby"
        icon={<Avatar size={44} bg="#FFF3E3" glyph={<GlyphSpark color="#C27511"/>}/>}/>
    </div>
  </HScroll>
);

/* E — Streak banner + carousel (NEW, engagement layer above the carousel) */
const RW_E = () => (
  <>
    <PagePad>
      <div className="tap" style={{
        background: 'linear-gradient(135deg, #FAE2FA 0%, #E6EDF9 100%)',
        borderRadius: 16, padding: 16,
        display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
      }}>
        <Avatar bg="#FFFFFF" asset="fire_sparkle.png"/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...T.btnSm, color: '#D30AD7' }}>Fire streak · day 7</div>
          <div style={{ ...T.caption }}>Keep going for 2x rewards tomorrow</div>
        </div>
        <Chevron color="#D30AD7"/>
      </div>
    </PagePad>
    <Spacer h={12}/>
    <HScroll gap={12}>
      <div style={{ flex: '0 0 200px' }}>
        <ExploreMedium subtext="Cashback" title="₹85"
          icon={<Avatar size={44} bg="#E0F4E8" glyph={<GlyphSpark color="#00A63E"/>}/>}/>
      </div>
      <div style={{ flex: '0 0 200px' }}>
        <ExploreMedium subtext="Invite" title="Get ₹150"
          icon={<img src="./assets/invite_magnet.png" width={54} height={54} alt=""/>}/>
      </div>
      <div style={{ flex: '0 0 200px' }}>
        <ExploreMedium subtext="Offers" title="12 nearby"
          icon={<Avatar size={44} bg="#FFF3E3" glyph={<GlyphSpark color="#C27511"/>}/>}/>
      </div>
    </HScroll>
  </>
);

/* F — Premium In-card Header Variant */
const RW_F = () => (
  <PagePad>
    <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 24 }}>
      <InCardHeader title="Rewards & Benefits" icon={<GlyphSpark color="#D30AD7"/>} />
      <ExploreLarge
        intent={<TagSubtle intent="main">5 fires earned</TagSubtle>}
        subtext="Play & win"
        title="Spin to claim 2x rewards"
        icon={<img src="./assets/fire_sparkle.png" width={56} height={56} alt=""/>}/>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        <ExploreMedium subtext="Cashback" title="₹85"
          icon={<Avatar size={44} bg="#E0F4E8" glyph={<GlyphSpark color="#00A63E"/>}/>}/>
        <ExploreMedium subtext="Invite" title="Get ₹150"
          icon={<img src="./assets/invite_magnet.png" width={54} height={54} alt=""/>}/>
      </div>
    </div>
  </PagePad>
);

const RewardsSection = ({ variant }) => {
  const C = { A:RW_A, B:RW_B, C:RW_C, D:RW_D, E:RW_E, F:RW_F }[variant];
  return <C/>;
};

/* ----- Statistics: A:bar+2cards(kept) B:list-rows(was C,kept) C/D/E:NEW ----- */

const SpendBarChart = () => {
  const days = [
    { label: 'M', height: 38 }, { label: 'T', height: 26 }, { label: 'W', height: 56 },
    { label: 'T', height: 42 }, { label: 'F', height: 64, active: true },
    { label: 'S', height: 36 }, { label: 'S', height: 28 },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                  gap: 12, height: 80, marginTop: 24 }}>
      {days.map((d, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
          <div style={{
            width: '100%', maxWidth: 22, height: d.height,
            background: d.active ? '#D30AD7' : '#EAEBED',
            borderRadius: '4px 4px 0 0',
          }}/>
          <div style={{ ...T.caption }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
};

const ST_A = () => (
  <PagePad>
    <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ ...T.btnSm, color: 'rgba(0,0,0,0.5)' }}>May spends</div>
          <div style={{ ...T.display, marginTop: 4 }}>₹12,487</div>
        </div>
        <TagSubtle intent="positive">↓ 18% vs Apr</TagSubtle>
      </div>
      <SpendBarChart/>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
      <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 16 }}>
        <div style={{ ...T.btnSm, color: 'rgba(0,0,0,0.5)' }}>Credit score</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
          <span style={T.h2}>785</span>
          <span style={{ ...T.btnSm, color: '#00A63E' }}>+12</span>
        </div>
        <div style={{ height: 4, background: '#EAEBED', borderRadius: 2, marginTop: 12, overflow: 'hidden' }}>
          <div style={{ width: '70%', height: '100%', background: '#00A63E', borderRadius: 2 }}/>
        </div>
        <div style={{ ...T.caption, marginTop: 8 }}>On track for 800+</div>
      </div>
      <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 16 }}>
        <div style={{ ...T.btnSm, color: 'rgba(0,0,0,0.5)' }}>Autopay</div>
        <div style={{ ...T.h2, marginTop: 4 }}>1 active</div>
        <div style={{ ...T.caption, marginTop: 12, lineHeight: '18px' }}>
          Next: ₹239<br/>on 8 May
        </div>
      </div>
    </div>
  </PagePad>
);

const ST_B = () => (
  <>
    <ListItemAvatar bg="#FAE2FA" glyph={<GlyphChart/>}
      title="May spends" subtitle="↓ 18% vs Apr"
      trailing={<div style={T.h4}>₹12,487</div>}/>
    <DividerInset/>
    <ListItemAvatar bg="#E0F4E8" glyph={<GlyphChart color="#00A63E"/>}
      title="Credit score" subtitle="Updated 5 May"
      trailing={<div style={{ ...T.h4, color: '#00A63E' }}>785</div>}/>
    <DividerInset/>
    <ListItemAvatar bg="#E6EDF9" glyph={<GlyphBolt color="#2B6ACF"/>}
      title="Autopay" subtitle="1 mandate active"/>
    <DividerInset/>
    <ListItemAvatar bg="#F0F4F7" glyph={<GlyphMore/>} title="View full report"/>
  </>
);

/* C — Bar chart only, focused (NEW) */
const ST_C = () => (
  <PagePad>
    <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ ...T.btnSm, color: 'rgba(0,0,0,0.5)' }}>May spends</div>
          <div style={{ ...T.display, marginTop: 4 }}>₹12,487</div>
        </div>
        <TagSubtle intent="positive">↓ 18% vs Apr</TagSubtle>
      </div>
      <SpendBarChart/>
    </div>
  </PagePad>
);

/* D — Sparkline card + 2 list rows (NEW, hybrid visual + density) */
const ST_D = () => (
  <>
    <PagePad>
      <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ ...T.btnSm, color: 'rgba(0,0,0,0.5)' }}>May spends</div>
            <div style={{ ...T.h2, marginTop: 4 }}>₹12,487</div>
            <div style={{ ...T.caption, color: '#00A63E', marginTop: 4 }}>↓ 18% vs Apr</div>
          </div>
          <svg width="100" height="40" viewBox="0 0 100 40" fill="none">
            <path d="M0 30 L20 22 L40 26 L60 14 L80 8 L100 18"
              stroke="#D30AD7" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M0 30 L20 22 L40 26 L60 14 L80 8 L100 18 L100 40 L0 40 Z"
              fill="rgba(211,10,215,0.08)"/>
          </svg>
        </div>
      </div>
    </PagePad>
    <Spacer h={12}/>
    <ListItemAvatar bg="#E0F4E8" glyph={<GlyphChart color="#00A63E"/>}
      title="Credit score" subtitle="Updated 5 May"
      trailing={<div style={{ ...T.h4, color: '#00A63E' }}>785</div>}/>
    <DividerInset/>
    <ListItemAvatar bg="#E6EDF9" glyph={<GlyphBolt color="#2B6ACF"/>}
      title="Autopay" subtitle="1 active"/>
  </>
);

/* E — Bar chart + 2 list rows (NEW, max info density) */
const ST_E = () => (
  <>
    <PagePad>
      <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div style={{ ...T.btnSm, color: 'rgba(0,0,0,0.5)' }}>May spends</div>
            <div style={{ ...T.display, marginTop: 4 }}>₹12,487</div>
          </div>
          <TagSubtle intent="positive">↓ 18% vs Apr</TagSubtle>
        </div>
        <SpendBarChart/>
      </div>
    </PagePad>
    <Spacer h={12}/>
    <ListItemAvatar bg="#E0F4E8" glyph={<GlyphChart color="#00A63E"/>}
      title="Credit score" subtitle="Updated 5 May"
      trailing={<div style={{ ...T.h4, color: '#00A63E' }}>785</div>}/>
    <DividerInset/>
    <ListItemAvatar bg="#E6EDF9" glyph={<GlyphBolt color="#2B6ACF"/>}
      title="Autopay" subtitle="1 mandate active"/>
  </>
);

/* F — Premium In-card Header Variant */
const ST_F = () => (
  <PagePad>
    <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, padding: 24 }}>
      <InCardHeader title="Statistics" icon={<GlyphChart color="#D30AD7"/>} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ ...T.btnSm, color: 'rgba(0,0,0,0.5)' }}>May spends</div>
          <div style={{ ...T.display, marginTop: 4 }}>₹12,487</div>
        </div>
        <TagSubtle intent="positive">↓ 18% vs Apr</TagSubtle>
      </div>
      <SpendBarChart/>
    </div>
  </PagePad>
);

const StatsSection = ({ variant }) => {
  const C = { A:ST_A, B:ST_B, C:ST_C, D:ST_D, E:ST_E, F:ST_F }[variant];
  return <C/>;
};

/* ----- More: A:simple-list(kept) B:list+subtitles(was D,kept) C/D/E:NEW ----- */

const MR_A = () => (
  <>
    <ListItemAvatar bg="#F0F4F7" glyph={<GlyphSettings/>} title="Settings"/>
    <DividerInset/>
    <ListItemAvatar bg="#F0F4F7" glyph={<GlyphHelp/>} title="Help & support"/>
    <DividerInset/>
    <ListItemAvatar bg="#F0F4F7" glyph={<GlyphInfo/>} title="About slice"/>
  </>
);

const MR_B = () => (
  <>
    <ListItemAvatar bg="#F0F4F7" glyph={<GlyphSettings/>} title="Settings"
      subtitle="Profile, security, notifications"/>
    <DividerInset/>
    <ListItemAvatar bg="#F0F4F7" glyph={<GlyphHelp/>} title="Help & support"
      subtitle="FAQs, chat with us"/>
    <DividerInset/>
    <ListItemAvatar bg="#F0F4F7" glyph={<GlyphShield/>} title="Privacy & data"
      subtitle="Permissions, ad preferences"/>
    <DividerInset/>
    <ListItemAvatar bg="#F0F4F7" glyph={<GlyphInfo/>} title="About slice"
      subtitle="Version, terms, licenses"/>
  </>
);

/* C — Compact 2-column tile rows (NEW) */
const MR_C = () => (
  <PagePad>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {[
        { glyph: <GlyphSettings/>, label: 'Settings', sub: 'Profile, security' },
        { glyph: <GlyphHelp/>, label: 'Help', sub: 'FAQs, chat' },
        { glyph: <GlyphShield/>, label: 'Privacy', sub: 'Data, ads' },
        { glyph: <GlyphInfo/>, label: 'About', sub: 'Version, terms' },
      ].map((m, i) => (
        <button key={i} className="tap" style={{
          background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 12,
          padding: 12, display: 'flex', alignItems: 'center', gap: 10,
          cursor: 'pointer', textAlign: 'left',
        }}>
          <Avatar size={36} bg="#F0F4F7" glyph={m.glyph}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={T.bodySm}>{m.label}</div>
            <div style={{ ...T.caption, marginTop: 2 }}>{m.sub}</div>
          </div>
        </button>
      ))}
    </div>
  </PagePad>
);

/* D — Grouped sub-headers + lists (NEW) */
const MR_D = () => (
  <>
    <div style={{ padding: '0 24px 4px', ...T.meta }}>Account</div>
    <ListItemAvatar bg="#F0F4F7" glyph={<GlyphSettings/>} title="Settings"
      subtitle="Profile, security, notifications"/>
    <DividerInset/>
    <ListItemAvatar bg="#F0F4F7" glyph={<GlyphShield/>} title="Privacy & data"
      subtitle="Permissions, ad preferences"/>
    <Spacer h={16}/>
    <div style={{ padding: '0 24px 4px', ...T.meta }}>Support</div>
    <ListItemAvatar bg="#F0F4F7" glyph={<GlyphHelp/>} title="Help & support"
      subtitle="FAQs, chat with us"/>
    <DividerInset/>
    <ListItemAvatar bg="#F0F4F7" glyph={<GlyphInfo/>} title="About slice"
      subtitle="Version, terms, licenses"/>
  </>
);

/* E — Condensed text-only rows (NEW, ultra-minimal) */
const MR_E = () => (
  <PagePad>
    <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, overflow: 'hidden' }}>
      {[
        { label: 'Settings', danger: false },
        { label: 'Help & support', danger: false },
        { label: 'Privacy & data', danger: false },
        { label: 'About slice', danger: false },
        { label: 'Logout', danger: true },
      ].map((row, i) => (
        <button key={i} className="tap" style={{
          width: '100%', padding: '14px 16px',
          background: 'transparent', border: 'none',
          borderTop: i > 0 ? '1px solid rgba(0,0,0,0.05)' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', textAlign: 'left',
        }}>
          <span style={{ ...T.body, color: row.danger ? '#CE1D26' : 'rgba(0,0,0,0.9)' }}>{row.label}</span>
          {!row.danger && <Chevron/>}
        </button>
      ))}
    </div>
  </PagePad>
);

/* F — Premium In-card Header Variant */
const MR_F = () => (
  <PagePad>
    <div style={{ background: 'white', boxShadow: CARD_SHADOW, border: CARD_BORDER, borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ padding: '24px 24px 0' }}>
        <InCardHeader title="More" />
      </div>
      <div style={{ padding: '8px 16px 16px' }}>
        {[
          { label: 'Settings', danger: false, glyph: <GlyphSettings/> },
          { label: 'Help & support', danger: false, glyph: <GlyphHelp/> },
          { label: 'Privacy & data', danger: false, glyph: <GlyphShield/> },
          { label: 'Logout', danger: true, glyph: null },
        ].map((row, i) => (
          <button key={i} className="tap" style={{
            width: '100%', padding: '12px 8px',
            background: 'transparent', border: 'none',
            display: 'flex', alignItems: 'center', gap: 12,
            cursor: 'pointer', textAlign: 'left',
          }}>
            {row.glyph && <div style={{ color: 'rgba(0,0,0,0.5)' }}>{row.glyph}</div>}
            <span style={{ ...T.body, color: row.danger ? '#CE1D26' : 'rgba(0,0,0,0.9)', flex: 1 }}>{row.label}</span>
            {!row.danger && <Chevron/>}
          </button>
        ))}
      </div>
    </div>
  </PagePad>
);

const MoreSection = ({ variant }) => {
  const C = { A:MR_A, B:MR_B, C:MR_C, D:MR_D, E:MR_E, F:MR_F }[variant];
  return <C/>;
};

/* ============= V0 — Exact replica of the live Explore page (bypasses section system) ============= */

const OriginalExplore = () => (
  <ScreenShell>
    <PagePad>
      <BillsCompositeCard/>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        <ExploreMedium subtext="Play & win" title="5 fires"
          icon={<img src="./assets/fire_sparkle.png" width={54} height={54} alt="" style={{ display: 'block' }}/>}/>
        <ExploreMedium subtext="May spends" title="₹12,487"
          icon={<img src="./assets/may_spends.png" width={54} height={54} alt="" style={{ display: 'block' }}/>}/>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        <ExploreMedium subtext="Invite & earn" title="Get ₹150"
          icon={<img src="./assets/invite_magnet.png" width={54} height={54} alt="" style={{ display: 'block' }}/>}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ExploreSmall subtext="Credit score" title="785"/>
          <ExploreSmall subtext="Autopay" title="1 active"/>
        </div>
      </div>
    </PagePad>
  </ScreenShell>
);
