/* ============================================================
   data.jsx — material catalogue, fonts, palettes, quotes
   ============================================================ */

const FONTS = [
  { id: "dancing",   name: "Dancing Script",      family: "'Dancing Script', cursive",     note: "Flowing & warm" },
  { id: "playfair",  name: "Playfair Display",     family: "'Playfair Display', serif",     note: "Editorial serif" },
  { id: "cormorant", name: "Cormorant Garamond",   family: "'Cormorant Garamond', serif",   note: "Delicate classic" },
  { id: "caveat",    name: "Caveat",               family: "'Caveat', cursive",             note: "Handwritten" },
  { id: "parisienne",name: "Parisienne",           family: "'Parisienne', cursive",         note: "Romantic script" },
];

const INKS = [
  { id: "black", name: "India Black", value: "#2C2C2C" },
  { id: "navy",  name: "Midnight Navy", value: "#1B2A4A" },
  { id: "sepia", name: "Sepia", value: "#5C4033" },
  { id: "brown", name: "Warm Brown", value: "#8B7355" },
  { id: "sage",  name: "Forest Sage", value: "#556B4E" },
  { id: "rose",  name: "Dusty Rose", value: "#8B6B6B" },
];

const PAPERS = [
  { id: "ivory-smooth",  name: "Ivory Smooth",   cls: "pp-smooth",   cat: "Classic" },
  { id: "cotton-press",  name: "Cotton Press",   cls: "pp-cotton",   cat: "Classic" },
  { id: "fine-linen",    name: "Fine Linen",     cls: "pp-linen",    cat: "Classic" },
  { id: "school-ledger", name: "Ruled Ledger",   cls: "pp-ledger",   cat: "Classic" },
  { id: "handmade",      name: "Handmade Deckle",cls: "pp-handmade", cat: "Artisan" },
  { id: "kraft",         name: "Kraft Natural",  cls: "pp-kraft",    cat: "Artisan" },
  { id: "marble",        name: "Marbled",        cls: "pp-marble",   cat: "Artisan" },
  { id: "grid",          name: "Architect Grid", cls: "pp-grid",     cat: "Artisan" },
  { id: "washi",         name: "Washi Whisper",  cls: "pp-washi",    cat: "Romantic" },
  { id: "blush",         name: "Blush Petal",    cls: "pp-blush",    cat: "Romantic" },
  { id: "sage-tint",     name: "Sage Mist",      cls: "pp-sage",     cat: "Romantic" },
  { id: "vintage",       name: "Aged Vintage",   cls: "pp-vintage",  cat: "Vintage" },
];

const PAPER_CATS = ["All", "Classic", "Vintage", "Romantic", "Artisan"];

const ENVELOPES = [
  { id: "cream",  name: "Cream",   fill: "#F3EBDD", flap: "#E9DEC9", lined: false },
  { id: "ivory",  name: "Ivory",   fill: "#FAF6F1", flap: "#EFE7DB", lined: false },
  { id: "kraft",  name: "Kraft",   fill: "#C9AE85", flap: "#B89A6E", lined: false },
  { id: "black",  name: "Noir",    fill: "#3A332C", flap: "#2C2620", lined: false, dark: true },
  { id: "sage",   name: "Sage",    fill: "#AFBAA1", flap: "#9DA98E", lined: false },
  { id: "rose",   name: "Rose",    fill: "#D6BBA8", flap: "#C7A992", lined: false },
  { id: "lav",    name: "Lavender",fill: "#C8C0D2", flap: "#B6ACC4", lined: false },
  { id: "white",  name: "Snow",    fill: "#FCFBF9", flap: "#F0ECE5", lined: false },
  { id: "lined",  name: "Florentine", fill: "#F1E8DA", flap: "#E6D9C5", lined: true },
];

const SEALS = [
  { id: "red",    name: "Classic Red", cls: "wax-red" },
  { id: "burg",   name: "Burgundy",    cls: "wax-burg" },
  { id: "gold",   name: "Bronze",      cls: "wax-gold" },
  { id: "silver", name: "Silver",      cls: "wax-silver" },
];

const COVERS = [
  { id: "botanical", name: "Botanical", bg: "#E4E8DC", accent: "#8B9A82" },
  { id: "floral",    name: "Floral",    bg: "#EFE0D8", accent: "#C4A68A" },
  { id: "minimal",   name: "Minimal",   bg: "#FAF6F1", accent: "#2C2C2C" },
  { id: "kraft",     name: "Kraft",     bg: "#CDB388", accent: "#6F5A40" },
  { id: "vintage",   name: "Vintage",   bg: "#EBDDBE", accent: "#8B7355" },
];

const QUOTES = [
  "We write, not to forget, but to remember beautifully.",
  "A letter is a soul, so faithful an echo of the speaking voice.",
  "Ink is the wine of the patient heart.",
  "The smallest note, kept, outlives the loudest year.",
  "Between us, the page keeps what the day would not.",
  "Some things are too gentle to say aloud — so we write them.",
];

const NAV = [
  { id: "letters",     label: "My Letters",    count: 12, Icon: IconLetters },
  { id: "drafts",      label: "Drafts",        count: 3,  Icon: IconDraft },
  { id: "capsules",    label: "Time Capsules", count: 2,  Icon: IconCapsule },
  { id: "collections", label: "Collections",   count: null, Icon: IconCollections },
  { id: "shared",      label: "Shared",        count: null, Icon: IconShared },
  { id: "trash",       label: "Trash",         count: null, Icon: IconTrash },
];

const SAMPLE_LETTER =
  "<p>It is raining the soft, unhurried kind of rain this morning — the sort that asks nothing of you — and I found myself reaching for paper instead of the phone, because some things deserve more weight than a passing glow on a screen.</p>" +
  "<p>I have been thinking about that afternoon by the harbour, the way the light went gold and you laughed at something I have since forgotten, and how I would trade a great many ordinary days to have one more of those.</p>" +
  "<p>Write back when the world is quiet. I will be here, keeping the kettle warm.</p>";

const DEFAULT_DOC = {
  title: "A letter for you",
  greeting: "My Dearest,",
  body: SAMPLE_LETTER,
  signoff: "Ever yours,",
  signature: "— E.",
  selPaper: "fine-linen",
  selEnv: "ivory",
  selSeal: null,
  selCover: "botanical",
  font: "dancing",
  fontSize: 22,
  lineHeight: "normal",
  align: "left",
  ink: "sepia",
  margins: "normal",
  status: "draft",
  shared: false,
};

Object.assign(window, {
  FONTS, INKS, PAPERS, PAPER_CATS, ENVELOPES, SEALS, COVERS, QUOTES, NAV, SAMPLE_LETTER, DEFAULT_DOC,
});
