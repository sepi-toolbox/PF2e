/* cs_pf2e_feat.js — 재주(Feat) ACCESS 어댑터 (P4, 최대 엔티티)
 * FVTT feats.base(7398) ⊕ 한글 OVERLAY → 빌더 재주풀 단일 소스 + RE 자동화.
 * 정책: 재주 카탈로그는 FVTT 단일 소스, 효과는 effects_db(getEffectRows), 선행조건은 prereqs_db.
 * 교차참조 핵심: GrantItem(재주→재주/주문) RE 해소(getByUuid) + 선행조건 feat-name 매칭(getFeat 병합).
 * 의존: cs_pf2e.js(PF2eData), cs_re_engine.js(REEngine). DOM 무관.
 */
(function (root) {
  'use strict';
  const isNode = typeof window === 'undefined';
  const PF = root.PF2eData || (isNode ? require('/tmp/PF2e-publish/dev/cs_pf2e.js') : null);
  const RE = root.REEngine || (isNode ? require('/tmp/PF2e-publish/dev/cs_re_engine.js') : null);

  let _ready = false, _lang = null, _index = null, _list = null;

  // FVTT category → 레거시 category. 빌더 무관 카테고리는 제외.
  const CAT_MAP = { class: 'class', ancestry: 'ancestry', skill: 'skill', general: 'general', classfeature: 'feature', ancestryfeature: 'feature', bonus: 'general' };
  // 클래스 소속 = FVTT 트레잇(영문 slug). 클래스 재주 필터가 category(레거시=classid)와 함께 이걸로도 매칭 → 소스 무관 통일.
  // 다중클래스 재주(공유 스펠셰이프 등)는 슬러그 여러 개 → 단일 category로 불가능한 케이스까지 커버.
  const CLASS_SLUGS = new Set(['alchemist','animist','barbarian','bard','champion','cleric','commander','druid','exemplar','fighter','guardian','gunslinger','inventor','investigator','kineticist','magus','monk','oracle','psychic','ranger','rogue','sorcerer','summoner','swashbuckler','thaumaturge','witch','wizard']);
  const SKIP = new Set(['deityboon', 'pfsboon', 'curse', 'calling', 'kingdom-feature', 'kingdom-activity', 'kingdom-feat', 'army-war-action', 'army-tactic']);
  const VISION_MAP = { 'low-light-vision': 'low-light', 'low-light': 'low-light', darkvision: 'darkvision', 'greater-darkvision': 'greater-darkvision' };
  const VISION_RANK = { none: 0, 'low-light': 1, darkvision: 2, 'greater-darkvision': 3 };

  function _traitKo(slug) { return (_lang && _lang.traits && _lang.traits[slug]) || slug; }
  function _dmgKo(slug) { return (_lang && _lang.damageType && _lang.damageType[slug]) || slug; }
  function _senseKo(slug) { return (root.PF2eAnc && root.PF2eAnc._glossary) ? root.PF2eAnc._glossary.senseKo(slug) : slug; }

  function _loadLangSync() { if (!isNode) return; const fs = require('fs'); for (const p of ['data/overlay/_lang.ko.json', 'dev/data/overlay/_lang.ko.json']) { try { _lang = JSON.parse(fs.readFileSync(p, 'utf8')); break; } catch (e) {} } _lang = _lang || { traits: {} }; }
  async function _loadLangAsync() { try { const r = await fetch('data/overlay/_lang.ko.json'); _lang = await r.json(); } catch (e) { _lang = { traits: {} }; } }

  async function init() {
    if (_ready) return;
    if (isNode) { PF.loadCategorySync('feats'); _loadLangSync(); }
    else await Promise.all([PF.loadCategory('feats'), _loadLangAsync()]);
    _build();
    _ready = true;
  }
  function ready() { return _ready; }

  function _legacyCat(doc) {
    const s = doc.system || {};
    const traits = (s.traits && s.traits.value) || [];
    if (traits.includes('archetype') || traits.includes('dedication')) return 'archetype';
    return CAT_MAP[s.category] || null;
  }

  function _build() {
    _index = new Map(); _list = [];
    const seen = new Set();
    for (const doc of PF.all('feats')) {
      const s = doc.system || {}; const slug = s.slug; if (!slug || seen.has(slug)) continue;
      if (SKIP.has(s.category)) continue;
      const cat = _legacyCat(doc); if (!cat) continue;
      seen.add(slug);
      const leg = featToLegacy(doc, cat); _index.set(slug, leg); _list.push(leg);
    }
  }

  function _prereqText(doc) {
    const v = ((doc.system || {}).prerequisites || {}).value || [];
    return v.map(x => (x && x.value) || x).filter(Boolean).join(', ');
  }

  function featToLegacy(doc, cat) {
    const s = doc.system || {};
    cat = cat || _legacyCat(doc) || 'general';
    const traitsV = (s.traits && s.traits.value) || [];
    const isAuto = (s.category === 'classfeature' || s.category === 'ancestryfeature');
    const clsSlugs = traitsV.filter(t => CLASS_SLUGS.has(t));  // 클래스 소속(영문 slug) — 필터 통일용
    return {
      id: s.slug, name_ko: PF.nameKo(doc), name_en: doc.name_en || doc.name,
      category: cat, feat_level: (s.level && s.level.value) || 0,
      _classSlugs: clsSlugs.length ? clsSlugs : undefined,
      traits: traitsV.map(_traitKo), rarity: (s.traits && s.traits.rarity) || 'common',
      prerequisites: _prereqText(doc),
      desc: PF.enrichDesc(PF.descKo(doc) || ''),
      acquisition: isAuto ? 'auto' : 'selectable',
      actionType: (s.actionType && s.actionType.value) || null,
      actions: (s.actions && s.actions.value) != null ? s.actions.value : null,
      repeatable: /특수.{0,4}여러 번|repeatedly|each time you/i.test(PF.descKo(doc) || doc.name || ''),
      img: doc.img || null, _fvtt: true, _reEffects: true, _doc: doc,
    };
  }

  // ── 재주 효과: system.rules → 레거시 effects 배열 (cs_feat_effects _getFeatEffectsDef가 {effects}로 래핑) ──
  // ctx = { level, abilities, ancestrySlug, ancestryTraits, classSlug, choices }
  function featEffects(doc, ctx) {
    ctx = ctx || {};
    if (!RE || !doc) return [];
    const a = RE.build({
      level: ctx.level || 1, abilities: ctx.abilities || {},
      ancestry: ctx.ancestrySlug || null, class: ctx.classSlug || null,
      traits: ctx.ancestryTraits || [],
      items: [{ doc, choices: ctx.choices || {} }],
    });
    const effects = [];
    // 부여(GrantItem) — 교차참조 핵심: 재주→재주 / 재주→주문
    for (const g of (a.grantedDocs || [])) {
      if (!g) continue;
      const gs = (g.system && g.system.slug) || g._id;
      const nameKo = PF.nameKo(g), nameEn = g.name_en || g.name;
      if (g.type === 'feat') {
        effects.push({ type: 'grant_feat', feat: `${nameKo} (${nameEn})` });
      } else if (g.type === 'spell') {
        const traits = (g.system && g.system.traits && g.system.traits.value) || [];
        const trads = (g.system && g.system.traits && g.system.traits.traditions) || [];
        if (traits.includes('focus')) effects.push({ type: 'grant_focus_spell', spell: nameKo });
        else effects.push({ type: 'grant_innate_spell', spell: nameKo, tradition: (trads[0] || ''), spellType: traits.includes('cantrip') ? 'cantrip' : 'spell' });
      }
    }
    // HP / 보너스 (FlatModifier 풀)
    const hp = RE.getStatistic(a, 'hp').total; if (hp) effects.push({ type: 'hp_bonus', value: hp });
    // 감각
    for (const raw of a.senses) {
      const sl = String(raw).split(':')[0];
      if (VISION_MAP[sl]) effects.push({ type: 'vision_upgrade', vision: VISION_MAP[sl] });
      else effects.push({ type: 'extra_sense', sense: _senseKo(sl) });
    }
    // 저항
    for (const r of a.iwr.resistances) effects.push({ type: 'resistance', target: _dmgKo(r.type), value: (typeof r.value === 'number' ? r.value : r.value) });
    // 숙련 훈련 (ActiveEffectLike skill rank)
    for (const path of Object.keys(a.dataChanges || {})) {
      const m = path.match(/^system\.skills\.([a-z-]+)\.rank$/);
      if (m && a.dataChanges[path] >= 1) effects.push({ type: 'skill_trained', skill: m[1] });
    }
    return effects;
  }

  // 전 FVTT 재주(카테고리 필터 통과분). 재주풀 단일 소스.
  function featList() { return _list ? _list.slice() : []; }
  function getFeatLegacy(key) {
    if (!_index) return null;
    if (_index.has(key)) return _index.get(key);
    const lc = String(key || '').toLowerCase();
    for (const f of _list) { if ((f.name_en || '').toLowerCase() === lc || f.name_ko === key) return f; }
    return null;
  }

  const API = { init, ready, featList, getFeatLegacy, featToLegacy, featEffects };
  root.PF2eFeat = API;
  if (isNode && typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
