/* ============================================================
   sidebar.jsx — left navigation rail (240px)
   ============================================================ */
const { useState: useStateSB, useEffect: useEffectSB } = React;

function Sidebar({ active, setActive, theme, setTheme, onSettings, counts = {}, onNew }) {
  const [quoteIdx, setQuoteIdx] = useStateSB(0);
  const [fade, setFade] = useStateSB(true);

  useEffectSB(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setQuoteIdx((i) => (i + 1) % QUOTES.length);
        setFade(true);
      }, 450);
    }, 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <aside
      className="rise"
      style={{
        width: 240, flexShrink: 0, height: "100%",
        background: "var(--cream)",
        borderRight: "1px solid var(--hairline)",
        display: "flex", flexDirection: "column",
        padding: "26px 18px 16px",
      }}
    >
      {/* logo */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div className="script" style={{ fontSize: 30, lineHeight: 1, color: "var(--charcoal)", fontWeight: 600 }}>
          Between&nbsp;Us
        </div>
        <svg width="36" height="24" viewBox="0 0 32 32" style={{ margin: "10px auto 0", display: "block" }}>
          <rect x="2" y="6" width="28" height="20" rx="3" fill="rgba(139,115,85,0.06)" stroke="var(--rose)" strokeWidth="1.8"/>
          <path d="M2 8l14 10L30 8" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinejoin="round"/>
          <circle cx="16" cy="18" r="3.5" fill="#C0492E" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5"/>
        </svg>
      </div>

      {/* new letter */}
      <button
        className="t200 lift"
        onClick={onNew}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          width: "100%", padding: "11px 14px", marginBottom: 22,
          background: "var(--brown)", color: "#F8F2E9",
          border: "none", borderRadius: 8, cursor: "pointer",
          fontSize: 14, fontWeight: 600, letterSpacing: "0.01em",
          boxShadow: "0 2px 8px rgba(139,115,85,0.30)",
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
        <IconPlus size={16} sw={2} /> New Letter
      </button>

      {/* nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV.map(({ id, label, count, Icon }) => {
          const on = active === id;
          const liveCount = counts[id] != null ? counts[id] : count;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className="t200"
              style={{
                display: "flex", alignItems: "center", gap: 11,
                padding: "9px 11px", border: "none", cursor: "pointer",
                background: on ? "rgba(139,115,85,0.10)" : "transparent",
                borderRadius: 7, textAlign: "left", width: "100%",
                color: on ? "var(--brown)" : "rgba(44,44,44,0.66)",
                fontWeight: on ? 600 : 500, fontSize: 14,
              }}
              onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = "rgba(139,115,85,0.05)"; }}
              onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ display: "flex", color: on ? "var(--brown)" : "rgba(44,44,44,0.5)" }}>
                <Icon size={17} />
              </span>
              <span style={{ flex: 1 }}>{label}</span>
              {liveCount != null && (
                <span style={{
                  fontSize: 12, color: on ? "var(--brown)" : "rgba(44,44,44,0.4)",
                  fontVariantNumeric: "tabular-nums", fontWeight: 500,
                }}>{liveCount}</span>
              )}
              <span className="nav-dot" style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "var(--brown)",
                opacity: on ? 1 : 0,
                transform: on ? "translateX(0)" : "translateX(-6px)",
              }} />
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      {/* rotating quote */}
      <div style={{
        padding: "16px 12px", borderTop: "1px solid var(--hairline)",
        marginBottom: 6,
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic", fontSize: 15.5, lineHeight: 1.45,
          color: "rgba(44,44,44,0.6)", margin: 0,
          transition: "opacity 0.45s ease", opacity: fade ? 1 : 0,
          textWrap: "pretty",
        }}>
          “{QUOTES[quoteIdx]}”
        </p>
      </div>

      {/* theme + settings row */}
      <div style={{ display: "flex", gap: 6, paddingTop: 4 }}>
        {[
          { id: "day", Icon: IconSun, tip: "Daylight" },
          { id: "evening", Icon: IconMoon, tip: "Evening" },
        ].map(({ id, Icon, tip }) => {
          const on = theme === id;
          return (
            <button key={id} onClick={() => setTheme(id)} data-tip={tip}
              className="t200 tip"
              style={{
                flex: 1, display: "flex", justifyContent: "center", padding: "8px 0",
                background: on ? "rgba(139,115,85,0.12)" : "transparent",
                border: "1px solid", borderColor: on ? "transparent" : "var(--hairline)",
                borderRadius: 7, cursor: "pointer",
                color: on ? "var(--brown)" : "rgba(44,44,44,0.45)",
              }}>
              <Icon size={16} />
            </button>
          );
        })}
        <button onClick={onSettings} data-tip="Settings" className="t200 tip"
          style={{
            flex: 1, display: "flex", justifyContent: "center", padding: "8px 0",
            background: "transparent", border: "1px solid var(--hairline)",
            borderRadius: 7, cursor: "pointer", color: "rgba(44,44,44,0.45)",
          }}>
          <IconGear size={16} />
        </button>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
