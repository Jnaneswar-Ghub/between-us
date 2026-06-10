/* ============================================================
   app.jsx — wires the desk together, holds all state,
   persistence (window.Store), auto-save, preview + share.
   ============================================================ */
const { useState, useRef, useEffect, useCallback } = React;

const newId = () =>
  "L" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const normalizeDoc = (raw, id) => ({ ...DEFAULT_DOC, ...(raw || {}), id: id || (raw && raw.id) || newId() });

// ---- URL Compression / Decompression Helpers ----
const KEY_MAP = {
  title: "t", greeting: "g", body: "b", signoff: "so", signature: "sig",
  selPaper: "p", selEnv: "e", selSeal: "s", selCover: "c",
  font: "f", fontSize: "sz", lineHeight: "lh", align: "a", ink: "i", margins: "m"
};
const REV_KEY_MAP = {
  t: "title", g: "greeting", b: "body", so: "signoff", sig: "signature",
  p: "selPaper", e: "selEnv", s: "selSeal", c: "selCover",
  f: "font", sz: "fontSize", lh: "lineHeight", a: "align", i: "ink", m: "margins"
};

const compressDoc = (d) => {
  const out = {};
  for (const k in KEY_MAP) {
    const shortKey = KEY_MAP[k];
    const val = d[k];
    if (val !== undefined && val !== DEFAULT_DOC[k]) {
      out[shortKey] = val;
    }
  }
  return out;
};

const decompressDoc = (comp) => {
  const out = { ...DEFAULT_DOC };
  for (const shortKey in comp) {
    const k = REV_KEY_MAP[shortKey];
    if (k) out[k] = comp[shortKey];
  }
  return out;
};

function App() {
  // theme + responsive side-panels
  const [theme, setTheme] = useState("day");
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  // the whole letter lives in one object
  const [doc, setDoc] = useState(() => normalizeDoc(DEFAULT_DOC, newId()));
  const [sealKey, setSealKey] = useState(0);
  const [counts, setCounts] = useState({ letters: 0, drafts: 0, shared: 0 });

  // preview / share
  const [previewOpen, setPreviewOpen] = useState(false);
  const [viewerMode, setViewerMode] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);
  const [creatingLink, setCreatingLink] = useState(false);

  const bodyRef = useRef(null);
  const docRef = useRef(doc);

  // ---- patch helpers — keep docRef in sync SYNCHRONOUSLY so a save fired
  //      in the same tick as an edit always reads the latest content ----
  const update = useCallback((patch) => setDoc((d) => {
    const n = { ...d, ...patch };
    docRef.current = n;
    return n;
  }), []);
  const onField = useCallback((field, html) => setDoc((d) => {
    const n = { ...d, [field]: html };
    docRef.current = n;
    return n;
  }), []);

  const applyDoc = useCallback((nd) => { docRef.current = nd; setDoc(nd); }, []);

  const setSeal = (id) => { update({ selSeal: id }); setSealKey((k) => k + 1); };

  // ---- theme ----
  useEffect(() => {
    document.documentElement.classList.toggle("evening", theme === "evening");
    document.body.classList.toggle("evening", theme === "evening");
  }, [theme]);

  // ---- counts from storage ----
  const refreshCounts = useCallback(async () => {
    const [ls, sh] = await Promise.all([Store.list("letter:"), Store.list("shared:")]);
    const letters = ls.length;
    const drafts = ls.filter((e) => e.value && e.value.status !== "sealed").length;
    setCounts({ letters, drafts, shared: sh.length });
  }, []);

  // ---- save ----
  const saveLetter = useCallback(async (patch) => {
    const d = { ...docRef.current, ...(patch || {}), updatedAt: Date.now() };
    if (!d.createdAt) d.createdAt = d.updatedAt;
    applyDoc(d);
    await Store.set("letter:" + d.id, d);
    // keep the shared copy in sync if this letter was shared
    if (d.shared) await Store.set("shared:" + d.id, d, true);
    await refreshCounts();
    return d;
  }, [refreshCounts, applyDoc]);

  // ---- load on mount: ?shared link, else most recent letter ----
  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(location.search);
      const sharedId = params.get("shared");
      const codeParam = params.get("code");
      const dataParam = params.get("data");
      
      if (codeParam) {
        try {
          const decompressed = LZString.decompressFromEncodedURIComponent(codeParam);
          const parsed = JSON.parse(decompressed);
          if (parsed && typeof parsed === "object") {
            const docData = decompressDoc(parsed);
            applyDoc(normalizeDoc(docData, newId()));
            setViewerMode(true);
            setPreviewOpen(true);
            await refreshCounts();
            return;
          }
        } catch (e) {
          console.error("Failed to decode code parameter on mount", e);
        }
      }
      
      if (dataParam) {
        try {
          const json = decodeURIComponent(Array.prototype.map.call(atob(dataParam), function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const parsed = JSON.parse(json);
          if (parsed && typeof parsed === "object") {
            applyDoc(normalizeDoc(parsed, newId()));
            setViewerMode(true);
            setPreviewOpen(true);
            await refreshCounts();
            return;
          }
        } catch (e) {
          console.error("Failed to decode data parameter on mount", e);
        }
      }
      
      if (sharedId) {
        const data = await Store.get("shared:" + sharedId);
        if (data) {
          applyDoc(normalizeDoc(data, sharedId));
          setViewerMode(true);
          setPreviewOpen(true);
          await refreshCounts();
          return;
        }
      }
      const ls = await Store.list("letter:");
      if (ls.length) {
        const recent = ls.map((e) => e.value).filter(Boolean)
          .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0];
        if (recent) applyDoc(normalizeDoc(recent, recent.id));
      }
      await refreshCounts();
    })();
    // eslint-disable-next-line
  }, []);

  // ---- auto-save every 30s ----
  useEffect(() => {
    const t = setInterval(() => { saveLetter(); }, 30000);
    return () => clearInterval(t);
  }, [saveLetter]);

  // ---- new letter ----
  const newLetter = async () => {
    await saveLetter(); // persist current first
    const fresh = normalizeDoc(DEFAULT_DOC, newId());
    fresh.body = "";
    fresh.greeting = "My Dearest,";
    applyDoc(fresh);
    setShareUrl(null);
    setLeftOpen(false);
    setRightOpen(false);
  };

  // ---- share ----
  const createShareLink = async () => {
    setCreatingLink(true);
    const d = await saveLetter({ shared: true });
    await Store.set("shared:" + d.id, d, true);
    await refreshCounts();
    
    let url = "";
    try {
      const compact = compressDoc(d);
      const jsonStr = JSON.stringify(compact);
      const compressed = LZString.compressToEncodedURIComponent(jsonStr);
      const dir = location.pathname.replace(/[^/]*$/, "");
      url = `${location.origin}${dir}letter.html?code=${compressed}`;
    } catch (e) {
      console.warn("Encoding share data failed, falling back to local ID", e);
      const dir = location.pathname.replace(/[^/]*$/, "");
      url = `${location.origin}${dir}letter.html?shared=${encodeURIComponent(d.id)}`;
    }
    
    setShareUrl(url);
    setCreatingLink(false);
  };

  const openPreview = () => { setShareUrl(null); setViewerMode(false); setPreviewOpen(true); };
  const closePreview = () => { setPreviewOpen(false); setViewerMode(false); };

  const paperCls = (PAPERS.find((p) => p.id === doc.selPaper) || {}).cls || "pp-smooth";

  const onCmd = (id) => {
    const el = bodyRef.current;
    if (el) el.focus();
    if (id === "undo") document.execCommand("undo");
    if (id === "redo") document.execCommand("redo");
    if (id === "format") document.execCommand("italic");
    if (id === "image") document.execCommand("insertText", false, " \u2736 ");
    if (el) onField("body", el.innerHTML);
  };

  return (
    <div className={`app-container ${theme === "evening" ? "evening" : ""} ${leftOpen ? "left-open" : ""} ${rightOpen ? "right-open" : ""}`}>
      {/* Backdrop for mobile drawer */}
      {(leftOpen || rightOpen) && (
        <div className="panel-backdrop" onClick={() => { setLeftOpen(false); setRightOpen(false); }} />
      )}

      <MaterialPanel
        selPaper={doc.selPaper} setSelPaper={(v) => update({ selPaper: v })}
        selEnv={doc.selEnv} setSelEnv={(v) => update({ selEnv: v })}
        selSeal={doc.selSeal} setSelSeal={setSeal}
        selCover={doc.selCover} setSelCover={(v) => update({ selCover: v })}
        onNew={newLetter}
        theme={theme}
        setTheme={setTheme}
        onClose={() => setLeftOpen(false)}
      />

      {/* center column */}
      <div className="workspace-panel">
        <TopBar
          title={doc.title} setTitle={(v) => update({ title: v })}
          onSaveDraft={() => saveLetter({ status: "draft" })}
          onPreview={openPreview}
          onToggleLeft={() => { setLeftOpen(!leftOpen); setRightOpen(false); }}
          onToggleRight={() => { setRightOpen(!rightOpen); setLeftOpen(false); }}
          leftActive={leftOpen}
          rightActive={rightOpen}
        />
        <LetterCanvas
          docKey={doc.id}
          paperCls={paperCls}
          font={doc.font} fontSize={doc.fontSize} lineHeight={doc.lineHeight}
          align={doc.align} ink={doc.ink} margins={doc.margins}
          seal={doc.selSeal} sealKey={sealKey} bodyRef={bodyRef}
          greeting={doc.greeting} body={doc.body} signoff={doc.signoff} signature={doc.signature}
          onField={onField}
        />
        <FloatingToolbar onCmd={onCmd} onSave={() => saveLetter({ status: "sealed" })} />
      </div>

      <ControlsPanel
        font={doc.font} setFont={(v) => update({ font: v })}
        fontSize={doc.fontSize} setFontSize={(v) => update({ fontSize: v })}
        lineHeight={doc.lineHeight} setLineHeight={(v) => update({ lineHeight: v })}
        align={doc.align} setAlign={(v) => update({ align: v })}
        ink={doc.ink} setInk={(v) => update({ ink: v })}
        margins={doc.margins} setMargins={(v) => update({ margins: v })}
        onClose={() => setRightOpen(false)}
      />

      <PreviewOverlay
        open={previewOpen} doc={doc} viewer={viewerMode}
        onClose={closePreview}
        onCreateLink={createShareLink}
        shareUrl={shareUrl} creating={creatingLink}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
