/* ============================================================
   materials.jsx — middle-left material panel (280px)
   Collapsible: Paper · Envelope · Seal · Cover
   ============================================================ */
const { useState: useStateM, useRef: useRefM, useEffect: useEffectM } = React;

/* accordion section shell */
function Section({ id, title, count, open, onToggle, children }) {
  const bodyRef = useRefM(null);
  const [maxH, setMaxH] = useStateM(open ? "none" : 0);

  useEffectM(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (open) {
      setMaxH(el.scrollHeight);
      const t = setTimeout(() => setMaxH("none"), 400);
      return () => clearTimeout(t);
    } else {
      setMaxH(el.scrollHeight);
      requestAnimationFrame(() => requestAnimationFrame(() => setMaxH(0)));
    }
  }, [open, children]);

  return (
    <div style={{ borderBottom: "1px solid var(--hairline)" }}>
      <button onClick={onToggle} className="t200"
        style={{
          display: "flex", alignItems: "center", width: "100%",
          padding: "15px 16px", background: "transparent", border: "none",
          cursor: "pointer", gap: 8,
        }}>
        <span className="eyebrow" style={{ flex: 1, textAlign: "left" }}>{title}</span>
        {count != null && (
          <span style={{ fontSize: 11, color: "rgba(44,44,44,0.35)", fontVariantNumeric: "tabular-nums" }}>{count}</span>
        )}
        <span className="t200" style={{ color: "var(--brown)", transform: open ? "rotate(0deg)" : "rotate(-90deg)", display: "flex" }}>
          <IconChevron size={15} />
        </span>
      </button>
      <div className="acc-body" style={{ maxHeight: maxH, opacity: open ? 1 : 0 }}>
        <div ref={bodyRef} style={{ padding: "2px 16px 18px" }}>{children}</div>
      </div>
    </div>
  );
}

/* a single paper swatch */
function PaperSwatch({ p, selected, onClick }) {
  return (
    <button onClick={onClick} className="swatch tip" data-tip={p.name}
      style={{
        aspectRatio: "1", borderRadius: 7, cursor: "pointer", position: "relative",
        border: selected ? "2px solid var(--brown)" : "1px solid var(--hairline)",
        padding: 0, overflow: "hidden",
        boxShadow: selected ? "0 4px 12px rgba(139,115,85,0.25)" : "var(--sh-soft)",
      }}>
      <span className={p.cls} style={{ position: "absolute", inset: 0, borderRadius: 5, display: "block" }} />
      {selected && (
        <span style={{
          position: "absolute", top: 4, right: 4, width: 15, height: 15, borderRadius: "50%",
          background: "var(--brown)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <IconCheck size={10} sw={2.6} />
        </span>
      )}
    </button>
  );
}

/* envelope thumbnail svg */
function EnvelopeThumb({ e, selected, onClick }) {
  return (
    <button onClick={onClick} className="swatch lift tip" data-tip={e.name}
      style={{
        cursor: "pointer", padding: 5, borderRadius: 8, position: "relative",
        border: selected ? "2px solid var(--brown)" : "1px solid var(--hairline)",
        background: "rgba(255,255,255,0.4)",
        boxShadow: selected ? "0 5px 14px rgba(139,115,85,0.22)" : "var(--sh-soft)",
      }}>
      <svg viewBox="0 0 80 56" width="100%" style={{ display: "block" }}>
        <rect x="2" y="6" width="76" height="46" rx="4" fill={e.fill}
              stroke={e.dark ? "rgba(255,255,255,0.15)" : "rgba(139,115,85,0.28)"} strokeWidth="1" />
        {e.lined && selected && (
          <g opacity="0.6">
            <path d="M14 14 q4 5 0 10 M26 14 q4 5 0 10 M38 14 q4 5 0 10 M50 14 q4 5 0 10 M62 14 q4 5 0 10"
                  stroke="var(--rose)" strokeWidth="0.8" fill="none" />
          </g>
        )}
        <path d="M2 8 L40 32 L78 8" fill={e.flap}
              stroke={e.dark ? "rgba(255,255,255,0.18)" : "rgba(139,115,85,0.32)"} strokeWidth="1" strokeLinejoin="round" />
        <path d="M2 8 L40 32 L78 8" fill="rgba(0,0,0,0.04)" />
      </svg>
      {selected && (
        <span style={{
          position: "absolute", bottom: 5, right: 5, width: 14, height: 14, borderRadius: "50%",
          background: "var(--brown)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <IconCheck size={9} sw={2.6} />
        </span>
      )}
    </button>
  );
}

/* cover preview card */
function CoverCard({ c, selected, onClick }) {
  return (
    <button onClick={onClick} className="swatch tip" data-tip={c.name}
      style={{
        cursor: "pointer", padding: 0, borderRadius: 6, overflow: "hidden", position: "relative",
        aspectRatio: "0.74",
        border: selected ? "2px solid var(--brown)" : "1px solid var(--hairline)",
        boxShadow: selected ? "0 5px 14px rgba(139,115,85,0.22)" : "var(--sh-soft)",
      }}>
      <div style={{ position: "absolute", inset: 0, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {c.id === "botanical" && (
          <svg viewBox="0 0 40 50" width="60%"><path d="M20 46 V14 M20 24 q-10 -4 -14 4 q9 3 14 -4 M20 18 q10 -4 14 4 q-9 3 -14 -4" stroke={c.accent} strokeWidth="1.3" fill="none" strokeLinecap="round"/></svg>
        )}
        {c.id === "floral" && (
          <svg viewBox="0 0 40 50" width="55%"><g stroke={c.accent} strokeWidth="1.2" fill="none"><circle cx="20" cy="20" r="4"/><path d="M20 16 q-6 -6 0 -10 q6 4 0 10 M24 20 q6 -6 10 0 q-4 6 -10 0 M20 24 q6 6 0 10 q-6 -4 0 -10 M16 20 q-6 6 -10 0 q4 -6 10 0 M20 28 V46"/></g></svg>
        )}
        {c.id === "minimal" && (
          <span className="script" style={{ color: c.accent, fontSize: 20 }}>Aa</span>
        )}
        {c.id === "kraft" && (
          <span style={{ width: "60%", height: "60%", border: `1.3px dashed ${c.accent}`, borderRadius: 3 }} />
        )}
        {c.id === "vintage" && (
          <svg viewBox="0 0 40 50" width="58%"><rect x="8" y="10" width="24" height="30" rx="1.5" stroke={c.accent} strokeWidth="1.2" fill="none"/><path d="M13 18 h14 M13 24 h14 M13 30 h9" stroke={c.accent} strokeWidth="1" opacity="0.6"/></svg>
        )}
      </div>
      {selected && (
        <span style={{
          position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%",
          background: "var(--brown)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <IconCheck size={9} sw={2.6} />
        </span>
      )}
    </button>
  );
}

function MaterialPanel(props) {
  const {
    selPaper, setSelPaper, selEnv, setSelEnv, selSeal, setSelSeal, selCover, setSelCover,
    onNew, theme, setTheme, onClose,
  } = props;
  const [open, setOpen] = useStateM({ paper: true, envelope: true, seal: false, cover: false });
  const [paperCat, setPaperCat] = useStateM("All");
  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  const papers = paperCat === "All" ? PAPERS : PAPERS.filter((p) => p.cat === paperCat);

  return (
    <div className="material-panel">
      {/* Brand Header & Quick Actions */}
      <div style={{ padding: "20px 20px 14px", borderBottom: "1px solid var(--hairline)", background: "var(--ivory)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="24" height="16" viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
              <rect x="2" y="6" width="28" height="20" rx="3" fill="rgba(139,115,85,0.06)" stroke="var(--rose)" strokeWidth="1.8"/>
              <path d="M2 8l14 10L30 8" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinejoin="round"/>
              <circle cx="16" cy="18" r="3.5" fill="#C0492E" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5"/>
            </svg>
            <div className="script" style={{ fontSize: 24, lineHeight: 1, color: "var(--charcoal)", fontWeight: 600 }}>
              Between Us
            </div>
          </div>
          {/* Close button for mobile */}
          <button className="mobile-only t200" onClick={onClose}
            style={{
              background: "transparent", border: "none", cursor: "pointer", color: "var(--brown)",
              display: "flex", padding: 4
            }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Action Row */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="t200 lift"
            onClick={onNew}
            style={{
              flex: 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "10px 12px",
              background: "var(--brown)", color: "#F8F2E9",
              border: "none", borderRadius: 8, cursor: "pointer",
              fontSize: 13, fontWeight: 600, letterSpacing: "0.01em",
              boxShadow: "0 2px 6px rgba(139,115,85,0.22)",
            }}
          >
            <IconPlus size={14} sw={2.2} /> New Letter
          </button>
          
          <button onClick={() => setTheme(theme === "day" ? "evening" : "day")}
            className="t200 tip" data-tip={theme === "day" ? "Evening theme" : "Daylight theme"}
            style={{
              width: 38, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(255,255,255,0.4)", border: "1px solid var(--hairline)",
              borderRadius: 8, cursor: "pointer", color: "var(--brown)",
            }}>
            {theme === "day" ? <IconMoon size={16} /> : <IconSun size={16} />}
          </button>
        </div>
      </div>
      {/* PAPER */}
      <Section id="paper" title="Paper" count={PAPERS.length} open={open.paper} onToggle={() => toggle("paper")}>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
          {PAPER_CATS.map((c) => (
            <button key={c} onClick={() => setPaperCat(c)} className="t200"
              style={{
                fontSize: 11, padding: "4px 9px", borderRadius: 99, cursor: "pointer",
                border: "1px solid", letterSpacing: "0.02em",
                borderColor: paperCat === c ? "var(--brown)" : "var(--hairline)",
                background: paperCat === c ? "rgba(139,115,85,0.12)" : "transparent",
                color: paperCat === c ? "var(--brown)" : "rgba(44,44,44,0.55)",
                fontWeight: paperCat === c ? 600 : 500,
              }}>{c}</button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {papers.map((p) => (
            <PaperSwatch key={p.id} p={p} selected={selPaper === p.id} onClick={() => setSelPaper(p.id)} />
          ))}
        </div>
      </Section>

      {/* ENVELOPE */}
      <Section id="envelope" title="Envelope" count={ENVELOPES.length} open={open.envelope} onToggle={() => toggle("envelope")}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {ENVELOPES.map((e) => (
            <EnvelopeThumb key={e.id} e={e} selected={selEnv === e.id} onClick={() => setSelEnv(e.id)} />
          ))}
        </div>
      </Section>

      {/* SEAL */}
      <Section id="seal" title="Wax Seal" open={open.seal} onToggle={() => toggle("seal")}>
        <div style={{ display: "flex", gap: 14, justifyContent: "space-around", padding: "4px 0" }}>
          {SEALS.map((s) => (
            <button key={s.id} onClick={() => setSelSeal(s.id)} className="tip" data-tip={s.name}
              style={{ padding: 0, border: "none", background: "transparent", cursor: "pointer", position: "relative" }}>
              <span className={`wax ${s.cls}`} style={{
                width: 48, height: 48, display: "block",
                outline: selSeal === s.id ? "2px solid var(--brown)" : "2px solid transparent",
                outlineOffset: 3, borderRadius: "50%",
                transition: "outline-color 0.2s ease",
              }} />
            </button>
          ))}
        </div>
      </Section>

      {/* COVER */}
      <Section id="cover" title="Cover" open={open.cover} onToggle={() => toggle("cover")}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 7 }}>
          {COVERS.map((c) => (
            <CoverCard key={c.id} c={c} selected={selCover === c.id} onClick={() => setSelCover(c.id)} />
          ))}
        </div>
      </Section>
    </div>
  );
}

window.MaterialPanel = MaterialPanel;
