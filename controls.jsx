/* ============================================================
   controls.jsx — right sidebar (280px)
   Fonts · Size · Line height · Align · Ink · Margins
   ============================================================ */
const { useState: useStateC, useRef: useRefC, useEffect: useEffectC } = React;

function CtrlBlock({ title, children, extra }) {
  return (
    <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--hairline)" }}>
      <div style={{ display: "flex", alignItems: "baseline", marginBottom: 13 }}>
        <span className="eyebrow" style={{ flex: 1 }}>{title}</span>
        {extra}
      </div>
      {children}
    </div>
  );
}

/* toggle group of icon buttons */
function ToggleRow({ items, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {items.map(({ id, Icon, tip }) => {
        const on = value === id;
        return (
          <button key={id} onClick={() => onChange(id)} data-tip={tip} className="t200 tip"
            style={{
              flex: 1, display: "flex", justifyContent: "center", padding: "9px 0",
              borderRadius: 7, cursor: "pointer",
              border: "1px solid", borderColor: on ? "transparent" : "var(--hairline)",
              background: on ? "rgba(139,115,85,0.13)" : "transparent",
              color: on ? "var(--brown)" : "rgba(44,44,44,0.5)",
            }}>
            <Icon size={17} />
          </button>
        );
      })}
    </div>
  );
}

function FontDropdown({ value, onChange }) {
  const [open, setOpen] = useStateC(false);
  const ref = useRefC(null);
  const cur = FONTS.find((f) => f.id === value);

  useEffectC(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen((o) => !o)} className="t200"
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 8,
          padding: "10px 13px", borderRadius: 8, cursor: "pointer",
          border: "1px solid var(--hairline)", background: "rgba(255,255,255,0.45)",
          textAlign: "left",
        }}>
        <span style={{ flex: 1, fontFamily: cur.family, fontSize: 22, lineHeight: 1, color: "var(--charcoal)" }}>
          {cur.name.split(" ")[0]}
        </span>
        <span className="t200" style={{ color: "var(--brown)", transform: open ? "rotate(180deg)" : "none", display: "flex" }}>
          <IconChevron size={15} />
        </span>
      </button>
      {open && (
        <div className="rise" style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 30,
          background: "var(--cream)", border: "1px solid var(--hairline)", borderRadius: 10,
          boxShadow: "var(--sh-lift)", overflow: "hidden", padding: 5,
        }}>
          {FONTS.map((f) => {
            const on = f.id === value;
            return (
              <button key={f.id} onClick={() => { onChange(f.id); setOpen(false); }} className="t200"
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 11px", borderRadius: 7, cursor: "pointer", border: "none",
                  background: on ? "rgba(139,115,85,0.10)" : "transparent", textAlign: "left",
                }}
                onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = "rgba(139,115,85,0.05)"; }}
                onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = "transparent"; }}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontFamily: f.family, fontSize: 21, lineHeight: 1.1, color: "var(--charcoal)" }}>{f.name}</span>
                  <span style={{ display: "block", fontSize: 11, color: "rgba(44,44,44,0.4)", marginTop: 2 }}>{f.note}</span>
                </span>
                {on && <IconCheck size={15} sw={2.2} style={{ color: "var(--brown)" }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ControlsPanel(props) {
  const {
    font, setFont, fontSize, setFontSize, lineHeight, setLineHeight,
    align, setAlign, ink, setInk, margins, setMargins, onClose,
  } = props;

  return (
    <aside className="controls-panel">
      <div className="mobile-only" style={{
        padding: "18px 20px 8px", borderBottom: "1px solid var(--hairline)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--cream)"
      }}>
        <span className="eyebrow" style={{ fontSize: 12 }}>Customization</span>
        <button className="t200" onClick={onClose}
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
      <CtrlBlock title="Fonts">
        <FontDropdown value={font} onChange={setFont} />
      </CtrlBlock>

      <CtrlBlock title="Size" extra={<span style={{ fontSize: 12, color: "rgba(44,44,44,0.4)", fontVariantNumeric: "tabular-nums" }}>{fontSize}px</span>}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <span style={{ fontSize: 13, color: "rgba(44,44,44,0.5)", fontWeight: 600 }}>A-</span>
          <input type="range" min="16" max="36" step="1" value={fontSize}
            onChange={(e) => setFontSize(+e.target.value)}
            style={{ flex: 1, accentColor: "var(--brown)" }} />
          <span style={{ fontSize: 19, color: "rgba(44,44,44,0.5)", fontWeight: 600 }}>A+</span>
        </div>
      </CtrlBlock>

      <CtrlBlock title="Line Height">
        <ToggleRow value={lineHeight} onChange={setLineHeight}
          items={[
            { id: "tight", Icon: IconLHtight, tip: "Tight" },
            { id: "normal", Icon: IconLHnorm, tip: "Normal" },
            { id: "relaxed", Icon: IconLHrelax, tip: "Relaxed" },
          ]} />
      </CtrlBlock>

      <CtrlBlock title="Text Align">
        <ToggleRow value={align} onChange={setAlign}
          items={[
            { id: "left", Icon: IconAlignL, tip: "Left" },
            { id: "center", Icon: IconAlignC, tip: "Center" },
            { id: "right", Icon: IconAlignR, tip: "Right" },
            { id: "justify", Icon: IconAlignJ, tip: "Justify" },
          ]} />
      </CtrlBlock>

      <CtrlBlock title="Ink Colour">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {INKS.map((c) => {
            const on = ink === c.id;
            return (
              <button key={c.id} onClick={() => setInk(c.id)} className="t200 tip" data-tip={c.name}
                style={{
                  width: 30, height: 30, borderRadius: "50%", cursor: "pointer", padding: 0,
                  background: c.value, border: "1px solid rgba(0,0,0,0.12)",
                  outline: on ? "2px solid var(--brown)" : "2px solid transparent",
                  outlineOffset: 2,
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.25), 0 1px 3px rgba(94,74,48,0.2)",
                }} />
            );
          })}
        </div>
      </CtrlBlock>

      <CtrlBlock title="Margins">
        <div style={{ display: "flex", gap: 7, justifyContent: "space-between" }}>
          {["narrow", "normal", "wide", "left", "right"].map((m) => {
            const on = margins === m;
            return (
              <button key={m} onClick={() => setMargins(m)} data-tip={m[0].toUpperCase() + m.slice(1)}
                className="t200 tip"
                style={{
                  flex: 1, display: "flex", justifyContent: "center", padding: "7px 0",
                  borderRadius: 7, cursor: "pointer",
                  border: "1px solid", borderColor: on ? "var(--brown)" : "var(--hairline)",
                  background: on ? "rgba(139,115,85,0.10)" : "transparent",
                }}>
                <MarginGlyph variant={m} active={on} />
              </button>
            );
          })}
        </div>
      </CtrlBlock>
    </aside>
  );
}

window.ControlsPanel = ControlsPanel;
