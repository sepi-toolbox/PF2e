/* cs_pf2e_action.js — 행동(Action) ACCESS 어댑터 (P4 후속, 카탈로그형)
 * FVTT actions.base(1340) ⊕ 한글 OVERLAY → 룩업/카탈로그로 노출.
 * ⚠ 행동 탭은 레거시 ACTION_DB(74, 큐레이션된 범용 기본/기술 행동)가 계속 구동.
 *    나머지 ~1266(passive/familiar/클래스 고유)은 이미 재주·클래스(FVTT-네이티브)로 표시됨.
 *    본 어댑터는 단일 소스 룩업 + 탭의 기본/기술 행동 아이콘·설명 비파괴 정합용.
 * 의존: cs_pf2e.js(PF2eData). DOM 무관. 배선=cs_modal.renderActions / cs_save onload.
 */
(function (root) {
  'use strict';
  const isNode = typeof window === 'undefined';
  const PF = root.PF2eData || (isNode ? require('/tmp/PF2e-publish/dev/cs_pf2e.js') : null);

  let _ready = false, _lang = null, _index = null, _list = null;

  function _traitKo(slug) { return (_lang && _lang.traits && _lang.traits[slug]) || slug; }

  // 행동경제 비용: actionType/actions.value → 탭이 쓰는 코드('1'|'2'|'3'|'reaction'|'free'|'passive')
  function _costOf(s) {
    const at = (s.actionType && s.actionType.value) || s.actionType;
    if (at === 'reaction') return 'reaction';
    if (at === 'free') return 'free';
    if (at === 'passive') return 'passive';
    const n = s.actions && s.actions.value;
    return n != null ? String(n) : 'passive';
  }

  function _loadLangSync() {
    if (!isNode) return;
    const fs = require('fs');
    for (const p of ['data/overlay/_lang.ko.json', 'dev/data/overlay/_lang.ko.json']) { try { _lang = JSON.parse(fs.readFileSync(p, 'utf8')); break; } catch (e) {} }
    _lang = _lang || { traits: {} };
  }
  async function _loadLangAsync(ver) {
    const q = ver ? ('?v=' + ver) : '';
    try { const r = await fetch('data/overlay/_lang.ko.json' + q); _lang = await r.json(); } catch (e) { _lang = { traits: {} }; }
  }

  function init(ver) {
    if (_ready) return Promise.resolve();
    if (isNode) { PF.loadCategorySync('actions'); _loadLangSync(); _build(); _ready = true; return Promise.resolve(); }
    return Promise.all([PF.loadCategory('actions'), _loadLangAsync(ver)]).then(() => { _build(); _ready = true; });
  }
  function ready() { return _ready; }

  function _build() {
    _index = new Map(); _list = [];
    const seen = new Set();
    for (const doc of PF.all('actions')) {
      const slug = doc.system && doc.system.slug; if (!slug || seen.has(slug)) continue; seen.add(slug);
      const leg = actionToLegacy(doc); _index.set(slug, leg); _list.push(leg);
    }
    _list.sort((a, b) => (a.name_ko || '').localeCompare(b.name_ko || '', 'ko'));
  }

  function actionToLegacy(doc) {
    const s = doc.system || {};
    const traitsV = (s.traits && s.traits.value) || [];
    return {
      id: doc.system.slug, name_ko: PF.nameKo(doc), name_en: doc.name_en || doc.name,
      cost: _costOf(s),
      category: s.category || null,             // offensive | interaction | defensive | familiar
      traits: traitsV.map(_traitKo),
      desc: PF.enrichDesc(PF.descKo(doc) || ''),
      img: doc.img || null, _fvtt: true, _doc: doc,
    };
  }

  function actionList() { return _list ? _list.slice() : []; }
  function getActionLegacy(key) {
    if (!_index) return null;
    if (_index.has(key)) return _index.get(key);
    const lc = String(key || '').toLowerCase();
    for (const a of _list) { if ((a.name_en || '').toLowerCase() === lc || (a.name_ko || '') === key) return a; }
    return null;
  }

  const API = { init, ready, actionList, getActionLegacy, actionToLegacy };
  root.PF2eAction = API;
  if (isNode && typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
