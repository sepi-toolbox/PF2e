/* hbs_helpers.js — FVTT Handlebars 헬퍼 shim + localize + 템플릿 로더
 * FVTT pf2e 시트 템플릿(.hbs)을 Foundry 없이 standalone Handlebars로 렌더하기 위한 글루.
 * 의존: vendor/handlebars.min.js, lang/en.json, lang/ko.json
 */
(function (root) {
  "use strict";
  const HB = root.Handlebars;
  if (!HB) { console.error("[builder] Handlebars 미로드"); return; }

  // ---- i18n (ko 우선, en 폴백) ----
  let _lang = {}; // 평탄화된 "A.B.C" -> 문자열
  function _flatten(obj, prefix, out) {
    for (const k in obj) {
      const v = obj[k];
      const key = prefix ? prefix + "." + k : k;
      if (v && typeof v === "object" && !Array.isArray(v)) _flatten(v, key, out);
      else out[key] = v;
    }
    return out;
  }
  function loadLang(en, ko) {
    const merged = {};
    _flatten(en || {}, "", merged);
    _flatten(ko || {}, "", merged); // ko가 en 덮어씀
    _lang = merged;
  }
  function localize(key, data) {
    if (key == null) return "";
    if (typeof key !== "string") return String(key);
    let str = Object.prototype.hasOwnProperty.call(_lang, key) ? _lang[key] : key;
    if (typeof str !== "string") str = key;
    // {x} 보간 (Handlebars helper면 마지막 인자가 options{hash})
    const hash = data && data.hash ? data.hash : null;
    if (hash) str = str.replace(/\{([^}]+)\}/g, (m, p) => (p in hash ? hash[p] : m));
    return str;
  }
  function has(key) { return Object.prototype.hasOwnProperty.call(_lang, key); }

  // ---- 헬퍼 ----
  const S = (s) => new HB.SafeString(s);
  HB.registerHelper("resolvePath", (p) => p); // 파셜명 = 경로 문자열
  HB.registerHelper("localize", (k, opts) => localize(k, opts));
  HB.registerHelper("numberFormat", (val, opts) => {
    const h = (opts && opts.hash) || {};
    let n = Number(val); if (!isFinite(n)) n = 0;
    const dec = h.decimals != null ? Number(h.decimals) : 0;
    let s = n.toFixed(dec);
    if (h.sign && n >= 0) s = "+" + s;
    return s;
  });
  HB.registerHelper("selectOptions", (choices, opts) => {
    const h = (opts && opts.hash) || {};
    const sel = h.selected;
    let entries = [];
    if (Array.isArray(choices)) entries = choices.map((v) => [v, v]);
    else if (choices && typeof choices === "object") entries = Object.keys(choices).map((k) => [k, choices[k]]);
    if (h.sort) entries.sort((a, b) => String(localize(a[1])).localeCompare(String(localize(b[1])), "ko"));
    const html = entries.map(([val, label]) => {
      const lbl = h.localize ? localize(label) : label;
      const s = String(val) === String(sel) ? " selected" : "";
      return `<option value="${val}"${s}>${lbl}</option>`;
    }).join("");
    return S(html);
  });
  HB.registerHelper("times", function (n, opts) {
    let out = ""; const c = Number(n) || 0;
    for (let i = 0; i < c; i++) out += opts.fn(i, { data: { index: i }, blockParams: [i] });
    return out;
  });
  HB.registerHelper("eq", (a, b) => a === b);
  HB.registerHelper("ne", (a, b) => a !== b);
  HB.registerHelper("gt", (a, b) => Number(a) > Number(b));
  HB.registerHelper("gte", (a, b) => Number(a) >= Number(b));
  HB.registerHelper("lt", (a, b) => Number(a) < Number(b));
  HB.registerHelper("lte", (a, b) => Number(a) <= Number(b));
  HB.registerHelper("and", function (...a) { a.pop(); return a.every(Boolean); });
  HB.registerHelper("or", function (...a) { a.pop(); return a.some(Boolean); });
  HB.registerHelper("not", (v) => !v);
  HB.registerHelper("nor", function (...a) { a.pop(); return !a.some(Boolean); });
  HB.registerHelper("any", function (...a) { a.pop(); return a.some(Boolean); });
  HB.registerHelper("includes", (arr, el) => Array.isArray(arr) && arr.includes(el));
  HB.registerHelper("coalesce", function (...a) { a.pop(); return a.find((x) => x != null) ?? null; });
  HB.registerHelper("concat", function (...a) { a.pop(); return a.join(""); });
  HB.registerHelper("add", (a, b) => Number(a) + Number(b));
  HB.registerHelper("multiply", (a, b) => Number(a) * Number(b));
  HB.registerHelper("percentage", (v, max) => (Number(v) * 100) / (Number(max) || 1));
  HB.registerHelper("lower", (s) => String(s == null ? "" : s).toLowerCase());
  HB.registerHelper("capitalize", (s) => { s = String(s == null ? "" : s); return s.charAt(0).toUpperCase() + s.slice(1); });
  HB.registerHelper("sluggify", (s) => String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  HB.registerHelper("ordinal", (v) => { const n = Number(v); return n + "번째"; });
  HB.registerHelper("pad", (v, len, ch) => String(v).padStart(Number(len), String(ch || "0")));
  HB.registerHelper("json", (v) => JSON.stringify(v));
  HB.registerHelper("disabled", (cond) => (cond ? "disabled" : ""));
  HB.registerHelper("actionGlyph", (v) => S(`<span class="action-glyph">${v == null ? "" : v}</span>`));

  // ---- 템플릿 로더 ----
  const TEMPLATE_BASE = "templates/";
  const PARTIALS = [
    "actors/character/partials/header.hbs",
    "actors/character/partials/sidebar.hbs",
    "actors/character/icons/d20.hbs",
    "actors/character/icons/pfs.hbs",
    "actors/partials/dying-pips.hbs",
    "actors/partials/modifiers-tooltip.hbs",
    "actors/character/tabs/character.hbs",
    "actors/character/tabs/actions.hbs",
    "actors/character/tabs/inventory.hbs",
    "actors/character/tabs/spellcasting.hbs",
    "actors/character/tabs/crafting.hbs",
    "actors/character/tabs/proficiencies.hbs",
    "actors/character/tabs/feats.hbs",
    "actors/character/tabs/effects.hbs",
    "actors/character/tabs/biography.hbs",
    "actors/character/tabs/pfs.hbs",
  ];
  async function _fetchText(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error("템플릿 로드 실패: " + url + " (" + r.status + ")");
    return r.text();
  }
  async function loadTemplates() {
    const [enJson, koJson] = await Promise.all([
      _fetchText("lang/en.json").then(JSON.parse).catch(() => ({})),
      _fetchText("lang/ko.json").then(JSON.parse).catch(() => ({})),
    ]);
    loadLang(enJson, koJson);
    await Promise.all(PARTIALS.map(async (rel) => {
      const name = TEMPLATE_BASE + rel; // "templates/actors/..."
      const src = await _fetchText(name);
      HB.registerPartial(name, src);
    }));
    const sheetSrc = await _fetchText("templates/actors/character/sheet.hbs");
    return HB.compile(sheetSrc);
  }

  root.BuilderHbs = { loadTemplates, localize, has, loadLang };
})(window);
