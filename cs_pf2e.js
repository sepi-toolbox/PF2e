/* cs_pf2e.js — FVTT-Native 재기반 ACCESS 코어 (P1)
 * BASE(영문 FVTT 구조) ⊕ OVERLAY(한글 텍스트) 조인 + predicate/roll-option 평가기.
 * 브라우저(fetch) / Node(fs) 양쪽 동작. 상위 레이어(RE 엔진/빌더 어댑터)가 이 모듈만 통해 데이터 접근.
 * 설계: dev/FVTT_NATIVE_REBASE.md
 */
(function (root) {
  'use strict';
  const isNode = typeof window === 'undefined';
  // 데이터 디렉토리: 기본 'data/...'(운영 시트 기준). 다른 폴더(예: builder/)에서 로드 시
  // window.PF2eDataConfig = {dataRoot:'../data'} 로 override (하위호환 — 미설정 시 기존 동작).
  const _cfg = (!isNode && root.PF2eDataConfig) || {};
  const _dataRoot = _cfg.dataRoot || 'data';
  const BASE_DIR = _cfg.baseDir || (_dataRoot + '/base');
  const OVL_DIR = _cfg.ovlDir || (_dataRoot + '/overlay');

  // 비크리처 카테고리(단일 파일). 크리처는 별도(팩 분할 + _index).
  const CATEGORIES = ['equipment', 'spells', 'feats', 'actions', 'backgrounds',
    'deities', 'heritages', 'ancestries', 'conditions', 'classes', 'effects'];

  // ---- 로더 (지연, 카테고리 단위 캐시) ----
  const _baseCache = {};   // cat → array
  const _ovlCache = {};    // cat → {slug→{name,description,traits}}
  const _index = {};       // cat → Map(slug→doc) (조인 결과)

  function _readJSON(relPath) {
    if (isNode) {
      const fs = require('fs'), path = require('path');
      // dev/ 기준 상대경로 해소 (cwd가 dev 또는 repo 루트 양쪽 대응)
      const cands = [relPath, path.join('dev', relPath), path.join(__dirname, relPath)];
      for (const p of cands) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) {} }
      return null;
    }
    // 브라우저: 동기 로드 회피 → loadCategory가 async fetch 사용
    throw new Error('_readJSON sync는 Node 전용');
  }

  async function _fetchJSON(relPath) {
    const res = await fetch(relPath);
    if (!res.ok) return null;
    return res.json();
  }

  // 카테고리 로드(조인 포함). Node=동기 가능, 브라우저=async.
  function loadCategorySync(cat) {
    if (_index[cat]) return _index[cat];
    const base = _readJSON(`${BASE_DIR}/${cat}.base.json`) || [];
    const ovl = _readJSON(`${OVL_DIR}/${cat}.ko.json`) || {};
    _baseCache[cat] = base; _ovlCache[cat] = ovl;
    return _buildIndex(cat, base, ovl);
  }
  async function loadCategory(cat) {
    if (_index[cat]) return _index[cat];
    if (isNode) return loadCategorySync(cat);
    const [base, ovl] = await Promise.all([
      _fetchJSON(`${BASE_DIR}/${cat}.base.json`),
      _fetchJSON(`${OVL_DIR}/${cat}.ko.json`),
    ]);
    _baseCache[cat] = base || []; _ovlCache[cat] = ovl || {};
    return _buildIndex(cat, base || [], ovl || {});
  }

  function _slugOf(d) { return (d.system && d.system.slug) || d._id; }

  function _buildIndex(cat, base, ovl) {
    const m = new Map();
    for (const d of base) {
      const slug = _slugOf(d);
      // 조인: BASE 복제 위에 OVERLAY 텍스트 덮기(가역 위해 _en 보존)
      const joined = d;                       // BASE는 불변 취급(여기선 참조 + 한글 필드 부착)
      const ko = ovl[slug];
      if (ko) {
        joined.name_en = d.name;
        joined.name_ko = ko.name || d.name;
        if (ko.description) {
          joined.system = joined.system || {};
          joined._desc_en = joined.system.description && joined.system.description.value;
          joined._desc_ko = ko.description;
        }
      } else {
        joined.name_en = d.name; joined.name_ko = d.name;
      }
      m.set(slug, joined);
      m.set(d._id, joined);
    }
    _index[cat] = m;
    return m;
  }

  // 단건 조회: key=slug|_id|영문명. cat 미지정 시 전 카테고리 탐색은 비권장(명시 권장).
  function get(cat, key) {
    const m = isNode ? loadCategorySync(cat) : _index[cat];
    if (!m) return null;
    if (m.has(key)) return m.get(key);
    // 영문명 폴백
    for (const v of m.values()) if (v.name_en === key || v.name === key) return v;
    return null;
  }
  function all(cat) {
    if (isNode) loadCategorySync(cat);
    return _baseCache[cat] || [];
  }

  // 표시용 한글명/설명 헬퍼
  function nameKo(doc) { return doc && (doc.name_ko || doc.name); }
  function descKo(doc) { return doc && (doc._desc_ko || (doc.system && doc.system.description && doc.system.description.value)); }

  // FVTT 인라인 @참조(@UUID/@Damage/@Check/@Template/@Localize…) → 한글 가독 렌더.
  // 시트의 모든 FVTT desc 표시 공통 진입점(장비/재주/주문). 미인식 @X[..]는 라벨만 남김.
  const _DMG_KO = { piercing: '관통', slashing: '참격', bludgeoning: '타격', fire: '화염', cold: '냉기', acid: '산성', electricity: '전기', sonic: '음향', mental: '정신', poison: '독', void: '공허', spirit: '정신력', vitality: '생명력', force: '역장', bleed: '출혈', untyped: '', precision: '정밀' };
  const _SAVE_KO = { fortitude: '인내', reflex: '반사', will: '의지' };
  function _escDesc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function enrichDesc(html) {
    if (!html) return '';
    let s = String(html);
    s = s.replace(/@Damage\[((?:[^\[\]]|\[[^\]]*\])*)\](\{[^}]*\})?/g, (m, body) => {
      const parts = body.split(/,(?![^\[]*\])/).map(p => {
        const mm = p.match(/\(?\s*([0-9dD()+\-* ]+?)\s*\)?\s*\[([^\]]+)\]/);
        if (!mm) return p.replace(/[\[\]]/g, ' ').trim();
        const types = mm[2].split(',').map(t => t.trim()); const persistent = types.includes('persistent');
        const dts = types.filter(t => t !== 'persistent').map(t => _DMG_KO[t] !== undefined ? _DMG_KO[t] : t).filter(Boolean);
        return `${mm[1].trim()} ${persistent ? '지속 ' : ''}${dts.join(' ')}`.replace(/\s+/g, ' ').trim();
      });
      return `<span class="ref-dmg">${parts.join(' + ')}</span>`;
    });
    s = s.replace(/@Check\[([^\]]+)\](\{[^}]*\})?/g, (m, body) => { const type = Object.keys(_SAVE_KO).find(k => new RegExp('\\b' + k + '\\b').test(body)) || ''; const dc = (body.match(/dc:(\d+)/) || [])[1]; const basic = /basic/.test(body) ? '기본 ' : ''; return `<span class="ref-check">${dc ? `DC ${dc} ` : ''}${basic}${_SAVE_KO[type] || type}</span>`; });
    s = s.replace(/@UUID\[[^\]]+\](?:\{([^}]*)\})?/g, (m, label) => label ? `<span class="ref-link">${_escDesc(label)}</span>` : '');
    s = s.replace(/@Template\[([^\]]+)\](\{[^}]*\})?/g, (m, body) => { const d = (body.match(/distance:(\d+)/) || [])[1]; const SH = { emanation: '발산', burst: '폭발', cone: '원뿔', line: '직선' }; const ty = (body.match(/type:(\w+)/) || [])[1]; return `<span class="ref-area">${d || ''}피트 ${SH[ty] || ty || ''}</span>`; });
    s = s.replace(/@Localize\[[^\]]+\]/g, '');
    s = s.replace(/@[A-Za-z]+\[[^\]]*\](?:\{([^}]*)\})?/g, (m, l) => l || '');
    return s;
  }

  /* ====== Predicate 엔진 (pf2e 포맷) ======
   * predicate: 배열. 원소 = 문자열(옵션 존재) | {not} | {and} | {or} | {nor} | {nand}
   *           | {lt|gt|lte|gte|eq:[a,b]} | {xor} | {iff}
   * options: Set<string> 또는 배열.
   */
  function _opt(options) { return options instanceof Set ? options : new Set(options || []); }

  function testPredicate(predicate, options) {
    if (!predicate || (Array.isArray(predicate) && predicate.length === 0)) return true;
    const opts = _opt(options);
    const arr = Array.isArray(predicate) ? predicate : [predicate];
    return arr.every(s => _testStatement(s, opts));
  }

  function _testStatement(st, opts) {
    if (typeof st === 'string') return opts.has(st);
    if (!st || typeof st !== 'object') return false;
    if ('not' in st) return !_testStatement(st.not, opts);
    if ('and' in st) return st.and.every(s => _testStatement(s, opts));
    if ('or' in st) return st.or.some(s => _testStatement(s, opts));
    if ('nor' in st) return !st.nor.some(s => _testStatement(s, opts));
    if ('nand' in st) return !st.nand.every(s => _testStatement(s, opts));
    if ('xor' in st) return st.xor.filter(s => _testStatement(s, opts)).length === 1;
    if ('iff' in st) { const r = st.iff.map(s => _testStatement(s, opts)); return r.every(Boolean) || r.every(x => !x); }
    // 수치 비교: {gte:["a","b"]} — a,b는 옵션 prefix:value 또는 숫자
    for (const op of ['gt', 'gte', 'lt', 'lte', 'eq']) {
      if (op in st) { const [a, b] = st[op]; return _cmp(op, _numFromOpt(a, opts), _numFromOpt(b, opts)); }
    }
    return false;
  }
  function _numFromOpt(x, opts) {
    if (typeof x === 'number') return x;
    if (typeof x === 'string') {
      const n = Number(x); if (!Number.isNaN(n)) return n;
      // 옵션 중 "x:<num>" 형태 탐색
      const pre = x + ':';
      for (const o of opts) if (o.startsWith(pre)) { const v = Number(o.slice(pre.length)); if (!Number.isNaN(v)) return v; }
    }
    return 0;
  }
  function _cmp(op, a, b) {
    switch (op) { case 'gt': return a > b; case 'gte': return a >= b; case 'lt': return a < b; case 'lte': return a <= b; case 'eq': return a === b; }
    return false;
  }

  // ---- UUID 조회 (GrantItem용): "Compendium.pf2e.<pack>.Item.<id>" ----
  // pack → category 매핑(주요). 모르면 전 카테고리 _id 탐색.
  const PACK2CAT = {
    'feats-srd': 'feats', classfeatures: 'feats', ancestryfeatures: 'feats', 'campaign-feats': 'feats',
    'equipment-srd': 'equipment', 'spells-srd': 'spells', spells: 'spells',
    'spell-effects': 'effects', 'feat-effects': 'effects', 'equipment-effects': 'effects',
    'other-effects': 'effects', 'bestiary-effects': 'effects', 'campaign-effects': 'effects', conditionitems: 'conditions',
    actionspf2e: 'actions', heritages: 'heritages', ancestries: 'ancestries', backgrounds: 'backgrounds',
    deities: 'deities', classes: 'classes',
  };
  function getByUuid(uuid) {
    if (!uuid || typeof uuid !== 'string') return null;
    const parts = uuid.split('.');
    const id = parts[parts.length - 1];
    const pack = parts[2];
    const cat = PACK2CAT[pack];
    if (cat) { const m = isNode ? loadCategorySync(cat) : _index[cat]; if (m && m.has(id)) return m.get(id); }
    for (const c of CATEGORIES) { const m = isNode ? loadCategorySync(c) : _index[c]; if (m && m.has(id)) return m.get(id); }
    return null;
  }

  // ---- 브래킷 해소: "{item|path}" / "{actor|path}" ----
  // ctx = { item: doc, rulesSelections: {flag:value}, actor }
  function resolveBrackets(val, ctx) {
    if (typeof val !== 'string') return val;
    if (val.indexOf('{') === -1) return val;
    return val.replace(/\{(item|actor)\|([^}]+)\}/g, (m, who, path) => {
      try {
        if (who === 'item') {
          if (path.startsWith('flags.system.rulesSelections.')) {
            const flag = path.slice('flags.system.rulesSelections.'.length);
            return (ctx.rulesSelections && ctx.rulesSelections[flag] != null) ? ctx.rulesSelections[flag] : m;
          }
          if (path === 'id') return (ctx.item && ctx.item._id) || m;
          if (path === 'name') return (ctx.item && (ctx.item.name_ko || ctx.item.name)) || m;
          return _dig(ctx.item, path) ?? m;
        }
        if (who === 'actor') return _dig(ctx.actor, path) ?? m;
      } catch (e) {}
      return m;
    });
  }
  function _dig(obj, path) { return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj); }

  const API = {
    CATEGORIES, loadCategory, loadCategorySync, get, all, nameKo, descKo, enrichDesc,
    testPredicate, _testStatement, getByUuid, resolveBrackets,
    _state: { base: _baseCache, ovl: _ovlCache, index: _index },
  };
  root.PF2eData = API;
  if (isNode && typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
