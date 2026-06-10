/* ============================================================
   letter.jsx — center panel: top bar, the letter on the desk,
   botanical props, floating frosted toolbar.
   THE LETTER PAPER IS THE CENTERPIECE.
   ============================================================ */
const { useState: useStateL, useRef: useRefL, useEffect: useEffectL } = React;

const LH_MAP = { tight: 1.45, normal: 1.85, relaxed: 2.35 };
const MARGIN_MAP = {
  narrow: { px: 48, l: 48, r: 48 },
  normal: { px: 70, l: 70, r: 70 },
  wide:   { px: 104, l: 104, r: 104 },
  left:   { px: 70, l: 120, r: 52 },
  right:  { px: 70, l: 52, r: 120 },
};

/* Caret-safe contentEditable: innerHTML is set once on mount; thereafter
   the DOM is the source of truth and we only push changes UP via onChange,
   never back down — so the caret never jumps. Remount (via React key) to
   load different content. */
function Editable({ html, onChange, className = "", style, placeholder, single, innerRef }) {
  const ref = useRefL(null);
  useEffectL(() => {
    if (ref.current) ref.current.innerHTML = html || "";
  }, []); // mount only
  const setRef = (el) => { ref.current = el; if (innerRef) innerRef.current = el; };
  return (
    <div
      ref={setRef}
      className={`ed ${className}`}
      style={style}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-placeholder={placeholder}
      onInput={(e) => onChange(e.currentTarget.innerHTML)}
      onKeyDown={single ? (e) => { if (e.key === "Enter") e.preventDefault(); } : undefined}
    />
  );
}

function TopBar({ title, setTitle, onSaveDraft, onPreview }) {
  const [editing, setEditing] = useStateL(false);
  const [saved, setSaved] = useStateL(false);
  const inputRef = useRefL(null);

  useEffectL(() => { if (editing && inputRef.current) inputRef.current.select(); }, [editing]);

  const doSave = () => {
    onSaveDraft && onSaveDraft();
    setSaved(true);
    setTimeout(() => setSaved(false), 1900);
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "16px 28px", borderBottom: "1px solid var(--hairline)",
      background: "var(--ivory)", flexShrink: 0,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {editing ? (
          <input ref={inputRef} value={title} autoFocus
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => { if (e.key === "Enter") setEditing(false); }}
            className="script"
            style={{
              fontSize: 28, color: "var(--charcoal)", background: "transparent",
              border: "none", borderBottom: "1.5px dashed var(--rose)", outline: "none",
              width: "100%", padding: "0 0 2px", fontWeight: 600,
            }} />
        ) : (
          <button onClick={() => setEditing(true)} className="script tip" data-tip="Click to rename"
            style={{
              fontSize: 28, color: "var(--charcoal)", background: "transparent", border: "none",
              cursor: "text", padding: 0, fontWeight: 600, maxWidth: "100%",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
            {title}
          </button>
        )}
      </div>

      <button onClick={doSave} className="t200"
        style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
          background: "transparent", border: "none", cursor: "pointer",
          color: saved ? "var(--sage)" : "rgba(44,44,44,0.6)", fontSize: 13.5, fontWeight: 500,
        }}>
        {saved ? (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path className="check-path" d="M20 6L9 17l-5-5" />
            </svg>
            Saved
          </>
        ) : (
          <>Save Draft</>
        )}
      </button>

      <button onClick={onPreview} className="t200 lift"
        style={{
          padding: "8px 18px", background: "var(--charcoal)", color: "var(--ivory)",
          border: "none", borderRadius: 7, cursor: "pointer", fontSize: 13.5, fontWeight: 500,
          boxShadow: "0 2px 8px rgba(44,44,44,0.22)",
        }}>
        Preview
      </button>

      <button data-tip="More" className="t200 tip"
        style={{
          display: "flex", padding: 8, background: "transparent", border: "1px solid var(--hairline)",
          borderRadius: 7, cursor: "pointer", color: "rgba(44,44,44,0.55)",
        }}>
        <IconDots size={16} />
      </button>
    </div>
  );
}

function FloatingToolbar({ onCmd, onSave }) {
  const [savedFx, setSavedFx] = useStateL(false);
  const tools = [
    { id: "undo", Icon: IconUndo, tip: "Undo" },
    { id: "format", Icon: IconType, tip: "Format" },
    { id: "image", Icon: IconImage, tip: "Insert image" },
    { id: "redo", Icon: IconRedo, tip: "Redo" },
  ];
  return (
    <div className="frost" style={{
      position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)",
      display: "flex", alignItems: "center", gap: 4, padding: "7px 9px", borderRadius: 99,
      zIndex: 20,
    }}>
      {tools.map(({ id, Icon, tip }) => (
        <button key={id} onClick={() => onCmd(id)} data-tip={tip} className="t200 tip"
          style={{
            display: "flex", padding: 9, borderRadius: "50%", border: "none", cursor: "pointer",
            background: "transparent", color: "rgba(44,44,44,0.62)",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(139,115,85,0.14)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
          <Icon size={18} />
        </button>
      ))}
      <span style={{ width: 1, height: 22, background: "var(--hairline)", margin: "0 3px" }} />
      <button onClick={() => { onSave && onSave(); setSavedFx(true); setTimeout(() => setSavedFx(false), 1500); }}
        data-tip="Save & seal" className="t200 tip"
        style={{
          display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 99,
          border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
          background: savedFx ? "var(--sage)" : "var(--brown)", color: "#F8F2E9",
          transition: "background 0.3s ease",
        }}>
        {savedFx ? <IconCheck size={16} sw={2.4} /> : <IconSave size={16} />}
        {savedFx ? "Sealed" : "Save"}
      </button>
    </div>
  );
}

function LetterCanvas(props) {
  const {
    paperCls, font, fontSize, lineHeight, align, ink, margins,
    seal, sealKey, bodyRef, docKey,
    greeting, body, signoff, signature, onField,
  } = props;

  const m = MARGIN_MAP[margins] || MARGIN_MAP.normal;
  const sealObj = SEALS.find((s) => s.id === seal);
  const italicGreeting = font === "playfair" || font === "cormorant";

  return (
    <div className="desk" style={{ flex: 1, position: "relative", overflow: "auto" }}>
      {/* botanical desk props */}
      <BotanicalStem className="sway" style={{ position: "absolute", top: -24, left: 8, opacity: 0.85, "--rot": "-4deg", pointerEvents: "none", zIndex: 1 }} />
      <BotanicalSprig className="sway" style={{ position: "absolute", bottom: -10, right: 18, opacity: 0.8, "--rot": "5deg", pointerEvents: "none", zIndex: 1 }} />
      <BotanicalLeaf className="sway" style={{ position: "absolute", bottom: 40, left: -34, opacity: 0.7, "--rot": "-2deg", pointerEvents: "none", zIndex: 1 }} />

      {/* centering frame */}
      <div style={{
        minHeight: "100%", display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "56px 40px 130px",
      }}>
        <div className="paper-stack" style={{ width: "100%", maxWidth: 620 }}>
          <div className="paper" style={{ borderRadius: 3, position: "relative" }}>
            <div className={`paper-sheet ${paperCls}`}>
              <span className="paper-grain" />
              <span className="paper-vignette" />
            </div>

            {/* seal sits at the foot of the letter */}
            {sealObj && (
              <span key={sealKey} className={`wax ${sealObj.cls} seal-press`} style={{
                position: "absolute", bottom: 26, right: 34, width: 58, height: 58, zIndex: 5,
              }} />
            )}

            <div className="paper-content" style={{
              padding: `${m.px}px ${m.r}px ${Math.max(m.px, 90)}px ${m.l}px`,
              minHeight: 720,
            }}>
              <div style={{
                fontFamily: FONTS.find((f) => f.id === font).family,
                fontSize: fontSize,
                lineHeight: LH_MAP[lineHeight],
                textAlign: align,
                color: INKS.find((c) => c.id === ink).value,
                transition: "color 0.3s ease, font-size 0.2s ease, line-height 0.25s ease",
              }}>
                <Editable
                  key={docKey + ":greeting"} single
                  html={greeting}
                  onChange={(v) => onField("greeting", v)}
                  placeholder="My Dearest,"
                  style={{ marginBottom: "0.7em", fontStyle: italicGreeting ? "italic" : "normal" }}
                />
                <Editable
                  key={docKey + ":body"}
                  innerRef={bodyRef}
                  className="letter-body"
                  html={body}
                  onChange={(v) => onField("body", v)}
                  placeholder="Begin writing…"
                />
                <div style={{ marginTop: "1.6em", opacity: 0.92 }}>
                  <Editable
                    key={docKey + ":signoff"} single
                    html={signoff}
                    onChange={(v) => onField("signoff", v)}
                    placeholder="Ever yours,"
                  />
                  <Editable
                    key={docKey + ":signature"} single
                    html={signature}
                    onChange={(v) => onField("signature", v)}
                    placeholder="— Your name"
                    style={{ marginTop: "0.15em", fontSize: "1.15em" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Editable, TopBar, FloatingToolbar, LetterCanvas });
