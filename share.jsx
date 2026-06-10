/* ============================================================
   share.jsx — full-screen Preview + Create Shareable Link flow
   ============================================================ */
const { useState: useStateSh, useRef: useRefSh, useEffect: useEffectSh } = React;

const SH_LH = { tight: 1.45, normal: 1.85, relaxed: 2.35 };
const SH_MARGIN = {
  narrow: { px: 48, l: 48, r: 48 },
  normal: { px: 70, l: 70, r: 70 },
  wide:   { px: 104, l: 104, r: 104 },
  left:   { px: 70, l: 120, r: 52 },
  right:  { px: 70, l: 52, r: 120 },
};

/* read-only render of the letter — mirrors the editor sheet */
function StaticLetter({ doc }) {
  const paperCls = (PAPERS.find((p) => p.id === doc.selPaper) || {}).cls || "pp-smooth";
  const sealObj = SEALS.find((s) => s.id === doc.selSeal);
  const fam = (FONTS.find((f) => f.id === doc.font) || FONTS[0]).family;
  const inkVal = (INKS.find((c) => c.id === doc.ink) || INKS[0]).value;
  const italicGreeting = doc.font === "playfair" || doc.font === "cormorant";

  return (
    <div className="paper-stack" style={{ width: "100%", maxWidth: 600 }}>
      <div className="paper" style={{ borderRadius: 3, position: "relative" }}>
        <div className={`paper-sheet ${paperCls}`}>
          <span className="paper-grain" />
          <span className="paper-vignette" />
        </div>
        {sealObj && (
          <span className={`wax ${sealObj.cls}`} style={{
            position: "absolute", bottom: 26, right: 34, width: 58, height: 58, zIndex: 5,
          }} />
        )}
        <div className="paper-content" data-margins={doc.margins}>
          <div style={{ fontFamily: fam, fontSize: doc.fontSize, lineHeight: SH_LH[doc.lineHeight], textAlign: doc.align, color: inkVal }}>
            <div style={{ marginBottom: "0.7em", fontStyle: italicGreeting ? "italic" : "normal" }}
                 dangerouslySetInnerHTML={{ __html: doc.greeting || "" }} />
            <div className="letter-body" dangerouslySetInnerHTML={{ __html: doc.body || "" }} />
            <div style={{ marginTop: "1.6em", opacity: 0.92 }}>
              <div dangerouslySetInnerHTML={{ __html: doc.signoff || "" }} />
              <div style={{ marginTop: "0.15em", fontSize: "1.15em" }} dangerouslySetInnerHTML={{ __html: doc.signature || "" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewOverlay({ open, doc, onClose, onCreateLink, shareUrl, creating, viewer }) {
  const [copied, setCopied] = useStateSh(false);
  const inputRef = useRefSh(null);

  useEffectSh(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffectSh(() => { if (!open) setCopied(false); }, [open]);

  if (!open) return null;

  const copy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else if (inputRef.current) {
        inputRef.current.select();
        document.execCommand("copy");
      }
    } catch (e) { /* ignore */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const env = ENVELOPES.find((e) => e.id === doc.selEnv) || ENVELOPES[0];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(28, 22, 16, 0.86)",
      backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
      display: "flex", flexDirection: "column", animation: "rise 0.35s ease both",
    }}>
      {/* top bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14, padding: "20px 28px",
        color: "#EFE7DB", flexShrink: 0,
      }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          {/* mini envelope mark */}
          <svg viewBox="0 0 80 56" width="38" style={{ flexShrink: 0, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }}>
            <rect x="2" y="6" width="76" height="46" rx="4" fill={env.fill} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
            <path d="M2 8 L40 32 L78 8" fill={env.flap} stroke="rgba(0,0,0,0.18)" strokeWidth="1" strokeLinejoin="round" />
          </svg>
          <div style={{ minWidth: 0 }}>
            <div className="script" style={{ fontSize: 26, lineHeight: 1.05, color: "#FAF6F1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {doc.title || "Untitled letter"}
            </div>
            <div style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(239,231,219,0.55)", marginTop: 3 }}>
              {viewer ? "Shared with you" : "Preview"}
            </div>
          </div>
        </div>
        <button onClick={onClose} className="t200"
          style={{
            display: "flex", alignItems: "center", gap: 7, padding: "8px 16px",
            background: "rgba(255,255,255,0.08)", color: "#EFE7DB",
            border: "1px solid rgba(255,255,255,0.18)", borderRadius: 8, cursor: "pointer",
            fontSize: 13.5, fontWeight: 500,
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.16)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}>
          {viewer ? "Close" : "Back to desk"}
        </button>
      </div>

      {/* letter, scrollable */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "8px 24px 40px" }}>
        <StaticLetter doc={doc} />
      </div>

      {/* share bar */}
      {!viewer && (
        <div className="frost" style={{
          flexShrink: 0, margin: "0 auto 26px", padding: shareUrl ? "12px 14px 12px 22px" : "12px 14px",
          borderRadius: 99, display: "flex", alignItems: "center", gap: 12,
          maxWidth: "min(640px, calc(100% - 48px))", width: shareUrl ? "min(640px, calc(100% - 48px))" : "auto",
        }}>
          {!shareUrl ? (
            <button onClick={onCreateLink} disabled={creating} className="t200 lift"
              style={{
                display: "flex", alignItems: "center", gap: 9, padding: "11px 22px",
                background: "var(--brown)", color: "#F8F2E9", border: "none", borderRadius: 99,
                cursor: creating ? "default" : "pointer", fontSize: 14, fontWeight: 600,
                opacity: creating ? 0.75 : 1, boxShadow: "0 3px 12px rgba(139,115,85,0.35)",
              }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5 M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5" />
              </svg>
              {creating ? "Sealing your link…" : "Create Shareable Link"}
            </button>
          ) : (
            <>
              <span className="eyebrow" style={{ flexShrink: 0 }}>Link</span>
              <input ref={inputRef} readOnly value={shareUrl}
                onFocus={(e) => e.target.select()}
                style={{
                  flex: 1, minWidth: 0, background: "rgba(255,255,255,0.5)", border: "1px solid var(--hairline)",
                  borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "var(--charcoal)",
                  fontFamily: "'Inter', sans-serif", outline: "none",
                }} />
              <button onClick={copy} className="t200"
                style={{
                  display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", flexShrink: 0,
                  background: copied ? "var(--sage)" : "var(--charcoal)", color: "#F8F2E9",
                  border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13.5, fontWeight: 600,
                  transition: "background 0.3s ease",
                }}>
                {copied ? <IconCheck size={16} sw={2.4} /> : null}
                {copied ? "Copied" : "Copy"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { StaticLetter, PreviewOverlay });
