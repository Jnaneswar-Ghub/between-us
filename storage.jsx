/* ============================================================
   storage.jsx — persistence adapter
   Prefers the host-injected window.storage API; falls back to a
   namespaced localStorage shim so the prototype works anywhere.
   All functions are async and return normalized shapes.
   ============================================================ */
(function () {
  const native = window.storage;
  const HAS_NATIVE = !!(native && typeof native.set === "function" && typeof native.list === "function");
  const NS = "betweenus::"; // fallback namespace — only ever touches our own keys

  function normalizeEntry(e) {
    // Accept {key,value} | {key,data} | [key,value] | raw value
    if (e && typeof e === "object" && "key" in e) {
      return { key: e.key, value: "value" in e ? e.value : ("data" in e ? e.data : e) };
    }
    if (Array.isArray(e) && e.length === 2) return { key: e[0], value: e[1] };
    return { key: undefined, value: e };
  }

  function normalizeList(res) {
    if (!res) return [];
    if (Array.isArray(res)) return res.map(normalizeEntry).filter((e) => e.value != null);
    if (typeof res === "object") {
      // map of key -> value
      return Object.keys(res).map((k) => ({ key: k, value: res[k] }));
    }
    return [];
  }

  async function set(key, data, shared = false) {
    if (HAS_NATIVE) {
      try { return await native.set(key, data, shared); }
      catch (e) { console.warn("storage.set native failed, using fallback", e); }
    }
    try { localStorage.setItem(NS + key, JSON.stringify({ __v: data, __shared: !!shared })); }
    catch (e) { console.warn("storage.set fallback failed", e); }
  }

  async function get(key) {
    if (HAS_NATIVE) {
      try { return await native.get(key); }
      catch (e) { console.warn("storage.get native failed, using fallback", e); }
    }
    try {
      const raw = localStorage.getItem(NS + key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && "__v" in parsed ? parsed.__v : parsed;
    } catch (e) { return null; }
  }

  async function list(prefix) {
    if (HAS_NATIVE) {
      try { return normalizeList(await native.list(prefix)); }
      catch (e) { console.warn("storage.list native failed, using fallback", e); }
    }
    const out = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(NS + prefix)) {
          const realKey = k.slice(NS.length);
          try {
            const parsed = JSON.parse(localStorage.getItem(k));
            out.push({ key: realKey, value: parsed && "__v" in parsed ? parsed.__v : parsed });
          } catch (e) { /* skip */ }
        }
      }
    } catch (e) { /* ignore */ }
    return out;
  }

  async function remove(key) {
    if (HAS_NATIVE && typeof native.delete === "function") {
      try { return await native.delete(key); }
      catch (e) { /* fallthrough */ }
    }
    try { localStorage.removeItem(NS + key); } catch (e) { /* ignore */ }
  }

  window.Store = { set, get, list, remove, hasNative: HAS_NATIVE };
})();
