/* ============================================================
   recipient.jsx — The Recipient Experience
   A sealed letter, waiting. Tap the seal → opening ceremony →
   the letter floats to centre and the words arrive.
   ============================================================ */
const { useState, useEffect, useRef, useCallback } = React;

/* ---- maps mirrored from the studio so rendering matches ---- */
const R_LH = { tight: 1.45, normal: 1.85, relaxed: 2.35 };
const R_MARGIN = {
  narrow: { px: 48, l: 48, r: 48 },
  normal: { px: 64, l: 64, r: 64 },
  wide:   { px: 92, l: 92, r: 92 },
  left:   { px: 64, l: 104, r: 48 },
  right:  { px: 64, l: 48, r: 104 },
};

/* a beautiful fallback so the page sings with no saved data */
const demoLetter = {
  ...DEFAULT_DOC,
  title: "A letter for you",
  greeting: "My Dearest,",
  body: SAMPLE_LETTER,
  signoff: "Ever yours,",
  signature: "— E.",
  selPaper: "ivory-smooth",
  selEnv: "kraft",
  selSeal: "red",
  font: "dancing",
  ink: "black",
  align: "left",
  lineHeight: "normal",
  fontSize: 22,
  margins: "normal",
};

/* sender's initial for the wax seal */
function initialOf(doc) {
  const sig = (doc.signature || "").replace(/[^A-Za-z]/g, "");
  const grt = (doc.greeting || "").replace(/[^A-Za-z]/g, "");
  return (sig[0] || grt[0] || "E").toUpperCase();
}

/* botanical sprig pattern for the flap lining */
const LINING_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 34 34'%3E%3Cg fill='none' stroke='%23F3E6D2' stroke-width='1' stroke-opacity='0.6' stroke-linecap='round'%3E%3Cpath d='M8 13 V4 M8 7 q-3 -2 -5 0 q3 2 5 0 M8 7 q3 -2 5 0 q-3 2 -5 0'/%3E%3Cpath d='M25 31 V22 M25 25 q-3 -2 -5 0 q3 2 5 0 M25 25 q3 -2 5 0 q-3 2 -5 0'/%3E%3C/g%3E%3C/svg%3E\")";

/* ============================================================
   Ambient music — Tone.js, started only on the seal click
   (browser autoplay policy). A 20s chord cycle, looping.
   ============================================================ */
const Music = {
  started: false, synth: null, reverb: null, muted: false,
  async start() {
    if (this.started || typeof Tone === "undefined") return;
    try {
      await Tone.start();
      try { await Tone.getContext().resume(); } catch (e) {}
      this.started = true;
      this.reverb = new Tone.Reverb({ decay: 8, wet: 0.7 }).toDestination();
      this.synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" },
        envelope: { attack: 2, decay: 3, sustain: 0.4, release: 4 },
      }).connect(this.reverb);
      this.synth.volume.value = -18;

      const chords = [["C4","E4","G4"], ["A3","C4","E4"], ["F3","A3","C4"], ["G3","B3","D4"]];
      const durs = [6, 6, 6, 8];
      const synth = this.synth;
      const cycle = (time) => {
        chords.forEach((c, i) => {
          const t = time + i * 5;            // 0s, 5s, 10s, 15s
          // gentle dip then swell to soften each onset
          synth.volume.setValueAtTime(-26, t);
          synth.volume.linearRampToValueAtTime(-18, t + 1.4);
          synth.triggerAttackRelease(c, durs[i], t);
        });
      };
      Tone.Transport.scheduleRepeat(cycle, 20);   // seamless 20s loop
      Tone.Transport.start("+0.1");
    } catch (e) { /* audio is a grace note, never fatal */ }
  },
  toggleMute() {
    this.muted = !this.muted;
    if (typeof Tone !== "undefined") Tone.getDestination().mute = this.muted;
    return this.muted;
  },
};

/* ============================================================
   The envelope — layered divs (back · letter · front · flap · seal)
   ============================================================ */
function Envelope({ doc, phase, pressing, onOpen }) {
  const env = ENVELOPES.find((e) => e.id === doc.selEnv) || ENVELOPES[0];
  const sealId = doc.selSeal || "red";
  const sealObj = SEALS.find((s) => s.id === sealId) || SEALS[0];
  const init = initialOf(doc);

  return (
    <div
      className="env-scene"
      style={{
        "--env-back-c": env.flap,
        "--env-front-c": env.fill,
        "--env-flap-c": env.flap,
        transform: "translateZ(0) rotate(-2deg)",
      }}
    >
      <div className="env-shadow" />
      <div className="env-back env-paper" />

      <div className="env-mouth" />
      <div className="env-front env-paper" />

      <div className="env-flap env-paper">
        <div className="flap-face flap-face-front env-paper" />
        <div className="flap-face flap-face-back">
          <div className="env-flap-lining" style={{ backgroundImage: LINING_SVG }} />
        </div>
      </div>

      {/* wax seal at the flap apex */}
      <div
        className={"seal-wrap" + (phase === "sealed" ? " sealed" : "") + (pressing ? " pressing" : "")}
        onClick={phase === "sealed" ? onOpen : undefined}
        role="button"
        aria-label="Break the seal to open the letter"
        tabIndex={phase === "sealed" ? 0 : -1}
        onKeyDown={(e) => { if (phase === "sealed" && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onOpen(); } }}
      >
        <span className={`wax ${sealObj.cls}`} style={{ position: "absolute", inset: 0, display: "block" }} />
        <span className="seal-initial">{init}</span>
        {/* two halves for the crack */}
        <span className={`wax ${sealObj.cls} seal-half lh`} />
        <span className={`wax ${sealObj.cls} seal-half rh`} />
      </div>

      {/* scattering shards */}
      <div className="shards">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className={`wax ${sealObj.cls} shard`} />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   The letter face — read-only, reveals sequentially
   ============================================================ */
function LetterFace({ doc, phase, reveal, showFootSeal }) {
  const paperCls = (PAPERS.find((p) => p.id === doc.selPaper) || {}).cls || "pp-smooth";
  const fam = (FONTS.find((f) => f.id === doc.font) || FONTS[0]).family;
  const inkVal = (INKS.find((c) => c.id === doc.ink) || INKS[0]).value;
  const footSealObj = SEALS.find((s) => s.id === doc.selSeal);
  const italicGreeting = doc.font === "playfair" || doc.font === "cormorant";
  const cls = (g) => "reveal " + g + (reveal >= ({ greeting: 1, body: 2, signoff: 3 }[g]) ? " in" : "");

  return (
    <div className="paper-stack" style={{ width: "100%" }}>
      <div className="paper" style={{ borderRadius: 3, position: "relative" }}>
        <div className={`paper-sheet ${paperCls}`}>
          <span className="paper-grain" />
          <span className="paper-vignette" />
        </div>

        <div className="paper-content" data-margins={doc.margins}>
          <div style={{ fontFamily: fam, fontSize: doc.fontSize, lineHeight: R_LH[doc.lineHeight], textAlign: doc.align, color: inkVal }}>
            <div className={cls("greeting")} style={{ marginBottom: "0.7em", fontStyle: italicGreeting ? "italic" : "normal" }}
                 dangerouslySetInnerHTML={{ __html: doc.greeting || "" }} />
            <div className={cls("body") + " letter-body"} dangerouslySetInnerHTML={{ __html: doc.body || "" }} />
            <div className={cls("signoff")} style={{ marginTop: "1.6em", opacity: 0.92 }}>
              <div dangerouslySetInnerHTML={{ __html: doc.signoff || "" }} />
              <div style={{ marginTop: "0.15em", fontSize: "1.15em" }} dangerouslySetInnerHTML={{ __html: doc.signature || "" }} />
            </div>
          </div>
        </div>

        {/* decorative foot-seal */}
        {footSealObj && showFootSeal && (
          <span className={`wax ${footSealObj.cls} foot-seal`} style={{
            position: "absolute", bottom: 26, right: 34, width: 58, height: 58, zIndex: 5,
          }} />
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Decompression Helpers
   ============================================================ */
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

const decompressDoc = (comp) => {
  const out = { ...DEFAULT_DOC };
  for (const shortKey in comp) {
    const k = REV_KEY_MAP[shortKey];
    if (k) out[k] = comp[shortKey];
  }
  return out;
};

/* ============================================================
   App — phase machine
   ============================================================ */
function App() {
  const [doc, setDoc] = useState(null);
  const [booted, setBooted] = useState(false);
  const [phase, setPhase] = useState("sealed");
  const [pressing, setPressing] = useState(false);
  const [reveal, setReveal] = useState(0);
  const [final, setFinal] = useState(false);
  const [muted, setMuted] = useState(false);
  const timers = useRef([]);

  /* load shared letter (or the demo) */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const codeParam = params.get("code");
    const dataParam = params.get("data");
    const id = params.get("shared") || params.get("id") || "demo";
    let alive = true;
    (async () => {
      let data = null;
      if (codeParam) {
        try {
          const decompressed = LZString.decompressFromEncodedURIComponent(codeParam);
          const parsed = JSON.parse(decompressed);
          if (parsed && typeof parsed === "object") {
            data = decompressDoc(parsed);
          }
        } catch (e) {
          console.error("Failed to decode code parameter in recipient view", e);
        }
      }
      if (!data && dataParam) {
        try {
          // Decode Unicode-safe Base64
          const json = decodeURIComponent(Array.prototype.map.call(atob(dataParam), function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const parsed = JSON.parse(json);
          if (parsed && typeof parsed === "object") data = parsed;
        } catch (e) {
          console.error("Failed to decode data parameter in recipient view", e);
        }
      }
      if (!data && id && id !== "demo") {
        try {
          const got = await Store.get("shared:" + id);
          if (got && typeof got === "object") data = got;
        } catch (e) { /* fall through to demo */ }
      }
      if (!alive) return;
      setDoc(data ? { ...DEFAULT_DOC, ...data } : demoLetter);
    })();
    return () => { alive = false; };
  }, []);

  /* let the envelope land before we lift the boot veil */
  useEffect(() => {
    if (!doc) return;
    const t = setTimeout(() => setBooted(true), 80);
    return () => clearTimeout(t);
  }, [doc]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const open = useCallback(() => {
    if (phase !== "sealed") return;
    Music.start();
    setPressing(true);
    const at = (fn, ms) => timers.current.push(setTimeout(fn, ms));

    at(() => { setPressing(false); setPhase("breaking"); }, 80);   // seal cracks
    at(() => setPhase("flap"), 600);                               // flap folds back
    at(() => setPhase("rising"), 1400);                            // letter rises out
    at(() => setPhase("floating"), 2600);                          // envelope away, letter to centre, bg warms
    at(() => setPhase("reading"), 3600);                           // settled

    // sequential text reveal
    at(() => setReveal(1), 3850);                                  // greeting (500ms)
    at(() => setReveal(2), 4750);                                  // body (800ms) after 400 pause
    at(() => setReveal(3), 5950);                                  // sign-off (500ms) after 400 pause

    // final touches
    at(() => setFinal(true), 6500);
  }, [phase]);

  const toggleMute = () => setMuted(Music.toggleMute());

  if (!doc) {
    return <div className="boot">opening…</div>;
  }

  return (
    <>
      <div className="stage" data-phase={phase}>
        <div className="grain" />
        <div className="bloom" />

        <BotanicalSprig className="botanical-prop" style={{ width: 64 }} />

        <Envelope doc={doc} phase={phase} pressing={pressing} onOpen={open} />

        <div className="letter-card">
          <LetterFace doc={doc} phase={phase} reveal={reveal} showFootSeal={final} />
        </div>

        <div className="captions">
          <p className="cap-waiting">You have a letter waiting</p>
          <p className="cap-hint">tap the seal to open</p>
        </div>
      </div>

      {/* finale chrome */}
      <div className={"action-bar" + (final ? " in" : "")}>
        <a className="btn-writeback" href="index.html">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9 M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          Write Back
        </a>
        <button className={"btn-mute" + (muted ? " muted" : "")} onClick={toggleMute} aria-label={muted ? "Unmute music" : "Mute music"}>
          {muted ? "♪̸" : "♫"}
        </button>
      </div>

      <div className={"watermark" + (final ? " in" : "")} style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="14" height="10" viewBox="0 0 32 32" style={{ fill: "none", stroke: "currentColor", strokeWidth: 2 }}>
          <rect x="2" y="6" width="28" height="20" rx="3" />
          <path d="M2 8l14 10L30 8" />
        </svg>
        Between Us
      </div>

      <div className={"boot" + (booted ? " gone" : "")}>opening…</div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
