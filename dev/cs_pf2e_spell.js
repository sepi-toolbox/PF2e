/* cs_pf2e_spell.js — 주문(Spell) ACCESS 어댑터 (P4)
 * FVTT spells.base(1796) ⊕ 한글 OVERLAY → 빌더가 쓰는 주문 카탈로그 형태로 노출(단일 소스).
 * 주문은 시트 스탯 자동화 없음(레퍼토리/준비 목록 콘텐츠). 메타(range/area/defense)는 한글 단위 변환.
 * 의존: cs_pf2e.js(PF2eData). DOM 무관. 미로드 시 빈 목록(로딩 게이트가 커버).
 */
(function (root) {
  'use strict';
  const isNode = typeof window === 'undefined';
  const PF = root.PF2eData || (isNode ? require('/tmp/PF2e-publish/dev/cs_pf2e.js') : null);

  let _ready = false, _lang = null, _index = null, _list = null;

  const AREA_KO = { burst: '폭발', emanation: '방출', cone: '원뿔', line: '직선', square: '사각', cube: '정육면체', sphere: '구체', radius: '반경' };
  const SAVE_KO = { reflex: '반사', fortitude: '인내', will: '의지' };

  function _traitKo(slug) { return (_lang && _lang.traits && _lang.traits[slug]) || slug; }
  function _rangeKo(v) {
    if (!v) return '';
    return String(v).replace(/\s*\bfeet\b/gi, '피트').replace(/\s*\bfoot\b/gi, '피트').replace(/\s*\bmiles?\b/gi, '마일')
      .replace(/\btouch\b/gi, '접촉').replace(/\bplanetary\b/gi, '행성 규모').replace(/\bvaries\b/gi, '가변').replace(/\binteractable\b/gi, '상호작용 가능');
  }
  function _areaKo(area) {
    if (!area || (!area.value && !area.type)) return '';
    const t = AREA_KO[area.type] || area.type || '';
    return area.value ? `${area.value}피트 ${t}`.trim() : t;
  }
  function _defenseKo(def) {
    if (!def) return '';
    if (def.save && def.save.statistic) return (def.save.basic ? '기본 ' : '') + (SAVE_KO[def.save.statistic] || def.save.statistic);
    if (def.passive && def.passive.statistic) return def.passive.statistic;
    return '';
  }
  function _actionsOf(time) {
    const v = (time && time.value) != null ? String(time.value) : '';
    if (v === 'reaction') return '반응';
    if (v === 'free') return '자유';
    return v; // "1"|"2"|"3" 또는 "1 minute" 등
  }

  function _loadLangSync() {
    if (!isNode) return;
    const fs = require('fs');
    for (const p of ['data/store/_glossary.json', 'dev/data/store/_glossary.json']) { try { _lang = JSON.parse(fs.readFileSync(p, 'utf8')); break; } catch (e) {} }
    _lang = _lang || { traits: {} };
  }
  async function _loadLangAsync() {
    if (root.PF2eAnc && root.PF2eAnc._glossary) { _lang = { traits: { /* lazy via glossary */ } }; }
    try { const r = await fetch('data/store/_glossary.json'); _lang = await r.json(); } catch (e) { _lang = { traits: {} }; }
  }

  async function init() {
    if (_ready) return;
    if (isNode) { PF.loadCategorySync('spells'); _loadLangSync(); }
    else await Promise.all([PF.loadCategory('spells'), _loadLangAsync()]);
    _build();
    _ready = true;
  }
  function ready() { return _ready; }

  function _build() {
    _index = new Map(); _list = [];
    const seen = new Set();
    for (const doc of PF.all('spells')) {
      const slug = doc.system && doc.system.slug; if (!slug || seen.has(slug)) continue; seen.add(slug);
      const leg = spellToLegacy(doc); _index.set(slug, leg); _list.push(leg);
    }
    _list.sort((a, b) => (a.rank - b.rank) || (a.name_ko || '').localeCompare(b.name_ko || '', 'ko'));
  }

  function spellToLegacy(doc) {
    const s = doc.system || {};
    const traitsV = (s.traits && s.traits.value) || [];
    const rank = (s.level && s.level.value) || 0;
    const isCantrip = traitsV.includes('cantrip');
    const isFocus = traitsV.includes('focus');
    return {
      id: doc.system.slug, name_ko: PF.nameKo(doc), name_en: doc.name_en || doc.name,
      rank, is_cantrip: isCantrip, is_focus: isFocus,
      traditions: ((s.traits && s.traits.traditions) || []).slice(),
      actions: _actionsOf(s.time),
      traits: traitsV.filter(t => t !== 'cantrip' && t !== 'focus').map(_traitKo),
      range: _rangeKo(s.range && s.range.value),
      area: _areaKo(s.area),
      defense: _defenseKo(s.defense),
      summary: '', desc: PF.enrichDesc(PF.descKo(doc) || ''),
      img: doc.img || null, _fvtt: true, _doc: doc,
    };
  }

  function spellList() { return _list ? _list.slice() : []; }
  function getSpellLegacy(key) {
    if (!_index) return null;
    if (_index.has(key)) return _index.get(key);          // slug/id 정확 일치(고유)
    const lc = String(key || '').toLowerCase();
    // 1순위: name_en 정확 일치(고유 식별자)
    for (const sp of _list) { if ((sp.name_en || '').toLowerCase() === lc) return sp; }
    // 2순위: name_ko — 오버레이 한글명 충돌(17명 35주문) 대비, 모호(복수 매치)하면 추측 금지=null.
    //   첫매치 반환 시 충돌 '패자' 오해소 + spellSlug 경유 저장본이 엉뚱한 주문으로 영구 변환됨(마이그레이션 오염).
    let match = null, count = 0;
    for (const sp of _list) { if ((sp.name_ko || '') === key) { match = sp; if (++count > 1) break; } }
    return count === 1 ? match : null;
  }

    // 전 카탈로그 로드 후 재열거 — init 시점에 타 카테고리 미로드로 enrichDesc @link가 영문 스냅샷된 캐시를 정본 한글로 재생성
  function rebuild() { if (_ready) _build(); }
const API = { init, ready, rebuild, spellList, getSpellLegacy, spellToLegacy };
  root.PF2eSpell = API;
  if (isNode && typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
