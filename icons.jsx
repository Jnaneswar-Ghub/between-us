/* ============================================================
   icons.jsx — thin line SVG icons + botanical desk props
   ============================================================ */
const Ic = ({ d, size = 18, sw = 1.6, fill = "none", children, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" {...p}>
    {d ? <path d={d} /> : children}
  </svg>
);

/* ---- navigation icons ---- */
const IconLetters = (p) => <Ic {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></Ic>;
const IconDraft   = (p) => <Ic {...p} d="M12 20h9 M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />;
const IconCapsule = (p) => <Ic {...p}><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2.5 1.5" /></Ic>;
const IconCollections = (p) => <Ic {...p}><path d="M4 7l5-3 5 3v13l-5-3-5 3Z" /><path d="M14 4l5 3v13l-5-3" /></Ic>;
const IconShared  = (p) => <Ic {...p}><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" /><path d="M12 3v13 M7 8l5-5 5 5" /></Ic>;
const IconTrash   = (p) => <Ic {...p} d="M3 6h18 M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2 M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" />;

/* ---- ui icons ---- */
const IconPlus    = (p) => <Ic {...p} d="M12 5v14 M5 12h14" />;
const IconSun     = (p) => <Ic {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4" /></Ic>;
const IconMoon    = (p) => <Ic {...p} d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />;
const IconGear    = (p) => <Ic {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 2.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 7 2.6h.1A1.6 1.6 0 0 0 8.2 1.1V1a2 2 0 1 1 4 0v.1A1.6 1.6 0 0 0 15 2.6a1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1H23a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" /></Ic>;
const IconChevron = (p) => <Ic {...p} d="M6 9l6 6 6-6" />;
const IconDots    = (p) => <Ic {...p}><circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none"/></Ic>;
const IconUndo    = (p) => <Ic {...p} d="M3 7v6h6 M3 13a9 9 0 1 0 3-7.7L3 8" />;
const IconRedo    = (p) => <Ic {...p} d="M21 7v6h-6 M21 13a9 9 0 1 1-3-7.7L21 8" />;
const IconType    = (p) => <Ic {...p} d="M4 6V5h16v1 M9 19h6 M12 5v14" />;
const IconImage   = (p) => <Ic {...p}><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9.5" r="1.6" /><path d="M21 16l-5-5L5 20" /></Ic>;
const IconSave    = (p) => <Ic {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8 M7 3v5h8" /></Ic>;
const IconCheck   = (p) => <Ic {...p} d="M20 6L9 17l-5-5" />;
const IconBold    = (p) => <Ic {...p} d="M6 4h7a4 4 0 0 1 0 8H6Z M6 12h8a4 4 0 0 1 0 8H6Z" />;
const IconItalic  = (p) => <Ic {...p} d="M19 4h-9 M14 20H5 M15 4L9 20" />;
const IconUnderln = (p) => <Ic {...p} d="M6 4v6a6 6 0 0 0 12 0V4 M4 21h16" />;
const IconAlignL  = (p) => <Ic {...p} d="M3 6h18 M3 12h12 M3 18h15" />;
const IconAlignC  = (p) => <Ic {...p} d="M3 6h18 M6 12h12 M5 18h14" />;
const IconAlignR  = (p) => <Ic {...p} d="M3 6h18 M9 12h12 M6 18h15" />;
const IconAlignJ  = (p) => <Ic {...p} d="M3 6h18 M3 12h18 M3 18h18" />;
const IconMinus   = (p) => <Ic {...p} d="M5 12h14" />;
const IconClock   = (p) => <Ic {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Ic>;

/* line-height glyphs */
const IconLHtight = (p) => <Ic {...p}><path d="M4 8h16 M4 11h16 M4 14h16" /></Ic>;
const IconLHnorm  = (p) => <Ic {...p}><path d="M4 7h16 M4 12h16 M4 17h16" /></Ic>;
const IconLHrelax = (p) => <Ic {...p}><path d="M4 6h16 M4 12h16 M4 18h16" /></Ic>;

/* margin preset glyphs (tiny page diagrams) */
const MarginGlyph = ({ variant, active }) => {
  const stroke = active ? "var(--brown)" : "rgba(44,44,44,0.45)";
  const fill = active ? "rgba(139,115,85,0.18)" : "rgba(44,44,44,0.10)";
  const bars = {
    narrow:  { x: 3.5, w: 17 },
    normal:  { x: 5,   w: 14 },
    wide:    { x: 7,   w: 10 },
    left:    { x: 4,   w: 9 },
    right:   { x: 11,  w: 9 },
  }[variant];
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <rect x="2" y="2.5" width="20" height="19" rx="2" fill="none" stroke={stroke} strokeWidth="1.3" />
      <g fill={fill}>
        {[6, 9, 12, 15, 18].map((y) => (
          <rect key={y} x={bars.x} y={y} width={bars.w} height="1.4" rx="0.7" />
        ))}
      </g>
    </svg>
  );
};

/* ---- botanical desk props (thin stroke, warm brown) ---- */
const BotanicalStem = ({ className = "", style }) => (
  <svg viewBox="0 0 120 260" width="120" height="260" fill="none" className={className} style={style}
       stroke="var(--rose)" strokeWidth="1.4" strokeLinecap="round">
    <path d="M64 258 C 58 200 54 150 56 96" />
    <path d="M56 150 C 36 140 22 150 14 168 C 30 170 46 166 56 150" fill="rgba(196,166,138,0.10)" />
    <path d="M56 124 C 76 116 92 122 102 138 C 84 142 68 138 56 124" fill="rgba(196,166,138,0.10)" />
    <path d="M56 178 C 40 174 28 182 22 196 C 36 198 48 194 56 178" fill="rgba(196,166,138,0.08)" />
    {/* dried bloom */}
    <g transform="translate(56 92)" stroke="var(--rose)">
      <path d="M0 6 C -14 -2 -14 -22 0 -28 C 14 -22 14 -2 0 6" fill="rgba(196,166,138,0.14)" />
      <path d="M0 4 C -9 0 -9 -16 0 -22 C 9 -16 9 0 0 4" fill="rgba(196,166,138,0.10)" />
      <path d="M0 2 V -18" />
    </g>
  </svg>
);

const BotanicalLeaf = ({ className = "", style }) => (
  <svg viewBox="0 0 160 90" width="160" height="90" fill="none" className={className} style={style}
       stroke="var(--sage)" strokeWidth="1.3" strokeLinecap="round">
    <path d="M2 78 C 50 70 110 54 156 12" />
    <path d="M40 70 C 44 54 60 44 82 44 C 70 60 56 68 40 70" fill="rgba(139,154,130,0.10)" />
    <path d="M78 56 C 84 42 100 34 120 36 C 108 50 94 56 78 56" fill="rgba(139,154,130,0.10)" />
    <path d="M112 42 C 120 30 134 24 150 28 C 140 40 128 44 112 42" fill="rgba(139,154,130,0.08)" />
  </svg>
);

const BotanicalSprig = ({ className = "", style }) => (
  <svg viewBox="0 0 90 200" width="90" height="200" fill="none" className={className} style={style}
       stroke="var(--rose)" strokeWidth="1.3" strokeLinecap="round">
    <path d="M48 198 C 44 150 42 100 46 40" />
    {[60, 90, 120, 150].map((y, i) => (
      <g key={y}>
        <path d={`M46 ${y} C 30 ${y - 6} 20 ${y + 2} 12 ${y + 12}`} />
        <path d={`M46 ${y} C 62 ${y - 6} 72 ${y + 2} 80 ${y + 12}`} />
      </g>
    ))}
    <circle cx="46" cy="36" r="5" fill="rgba(196,166,138,0.16)" />
  </svg>
);

Object.assign(window, {
  IconLetters, IconDraft, IconCapsule, IconCollections, IconShared, IconTrash,
  IconPlus, IconSun, IconMoon, IconGear, IconChevron, IconDots, IconUndo, IconRedo,
  IconType, IconImage, IconSave, IconCheck, IconBold, IconItalic, IconUnderln,
  IconAlignL, IconAlignC, IconAlignR, IconAlignJ, IconMinus, IconClock,
  IconLHtight, IconLHnorm, IconLHrelax, MarginGlyph,
  BotanicalStem, BotanicalLeaf, BotanicalSprig,
});
