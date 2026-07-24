/* cs_pf2e_deity.js — 신격(Deity) ACCESS 어댑터 (P4 후속)
 * FVTT deities.base(478) ⊕ 한글 OVERLAY → 빌더가 쓰는 레거시 DEITY_DB 형태로 노출.
 * 레거시(20개)는 미준비 시 폴백. BASE는 font/spells/attribute/alternate domains 등 정보가 더 풍부.
 * 영역(domains)→집중주문 매핑 = data/derived/domains.json(64) → loadDomains()가 런타임 DOMAIN_DB 채움(v0.150~).
 * 의존: cs_pf2e.js(PF2eData). DOM 무관(데이터 백본). 배선=cs_modal/cs_feat_effects/cs_save.
 */
(function (root) {
  'use strict';
  const isNode = typeof window === 'undefined';
  const PF = root.PF2eData || (isNode ? require('/tmp/PF2e-publish/dev/cs_pf2e.js') : null);

  let _ready = false, _index = null, _list = null, _domainsLoaded = false;

  // 영역(Domain) 데이터 = DataManager 단일소스(data/derived/domains.json) → 런타임 DOMAIN_DB 채움.
  //   구 하드코딩 61개 폐기(v0.150). 소비처(cs_feat_effects $domain_initial, domainKo)는 DOMAIN_DB 그대로 사용.
  //   {slug:{name,initial,advanced}} 형태로 매핑(초기/고급 집중주문 슬러그).
  function _fillDomainDB(rows) {
    const DB = (typeof DOMAIN_DB !== 'undefined') ? DOMAIN_DB : (root.DOMAIN_DB || null);
    if (!DB) return;
    for (const r of (rows || [])) {
      if (!r || !r.slug) continue;
      DB[r.slug] = { name: r.name_ko || r.slug, initial: r.initialSpell || '', advanced: r.advancedSpell || '' };
    }
  }
  function loadDomains() {
    if (_domainsLoaded) return Promise.resolve();
    if (isNode) {
      const fs = require('fs');
      for (const p of ['data/derived/domains.json', 'dev/data/derived/domains.json', '/tmp/PF2e-publish/dev/data/derived/domains.json']) {
        try { _fillDomainDB(JSON.parse(fs.readFileSync(p, 'utf8')).rows); _domainsLoaded = true; break; } catch (e) {}
      }
      return Promise.resolve();
    }
    return fetch('data/derived/domains.json?v=0.239').then(r => r.json()).then(j => { _fillDomainDB(j.rows); _domainsLoaded = true; }).catch(() => {});
  }

  // 기술 한글명(오프라인 고정 — 글로서리 미의존). lore=지식.
  // 정본 = 사용자 노출 기술 목록(cs_data SKILLS / system_terms): 제작·자연학·오컬티즘·사회.
  const SKILL_KO = {
    acrobatics: '곡예', arcana: '주문학', athletics: '운동', crafting: '제작',
    deception: '기만', diplomacy: '외교', intimidation: '위협', medicine: '의학',
    nature: '자연학', occultism: '오컬티즘', performance: '공연', religion: '종교학',
    society: '사회', stealth: '은신', survival: '생존', thievery: '도둑질', lore: '지식',
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

  function init() { if (_ready) return Promise.resolve(); if (isNode) { loadDomains(); PF.loadCategorySync('deities'); _build(); _ready = true; return Promise.resolve(); } return Promise.all([loadDomains(), PF.loadCategory('deities')]).then(() => { _build(); _ready = true; }); }
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
      spells: s.spells || {},                       // {rank: UUID} 신격 주문(원본 참조)
      spells_slug: s.spells_slug || {},             // {rank: slug} 신격 주문(클레릭 주문목록 편입 — DataManager 베이크)
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

    // 전 카탈로그 로드 후 재열거 — init 시점에 타 카테고리 미로드로 enrichDesc @link가 영문 스냅샷된 캐시를 정본 한글로 재생성
  function rebuild() { if (_ready) _build(); }
const API = { init, ready, rebuild, loadDomains, deityList, getDeityLegacy, deityToLegacy, skillKo, domainKo, _const: { SKILL_KO, FONT_KO, SANCT_KO } };
  root.PF2eDeity = API;
  if (isNode && typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
