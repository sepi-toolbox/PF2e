/* cs_pf2e_deity.js — 신격(Deity) ACCESS 어댑터 (P4 후속)
 * FVTT deities.base(478) ⊕ 한글 OVERLAY → 빌더가 쓰는 레거시 DEITY_DB 형태로 노출.
 * 레거시(20개)는 미준비 시 폴백. BASE는 font/spells/attribute/alternate domains 등 정보가 더 풍부.
 * 영역(domains)→집중주문 매핑은 DOMAIN_DB(class_features_db.js) 담당(현재 39/64 커버, 확장 별도 과제).
 * 의존: cs_pf2e.js(PF2eData). DOM 무관(데이터 백본). 배선=cs_modal/cs_feat_effects/cs_save.
 */
(function (root) {
  'use strict';
  const isNode = typeof window === 'undefined';
  const PF = root.PF2eData || (isNode ? require('/tmp/PF2e-publish/dev/cs_pf2e.js') : null);

  let _ready = false, _index = null, _list = null;

  // 기술 한글명(오프라인 고정 — 글로서리 미의존). lore=지식.
  const SKILL_KO = {
    acrobatics: '곡예', arcana: '주문학', athletics: '운동', crafting: '공예',
    deception: '기만', diplomacy: '외교', intimidation: '위협', medicine: '의학',
    nature: '자연', occultism: '신비학', performance: '공연', religion: '종교학',
    society: '사회학', stealth: '은신', survival: '생존', thievery: '도둑질', lore: '지식',
  };
  const FONT_KO = { harm: '해악(Harm)', heal: '치유(Heal)' };
  const SANCT_KO = { holy: '신성(Holy)', unholy: '불경(Unholy)' };

  function skillKo(slug) { return SKILL_KO[slug] || slug; }
  // 영역 한글: DOMAIN_DB(런타임 전역) 우선, 없으면 id 그대로(미커버 25개)
  function domainKo(id) {
    if (typeof DOMAIN_DB !== 'undefined' && DOMAIN_DB && DOMAIN_DB[id] && DOMAIN_DB[id].name) return DOMAIN_DB[id].name;
    return id;
  }
  function _title(doc) {
    const ko = (doc && doc._desc_ko) || '';
    let m = ko.match(/<strong>\s*제목\s*<\/strong>\s*([^<\n]+)/);
    if (m) return m[1].trim();
    const en = (doc && (doc._desc_en || (doc.system && doc.system.description && doc.system.description.value))) || '';
    m = en.match(/<strong>\s*Title\s*<\/strong>\s*([^<\n]+)/);
    return m ? m[1].trim() : '';
  }

  function init() { if (_ready) return Promise.resolve(); if (isNode) { PF.loadCategorySync('deities'); _build(); _ready = true; return Promise.resolve(); } return PF.loadCategory('deities').then(() => { _build(); _ready = true; }); }
  function ready() { return _ready; }

  function _build() {
    _index = new Map(); _list = [];
    const seen = new Set();
    for (const doc of PF.all('deities')) {
      const slug = doc.system && doc.system.slug; if (!slug || seen.has(slug)) continue; seen.add(slug);
      const leg = deityToLegacy(doc); _index.set(slug, leg); _list.push(leg);
    }
    _list.sort((a, b) => (a.name_ko || '').localeCompare(b.name_ko || '', 'ko'));
  }

  function deityToLegacy(doc) {
    const s = doc.system || {};
    const dom = s.domains || {};
    const sanct = (s.sanctification && s.sanctification.what) || [];
    return {
      id: doc.system.slug, name_ko: PF.nameKo(doc), name_en: doc.name_en || doc.name,
      weapon: (s.weapons || [])[0] || null,
      skill: (s.skill || [])[0] || null,
      skill_ko: skillKo((s.skill || [])[0]),
      sanctification: sanct.slice(),
      domains: (dom.primary || []).slice(),
      altDomains: (dom.alternate || []).slice(),
      domains_ko: (dom.primary || []).map(domainKo),
      title: _title(doc),
      // BASE 추가 정보(레거시엔 없던 것)
      font: (s.font || []).slice(),                 // ['harm','heal'] — 신성 원천 후보
      attribute: (s.attribute || []).slice(),       // 선호 능력치(부스트)
      spells: s.spells || {},                       // {rank: UUID} 신격 주문(클레릭 자동 습득)
      category: s.category || 'deity',              // deity | pantheon | covenant | philosophy
      rarity: (s.traits && s.traits.rarity) || 'common',
      desc: PF.enrichDesc(PF.descKo(doc) || ''),
      img: doc.img || null, _fvtt: true, _doc: doc,
    };
  }

  function deityList() { return _list ? _list.slice() : []; }
  function getDeityLegacy(key) {
    if (!_index) return null;
    if (_index.has(key)) return _index.get(key);
    const lc = String(key || '').toLowerCase();
    for (const d of _list) { if ((d.name_en || '').toLowerCase() === lc || (d.name_ko || '') === key) return d; }
    return null;
  }

  const API = { init, ready, deityList, getDeityLegacy, deityToLegacy, skillKo, domainKo, _const: { SKILL_KO, FONT_KO, SANCT_KO } };
  root.PF2eDeity = API;
  if (isNode && typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
