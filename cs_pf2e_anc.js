/* cs_pf2e_anc.js — 혈통(Ancestry)/유산(Heritage) ACCESS 어댑터 (P4 파일럿)
 * FVTT ancestries.base(50) + heritages.base(322) ⊕ 한글 OVERLAY → 빌더가 쓰는 레거시 형태로 노출.
 * 자동화(유산 효과)는 cs_re_engine.js(REEngine)로 system.rules를 해석해 getHeritageEffects 형태로 변환.
 * 의존: cs_pf2e.js(PF2eData), cs_re_engine.js(REEngine). DOM 무관(데이터 백본). 배선은 cs_modal/cs_calc/cs_save.
 * 설계: dev/FVTT_NATIVE_REBASE.md §5 P4. 레거시 ANCESTRIES/HERITAGE_DB는 미준비 시 폴백.
 */
(function (root) {
  'use strict';
  const isNode = typeof window === 'undefined';
  const PF = root.PF2eData || (isNode ? require('/tmp/PF2e-publish/dev/cs_pf2e.js') : null);
  const RE = root.REEngine || (isNode ? require('/tmp/PF2e-publish/dev/cs_re_engine.js') : null);

  let _ready = false;
  let _lang = null;    // _lang.ko.json (traits, size, damageType)
  let _sense = null;   // creatures/_glossary.ko.json.sense
  let _langGloss = null;   // creatures/_glossary.ko.json.language (언어 slug→한글, 시스템 용어 단일 소스)
  let _loreGloss = null;   // creatures/_glossary.ko.json.lore (지식 주제 영문→한글)
  let _ancIndex = null, _herIndex = null;  // slug → 레거시 객체
  let _ancList = null, _herList = null;

  // ── 글로서리 ──
  const SIZE_KO = { tiny: '초소형', sm: '소형', med: '중형', lg: '대형', huge: '거대형', grg: '초대형' };
  // FVTT vision/sense slug → 레거시 vision id (cs_data VISION_DEFS)
  const VISION_MAP = { 'low-light-vision': 'low-light', 'low-light': 'low-light', 'darkvision': 'darkvision', 'greater-darkvision': 'greater-darkvision', 'normal': 'none', '': 'none' };
  const VISION_RANK = { none: 0, 'low-light': 1, darkvision: 2, 'greater-darkvision': 3 };
  function _traitKo(slug) { return (_lang && _lang.traits && _lang.traits[slug]) || slug; }
  function _sizeKo(sz) { return SIZE_KO[sz] || '중형'; }
  function _senseKo(slug) { return (_sense && _sense[slug]) || slug; }
  function _languageKo(slug) { return (_langGloss && _langGloss[slug]) || slug; }
  function _loreKo(name) {
    if (!name || !_loreGloss) return name;
    const key = String(name).replace(/\s*Lore\b.*$/i, '').trim();   // "Warfare Lore"·"Warfare" 모두 허용
    return _loreGloss[key] || _loreGloss[name] || name;
  }
  function _dmgKo(slug) { return (_lang && _lang.damageType && _lang.damageType[slug]) || slug; }
  function _slugify(s) { return String(s || '').toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }

  // ── 초기화 ──
  function _loadGlossariesSync() {
    if (!isNode) return;
    const fs = require('fs');
    for (const p of ['data/overlay/_lang.ko.json', 'dev/data/overlay/_lang.ko.json']) { try { _lang = JSON.parse(fs.readFileSync(p, 'utf8')); break; } catch (e) {} }
    for (const p of ['data/creatures/_glossary.ko.json', 'dev/data/creatures/_glossary.ko.json']) { try { const g = JSON.parse(fs.readFileSync(p, 'utf8')) || {}; _sense = g.sense; _langGloss = g.language; _loreGloss = g.lore; break; } catch (e) {} }
    _lang = _lang || { traits: {}, damageType: {}, size: {} };
    _sense = _sense || {}; _langGloss = _langGloss || {}; _loreGloss = _loreGloss || {};
  }
  async function _loadGlossariesAsync(ver) {
    const q = ver ? ('?v=' + ver) : '';
    try { const r = await fetch('data/overlay/_lang.ko.json' + q); _lang = await r.json(); } catch (e) { _lang = { traits: {}, damageType: {} }; }
    try { const r = await fetch('data/creatures/_glossary.ko.json' + q); const g = await r.json(); _sense = g.sense; _langGloss = g.language; _loreGloss = g.lore; } catch (e) { _sense = {}; _langGloss = {}; _loreGloss = {}; }
    _sense = _sense || {}; _langGloss = _langGloss || {}; _loreGloss = _loreGloss || {};
  }

  async function init(ver) {
    if (_ready) return;
    if (isNode) { PF.loadCategorySync('ancestries'); PF.loadCategorySync('heritages'); _loadGlossariesSync(); }
    else { await Promise.all([PF.loadCategory('ancestries'), PF.loadCategory('heritages'), _loadGlossariesAsync(ver)]); }
    _buildIndexes();
    _ready = true;
  }
  function ready() { return _ready; }

  function _buildIndexes() {
    _ancIndex = new Map(); _herIndex = new Map(); _ancList = []; _herList = [];
    const seenA = new Set(), seenH = new Set();
    for (const doc of PF.all('ancestries')) {
      const slug = doc.system && doc.system.slug; if (!slug || seenA.has(slug)) continue; seenA.add(slug);
      const leg = ancestryToLegacy(doc); _ancIndex.set(slug, leg); _ancList.push(leg);
    }
    for (const doc of PF.all('heritages')) {
      const slug = doc.system && doc.system.slug; if (!slug || seenH.has(slug)) continue; seenH.add(slug);
      const leg = heritageToLegacy(doc); _herIndex.set(slug, leg); _herList.push(leg);
    }
    _ancList.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ko'));
    _herList.sort((a, b) => (a.name_ko || '').localeCompare(b.name_ko || '', 'ko'));
  }

  // ── 혈통 → 레거시 ANCESTRIES 형태 ──
  function ancestryToLegacy(doc) {
    const s = doc.system || {};
    const boosts = [], boost_choices = []; let free_boosts = 0;
    for (const k of Object.keys(s.boosts || {})) {
      const v = ((s.boosts[k] || {}).value) || [];
      if (v.length >= 6) free_boosts++;          // 6개 전체 = 자유 부스트
      else if (v.length === 1) boosts.push(v[0]); // 단일 = 고정
      else if (v.length > 1) boost_choices.push(v.slice());
    }
    const flaws = [], flaw_choices = []; let free_flaws = 0;
    for (const k of Object.keys(s.flaws || {})) {
      const v = ((s.flaws[k] || {}).value) || [];
      if (v.length >= 6) free_flaws++;
      else if (v.length === 1) flaws.push(v[0]);
      else if (v.length > 1) flaw_choices.push(v.slice());
    }
    const vision = VISION_MAP[s.vision] != null ? VISION_MAP[s.vision] : (s.vision || 'none');
    const langs = (s.languages && s.languages.value) || [];
    const addl = s.additionalLanguages || {};
    // grantWeapon: 내장 items 중 무기형(슬러그) — 표시용(무료 획득)
    let grantWeapon;
    for (const k of Object.keys(s.items || {})) { const it = s.items[k]; const sl = _slugify(it && it.name); if (sl) { grantWeapon = sl; break; } }
    return {
      id: doc.system.slug, name: PF.nameKo(doc), en: doc.name_en || doc.name,
      hp: s.hp || 0, size: _sizeKo(s.size), speed: (typeof s.speed === 'number' ? s.speed : (s.speed && s.speed.value) || 25),
      boosts, flaws, boost_choices, flaw_choices, free_boosts, free_flaws,
      // self-slug를 트레잇에 항상 포함 → 혈통 재주/선행조건/시야 게이팅이 self-멤버십으로 매칭(FVTT 일부 doc이 self-slug 누락: dragonet/poppet/fleshwarp)
      traits: [...new Set([doc.system.slug, ...((s.traits && s.traits.value) || [])])].map(_traitKo),
      vision, languages: langs.slice(), bonusLangs: addl.count || 0,
      desc: PF.enrichDesc(PF.descKo(doc) || ''), features: [], grantWeapon,
      rarity: (s.traits && s.traits.rarity) || 'common',
      img: doc.img || null, _fvtt: true, _doc: doc,
    };
  }

  // ── 유산 → 레거시 HERITAGE_DB 형태 (효과는 RE 엔진으로 on-demand 계산) ──
  function heritageToLegacy(doc) {
    const s = doc.system || {};
    return {
      id: doc.system.slug, name_ko: PF.nameKo(doc), name_en: doc.name_en || doc.name,
      ancestry: (s.ancestry && s.ancestry.slug) || null,
      summary: PF.enrichDesc(PF.descKo(doc) || ''),
      rarity: (s.traits && s.traits.rarity) || 'common',
      img: doc.img || null, _fvtt: true, _reEffects: true, _doc: doc,
    };
  }

  // ── 유산 효과: system.rules → getHeritageEffects 형태 (cs_calc) ──
  // ctx = { level, abilities:{str..cha mod}, ancestrySlug, ancestryTraits, choices:{flag:value} }
  function heritageEffects(herDoc, ctx) {
    ctx = ctx || {};
    if (!RE || !herDoc) return {};
    const a = RE.build({
      level: ctx.level || 1, abilities: ctx.abilities || {},
      ancestry: ctx.ancestrySlug || null, class: ctx.classSlug || null,
      traits: ctx.ancestryTraits || [],
      items: [{ doc: herDoc, choices: ctx.choices || {} }],
    });
    const out = {};
    // 감각: vision형은 vision으로 승격, 그 외는 extraSenses(한글)
    for (const raw of a.senses) {
      const sl = String(raw).split(':')[0];
      if (VISION_MAP[sl] && VISION_MAP[sl] !== 'none') {
        const cand = VISION_MAP[sl];
        if (!out.vision || (VISION_RANK[cand] || 0) > (VISION_RANK[out.vision] || 0)) out.vision = cand;
      } else {
        out.extraSenses = (out.extraSenses ? out.extraSenses + ', ' : '') + _senseKo(sl);
      }
    }
    // HP 보너스 (selector 'hp' FlatModifier 스택 합산)
    const hp = RE.getStatistic(a, 'hp').total;
    if (hp) out.hpBonus = hp;
    // 저항 / 취약 (값은 RE가 @actor.level 등 평가 완료)
    if (a.iwr.resistances.length) out.resistances = a.iwr.resistances.map(r => ({ type: _dmgKo(r.type), value: (typeof r.value === 'number' ? r.value : r.value) }));
    if (a.iwr.weaknesses.length) out.weaknesses = a.iwr.weaknesses.map(r => ({ type: _dmgKo(r.type), value: r.value }));
    // 부여 재주 (GrantItem 해소 doc 중 feat 타입 → 레거시 슬러그)
    const feats = (a.grantedDocs || []).filter(d => d && d.type === 'feat');
    if (feats.length) out.grantFeats = feats.map(d => (d.system && d.system.slug) || d._id);
    // 선천 주문 (GrantItem 해소 doc 중 spell 타입) — 레거시 grant_innate_spell 패리티. 서브클래스 어댑터와 동일 스캔.
    const spellDocs = (a.grantedDocs || []).filter(d => d && d.type === 'spell');
    if (spellDocs.length) out.innateSpells = spellDocs.map(d => {
      const trads = (d.system && d.system.traits && d.system.traits.traditions) || [];
      return { name: PF.nameKo(d), tradition: trads.length ? _traitKo(trads[0]) : '선천', type: '선천', uses: '하루 1회' };
    });
    // 부여 무기 (GrantItem 해소 doc 중 weapon 타입) — 레거시 grant_weapon 패리티
    const wpn = (a.grantedDocs || []).find(d => d && d.type === 'weapon');
    if (wpn) out.grantWeapon = { name: PF.nameKo(wpn), category: (wpn.system && wpn.system.category) || null };
    // 숙련 rank 변경 (ActiveEffectLike system.skills.X.rank → grantSkills)
    for (const path of Object.keys(a.dataChanges || {})) {
      const m = path.match(/^system\.skills\.([a-z-]+)\.rank$/);
      if (m && a.dataChanges[path] >= 1) (out.grantSkills = out.grantSkills || []).push(m[1]);
    }
    // 미구현/조건부 RE 로그 (디버그)
    if (a._log && a._log.length) out._log = a._log.slice();
    return out;
  }

  // ── 조회 API ──
  function ancestryList() { return _ancList ? _ancList.slice() : []; }
  function heritageList() { return _herList ? _herList.slice() : []; }
  function getAncestryLegacy(slug) { return _ancIndex ? _ancIndex.get(slug) || null : null; }
  function getHeritageLegacy(slug) { return _herIndex ? _herIndex.get(slug) || null : null; }
  function ancestryDocOf(legacy) { return (legacy && legacy._doc) || (legacy && PF.get('ancestries', legacy.id)) || null; }

  const API = {
    init, ready, ancestryList, heritageList, getAncestryLegacy, getHeritageLegacy,
    ancestryToLegacy, heritageToLegacy, heritageEffects, ancestryDocOf,
    _glossary: { sizeKo: _sizeKo, senseKo: _senseKo, languageKo: _languageKo, loreKo: _loreKo, traitKo: _traitKo, dmgKo: _dmgKo, VISION_MAP },
  };
  root.PF2eAnc = API;
  if (isNode && typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
