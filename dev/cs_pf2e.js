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
  const OVR_DIR = _cfg.ovrDir || (_dataRoot + '/override'); // L3 OVERRIDE(관리툴 편집본, 최종 적용)

  // 비크리처 카테고리(단일 파일). 크리처는 별도(팩 분할 + _index).
  const CATEGORIES = ['equipment', 'spells', 'feats', 'actions', 'backgrounds',
    'deities', 'heritages', 'ancestries', 'conditions', 'classes', 'effects'];

  // ---- 로더 (지연, 카테고리 단위 캐시) ----
  const _baseCache = {};   // cat → array
  const _ovlCache = {};    // cat → {slug→{name,description,traits}}
  const _ovrCache = {};    // cat → {slug→{name_ko,desc_ko,...}} (L3 OVERRIDE)
  const _index = {};       // cat → Map(slug→doc) (조인 결과)
  let _localize = null;    // @Localize 사전: {PF2E.key → 한글}

  function _ensureLocalizeSync() { if (_localize) return _localize; if (isNode) _localize = _readJSON(`${_dataRoot}/derived/localize.ko.json`) || {}; return _localize; }
  async function loadLocalize() { if (_localize) return _localize; if (isNode) return _ensureLocalizeSync(); _localize = (await _fetchJSON(`${_dataRoot}/derived/localize.ko.json`)) || {}; return _localize; }

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
    const ovr = _readJSON(`${OVR_DIR}/${cat}.json`) || {}; // 없으면 {} (선택적)
    _baseCache[cat] = base; _ovlCache[cat] = ovl; _ovrCache[cat] = ovr;
    return _buildIndex(cat, base, ovl, ovr);
  }
  async function loadCategory(cat) {
    if (_index[cat]) return _index[cat];
    if (isNode) return loadCategorySync(cat);
    const [base, ovl, ovr] = await Promise.all([
      _fetchJSON(`${BASE_DIR}/${cat}.base.json`),
      _fetchJSON(`${OVL_DIR}/${cat}.ko.json`),
      _fetchJSON(`${OVR_DIR}/${cat}.json`), // 파일 없으면 404 → null → {}
    ]);
    _baseCache[cat] = base || []; _ovlCache[cat] = ovl || {}; _ovrCache[cat] = ovr || {};
    return _buildIndex(cat, base || [], ovl || {}, ovr || {});
  }

  function _slugOf(d) { return (d.system && d.system.slug) || d._id; }

  function _buildIndex(cat, base, ovl, ovr) {
    ovr = ovr || {};
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
      // L3 OVERRIDE 적용(관리툴 편집본이 최종). 기계효과(rules/slug/_id)엔 손대지 않음.
      _applyOverride(joined, ovr[slug]);
      m.set(slug, joined);
      m.set(d._id, joined);
    }
    _index[cat] = m;
    return m;
  }

  // OVERRIDE 부분필드 적용. name_ko/desc_ko는 조인 필드에 매핑, 그 외는 관리툴이 쓴 필드명 그대로 부착(구조 편집 대비).
  function _applyOverride(joined, ov) {
    if (!ov || typeof ov !== 'object') return;
    for (const f in ov) {
      const v = ov[f];
      if (v == null || v === '') continue;      // 빈값=미설정(BASE/OVERLAY 유지)
      if (f === 'name_ko') joined.name_ko = v;
      else if (f === 'desc_ko') {               // 설명 오버라이드 → 조인 desc 필드
        if (joined._desc_en == null) joined._desc_en = joined.system && joined.system.description && joined.system.description.value;
        joined._desc_ko = v;
      } else joined[f] = v;                      // 기타 필드(향후 구조 override)
    }
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
  const _DMG_KO = { piercing: '관통', slashing: '참격', bludgeoning: '타격', fire: '화염', cold: '냉기', acid: '산성', electricity: '전기', sonic: '음파', mental: '정신', poison: '독', void: '공허', spirit: '영혼', vitality: '활력', force: '힘', bleed: '출혈', untyped: '', precision: '정밀' };
  const _SAVE_KO = { fortitude: '인내', reflex: '반사', will: '의지' };
  const _SKILL_KO = { acrobatics: '곡예', arcana: '주문학', athletics: '운동', crafting: '제작', deception: '기만', diplomacy: '외교', intimidation: '위협', medicine: '의학', nature: '자연학', occultism: '오컬티즘', performance: '공연', religion: '종교학', society: '사회', stealth: '은신', survival: '생존', thievery: '도둑질' };
  const _CHECK_KO = Object.assign({ perception: '지각', flat: '단순', spell: '주문' }, _SAVE_KO, _SKILL_KO);
  function _checkTypeKo(t) { if (_CHECK_KO[t]) return _CHECK_KO[t]; const m = /^(.*)-lore$/.exec(t); if (m) return m[1].replace(/-/g, ' ') + ' 지식'; return t; }
  function _escDesc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function enrichDesc(html) {
    if (!html) return '';
    let s = String(html);
    // @Localize[PF2E.key] → 사전 한글로 치환(먼저 처리 → 치환된 내용의 @UUID/@Check 등도 이어서 렌더)
    const _loc = _localize || (isNode ? _ensureLocalizeSync() : null);
    s = s.replace(/@Localize\[([^\]]+)\]/g, (m, key) => { const t = _loc && _loc[key]; return t != null ? String(t) : ''; });
    // FVTT 전용 '효과 부여'·저널 링크 문단 제거: <p>@UUID[…-effects…]{효과: X}</p>, <p>@UUID[…journals…]{…}</p>
    // — FVTT에선 클릭/드래그 기능, 패스포지엔 없어 죽은 텍스트 → 문단째(선행 <hr> 포함) 삭제. 문장 중간 참조는 하단 @UUID 해소로 유지.
    s = s.replace(/(<hr\s*\/?>\s*)?<p>(?:\s*@UUID\[Compendium\.pf2e\.(?:[a-z-]*-effects\.Item|journals\.JournalEntry)[^\]]*\](?:\{[^}]*\})?\s*[,;·]?)+\s*<\/p>\s*/g, '');
    // 문단전용 @Embed 제거(FVTT는 전체 카드 임베드, 패스포지엔 이름만 남는 죽은 줄)
    s = s.replace(/(<hr\s*\/?>\s*)?<p>\s*@Embed\[[^\]]+\](?:\{[^}]*\})?\s*<\/p>\s*/g, '');
    // 인라인 행동 매크로 [[/act slug …]]{라벨} → 행동 카탈로그 한글명(FVTT 클릭 굴림 기능 없음 → 텍스트 렌더)
    s = s.replace(/\[\[\/act\s+([a-z0-9-]+)([^\]]*)\]\](?:\{([^}]*)\})?/g, (m, slug, opts, label) => {
      let name = label || '';
      if (!name) { try { const a = get('actions', slug); if (a) name = a.name_ko || a.name; } catch (e) {} }
      if (!name) name = slug.replace(/-/g, ' ');
      const dc = (opts.match(/dc[=:](\d+)/) || [])[1];
      const st = (opts.match(/statistic[=:]([a-z-]+)/) || [])[1];
      const extra = [st ? _checkTypeKo(st) : '', dc ? `DC ${dc}` : ''].filter(Boolean).join(' ');
      return `<span class="ref-link">${_escDesc(name)}${extra ? ` (${extra})` : ''}</span>`;
    });
    // 인라인 굴림 매크로 [[/r 2d6[fire]]]{라벨} / [[/gmr …]] / [[/br …]] → 라벨, 없으면 주사위식+피해유형 한글
    s = s.replace(/\[\[\/[a-z]+\s+((?:[^\[\]]|\[[^\]]*\])*)\]\](?:\{([^}]*)\})?/g, (m, body, label) => {
      if (label) return `<span class="ref-roll">${_escDesc(label)}</span>`;
      let f = body.replace(/#[^\s\]]*/g, '').replace(/\{([^}]*)\}/g, '$1');
      f = f.replace(/\[([a-z, -]+)\]/g, (mm, tys) => ' ' + tys.split(',').map(t => _DMG_KO[t.trim()] !== undefined ? _DMG_KO[t.trim()] : t.trim()).filter(Boolean).join(' '));
      return `<span class="ref-roll">${_escDesc(f.replace(/\s+/g, ' ').trim())}</span>`;
    });
    // 잔여 [[…]]{라벨} 폴백
    s = s.replace(/\[\[((?:[^\[\]]|\[[^\]]*\])*)\]\](?:\{([^}]*)\})?/g, (m, body, label) => `<span class="ref-roll">${_escDesc(label || body.replace(/^\s*\/[a-z]+\s*/i, '').replace(/#.*$/, '').trim())}</span>`);
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
    s = s.replace(/@Check\[([^\]]+)\](\{[^}]*\})?/g, (m, body) => { const tm = body.match(/(?:^|[|[])type:([a-z0-9-]+)/) || body.match(/\b(perception|flat|fortitude|reflex|will|athletics|acrobatics|arcana|crafting|deception|diplomacy|intimidation|medicine|nature|occultism|performance|religion|society|stealth|survival|thievery)\b/); const type = tm ? tm[1] : ''; const dc = (body.match(/dc:(\d+)/) || [])[1]; const basic = /basic/.test(body) ? '기본 ' : ''; return `<span class="ref-check">${dc ? `DC ${dc} ` : ''}${basic}${_checkTypeKo(type)}</span>`; });
    // @UUID: 참조 엔티티 정본 한글명으로 해소(로드된 카테고리 한정, 미해소 시 라벨 폴백)
    s = s.replace(/@UUID\[([^\]]+)\](?:\{([^}]*)\})?/g, (m, uuid, label) => { let name = ''; try { const t = getByUuid((uuid || '').trim().split(/\s+/)[0]); if (t) name = t.name_ko || t.name; } catch (e) {} const shown = name || label; return shown ? `<span class="ref-link">${_escDesc(shown)}</span>` : ''; });
    // @Embed: 인라인 임베드 → 참조 엔티티 정본명(전체 임베드 대신 명칭 링크)
    s = s.replace(/@Embed\[([^\]]+)\](?:\{([^}]*)\})?/g, (m, body, label) => { let name = ''; try { const t = getByUuid((body || '').trim().split(/\s+/)[0]); if (t) name = t.name_ko || t.name; } catch (e) {} const shown = label || name; return shown ? `<span class="ref-link">${_escDesc(shown)}</span>` : ''; });
    s = s.replace(/@Template\[([^\]]+)\](\{[^}]*\})?/g, (m, body) => { const d = (body.match(/distance:(\d+)/) || [])[1]; const SH = { emanation: '발산', burst: '폭발', cone: '원뿔', line: '직선' }; const ty = (body.match(/type:(\w+)/) || [])[1]; return `<span class="ref-area">${d || ''}피트 ${SH[ty] || ty || ''}</span>`; });
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

  // ---- FVTT 수식 평가: "max(1,floor(@actor.level/2))" / "@actor.level" / "floor(@actor.abilities.str.mod/2)" ----
  // ctx.actor = { level, abilities:{str..cha = mod 숫자} }. 미지원 형태(삼항 등)는 NaN(graceful).
  function evalFormula(val, ctx) {
    if (typeof val === 'number') return val;
    if (typeof val !== 'string') return NaN;
    let s = resolveBrackets(val.trim(), ctx || {});
    if (s === '') return NaN;
    const actor = (ctx && ctx.actor) || {};
    s = s.replace(/@actor\.level\b/g, String(actor.level || 0));
    s = s.replace(/@actor\.abilities\.(\w+)\.mod\b/g, (m, ab) => String((actor.abilities && actor.abilities[ab]) || 0));
    s = s.replace(/@[\w.]+/g, '0'); // 미지원 @참조 → 0 (graceful)
    // 식별자 화이트리스트: 허용 함수만 남기고 제거 후 잔여 글자 있으면 거부
    const residue = s.replace(/\b(max|min|floor|ceil|abs|round|sign)\b/g, '').replace(/[0-9+\-*/%(),.\s]/g, '');
    if (residue.length) return NaN; // 알 수 없는 식별자/연산 → 거부
    try {
      const fn = new Function('max', 'min', 'floor', 'ceil', 'abs', 'round', 'sign', 'return (' + s + ');');
      const r = fn(Math.max, Math.min, Math.floor, Math.ceil, Math.abs, Math.round, Math.sign);
      return (typeof r === 'number' && isFinite(r)) ? r : NaN;
    } catch (e) { return NaN; }
  }

  const API = {
    CATEGORIES, loadCategory, loadCategorySync, get, all, nameKo, descKo, enrichDesc, loadLocalize,
    testPredicate, _testStatement, getByUuid, resolveBrackets, evalFormula,
    _state: { base: _baseCache, ovl: _ovlCache, ovr: _ovrCache, index: _index },
  };
  root.PF2eData = API;
  if (isNode && typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
