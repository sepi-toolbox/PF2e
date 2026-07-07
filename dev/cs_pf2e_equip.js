/* cs_pf2e_equip.js — 장비 ACCESS 어댑터 (P3)
 * FVTT equipment.base(5646) ⊕ 한글 OVERLAY/_lang → 빌더 UI가 쓰는 검색·필터·카드 형태로 노출.
 * 의존: cs_pf2e.js (PF2eData). DOM 무관(데이터 백본). UI 배선은 별도.
 */
(function (root) {
  'use strict';
  const isNode = typeof window === 'undefined';
  const PF = root.PF2eData || (isNode ? require('/tmp/PF2e-publish/dev/cs_pf2e.js') : null);

  let _lang = null;
  function _loadLang() {
    if (_lang) return _lang;
    if (isNode) { const fs = require('fs'); for (const p of ['data/store/_glossary.json', 'dev/data/store/_glossary.json']) { try { _lang = JSON.parse(fs.readFileSync(p, 'utf8')); break; } catch (e) {} } }
    _lang = _lang || { traits: {}, damageType: {}, weaponGroup: {}, armorGroup: {} };
    return _lang;
  }
  // 브라우저용 async 초기화
  async function init() { if (!isNode && !_lang) { try { const r = await fetch('data/store/_glossary.json'); _lang = await r.json(); } catch (e) { _lang = { traits: {}, damageType: {}, weaponGroup: {}, armorGroup: {} }; } } _loadLang(); }

  const RARITY_KO = { common: '일반', uncommon: '비범', rare: '희귀', unique: '고유' };
  const WCAT_KO = { simple: '단순', martial: '군용', advanced: '고급', unarmed: '비무장' };
  const ACAT_KO = { unarmored: '비무장', light: '경장', medium: '중장', heavy: '중량' };
  const ITEMTYPE_KO = { weapon: '무기', armor: '방어구', shield: '방패', consumable: '소비품', equipment: '장비', treasure: '보물', backpack: '용기', ammo: '탄약', kit: '키트' };

  function trait(slug) { const l = _loadLang(); return (l.traits && l.traits[slug]) || slug; }
  function damageTypeKo(slug) { const l = _loadLang(); return (l.damageType && l.damageType[slug]) || slug; }

  function formatPrice(price) {
    if (!price || !price.value) return '—';
    const v = price.value; const parts = [];
    if (v.pp) parts.push(`${v.pp}pp`); if (v.gp) parts.push(`${v.gp}gp`); if (v.sp) parts.push(`${v.sp}sp`); if (v.cp) parts.push(`${v.cp}cp`);
    if (!parts.length) return '—';
    return parts.join(' ') + (price.per && price.per > 1 ? ` (${price.per}개당)` : '');
  }
  function formatBulk(bulk) {
    if (!bulk) return '—'; const v = bulk.value;
    if (v === 0 || v == null) return '—'; if (v === 0.1) return 'L'; return String(v);
  }
  function _dmg(system) {
    const d = system.damage; if (!d) return null;
    return `${d.dice || 1}${d.die || ''} ${damageTypeKo(d.damageType)}`;
  }

  // 슬림 카드(목록/검색용)
  function _slim(doc) {
    const s = doc.system || {};
    return {
      slug: (s.slug) || doc._id, name_ko: doc.name_ko || doc.name, name_en: doc.name_en || doc.name,
      img: doc.img || null,
      type: doc.type, type_ko: ITEMTYPE_KO[doc.type] || doc.type,
      level: (s.level && s.level.value) || 0,
      price: formatPrice(s.price), bulk: formatBulk(s.bulk),
      rarity: (s.traits && s.traits.rarity) || 'common', rarity_ko: RARITY_KO[(s.traits && s.traits.rarity)] || '일반',
      traits: (s.traits && s.traits.value) || [], traits_ko: ((s.traits && s.traits.value) || []).map(trait),
      damage: doc.type === 'weapon' ? _dmg(s) : null,
      acBonus: doc.type === 'armor' ? s.acBonus : (doc.type === 'shield' ? (s.acBonus || (s.armor && s.armor.value)) : null),
    };
  }

  // 검색·필터. opts: {type, search, minLevel, maxLevel, rarity, traits:[]}
  function list(opts) {
    opts = opts || {};
    const arr = PF.all('equipment');
    const q = (opts.search || '').trim().toLowerCase();
    const out = [];
    for (const doc of arr) {
      const s = doc.system || {};
      if (opts.type && doc.type !== opts.type) continue;
      const lv = (s.level && s.level.value) || 0;
      if (opts.minLevel != null && lv < opts.minLevel) continue;
      if (opts.maxLevel != null && lv > opts.maxLevel) continue;
      if (opts.rarity && (s.traits && s.traits.rarity) !== opts.rarity) continue;
      if (opts.traits && opts.traits.length) { const tv = (s.traits && s.traits.value) || []; if (!opts.traits.every(t => tv.includes(t))) continue; }
      if (q) {
        const nk = (doc.name_ko || doc.name || '').toLowerCase();
        const ne = (doc.name_en || doc.name || '').toLowerCase();
        if (nk.indexOf(q) === -1 && ne.indexOf(q) === -1) continue;
      }
      out.push(_slim(doc));
    }
    out.sort((a, b) => a.level - b.level || a.name_ko.localeCompare(b.name_ko, 'ko'));
    return out;
  }

  // 상세 카드(표시용 전체)
  function card(slug) {
    const doc = PF.get('equipment', slug); if (!doc) return null;
    const s = doc.system || {};
    const base = _slim(doc);
    base.desc_ko = PF.descKo(doc);
    base.usage = s.usage && s.usage.value;
    if (doc.type === 'weapon') { base.category = WCAT_KO[s.category] || s.category; base.group = (_loadLang().weaponGroup || {})[s.group] || s.group; base.range = s.range; base.reload = s.reload && s.reload.value; base.hands = (s.traits && s.traits.value || []).some(t => t.startsWith('two-hand')) ? 2 : 1; }
    if (doc.type === 'armor') { base.category = ACAT_KO[s.category] || s.category; base.group = (_loadLang().armorGroup || {})[s.group] || s.group; base.dexCap = s.dexCap; base.checkPenalty = s.checkPenalty; base.speedPenalty = s.speedPenalty; base.strength = s.strength; }
    if (doc.type === 'consumable') { base.consumableType = s.category; base.uses = s.uses; }
    return base;
  }

  // ===== 레거시 shape 변환 (기존 cs_ui.js 장비 파이프라인 호환) =====
  // 무기/방어구/방패/장비 공통 레거시 필드 shape → _data/_dbData로 그대로 사용.
  const WCAT_LEGACY = { simple: '단순', martial: '군용', advanced: '고급', unarmed: '비무장' }; // getWeaponCategory 인식 형태
  const ACAT_LEGACY = { unarmored: '비무장', light: '경장', medium: '중장', heavy: '중량' };
  const DMG_LETTER = { slashing: 'S', piercing: 'P', bludgeoning: 'B' };
  function _bulkNum(bulk) { const v = bulk && bulk.value; if (v === 0.1) return 'L'; return v || 0; }
  function _traitsKo(s) { return ((s.traits && s.traits.value) || []).map(trait); }
  function _weaponDamageStr(s) { const d = s.damage; if (!d) return ''; const t = DMG_LETTER[d.damageType] || damageTypeKo(d.damageType); return `${d.dice || 1}${d.die || ''} ${t}`.trim(); }

  // doc(FVTT) → 레거시 항목. type별 분기.
  function toLegacy(doc) {
    if (!doc) return null;
    const s = doc.system || {};
    const base = { id: s.slug || doc._id, name_ko: doc.name_ko || doc.name, name_en: doc.name_en || doc.name, img: doc.img || null, price: formatPrice(s.price), bulk: _bulkNum(s.bulk), level: (s.level && s.level.value) || 0, desc: PF.descKo(doc) || '' };
    switch (doc.type) {
      case 'weapon':
        return Object.assign(base, { category: WCAT_LEGACY[s.category] || s.category || '단순', catSlug: s.category || '', rarity: (s.traits && s.traits.rarity) || 'common', damage: _weaponDamageStr(s), hands: ((s.traits && s.traits.value) || []).some(t => t.startsWith('two-hand')) ? 2 : 1, range: (s.range && (s.range.increment || s.range.max)) || (typeof s.range === 'number' ? s.range : null), reload: (s.reload && s.reload.value) != null ? Number(s.reload.value) : null, group: (_loadLang().weaponGroup || {})[s.group] || s.group || '', traits: _traitsKo(s) });
      case 'armor':
        return Object.assign(base, { ac_bonus: s.acBonus || 0, dex_cap: s.dexCap != null ? s.dexCap : null, check_penalty: s.checkPenalty || 0, speed_penalty: s.speedPenalty || 0, strength: s.strength || 0, category: ACAT_LEGACY[s.category] || s.category || '', catSlug: s.category || '', group: (_loadLang().armorGroup || {})[s.group] || s.group || '', traits: _traitsKo(s) });
      case 'shield':
        return Object.assign(base, { ac_bonus: s.acBonus || 0, hardness: s.hardness || 0, hp: (s.hp && s.hp.max) || 0, bt: Math.floor(((s.hp && s.hp.max) || 0) / 2), speed_penalty: s.speedPenalty || 0, traits: _traitsKo(s) });
      default: // equipment/consumable/treasure/backpack/ammo/kit → 인벤토리 장비
        return Object.assign(base, { invCat: doc.type === 'consumable' ? 'consumable' : (doc.type === 'ammo' ? 'ammo' : 'gear'), traits: _traitsKo(s), _desc: PF.descKo(doc) || '', _ptype: doc.type });
    }
  }
  // 레거시형 목록(브라우즈용): list() 필터 적용 + toLegacy 매핑
  function legacyList(opts) { return list(opts).map(c => toLegacy(PF.get('equipment', c.slug))).filter(Boolean); }

  // 타입별 개수(탭 뱃지용)
  function typeCounts() {
    const c = {}; for (const d of PF.all('equipment')) c[d.type] = (c[d.type] || 0) + 1; return c;
  }

  // ── 단일 소스 리졸버 (getWeapon/getArmor/getShield/getGear 공통) ──
  // 구 큐레이션 DB(WEAPON/ARMOR/SHIELD/GEAR)가 쓰던 slug·이름 중 FVTT와 어긋나는 것만 매핑.
  // (구 저장 캐릭터 하위호환용. 대부분은 slug/name_en/name_ko로 직접 해소됨.)
  const _EQ_ALIAS = {
    'dwarven-waraxe': 'dwarven-war-axe', 'studded-leather': 'studded-leather-armor',
    'healers-tools': 'healers-toolkit', 'thieves-tools': 'thieves-toolkit', 'alchemists-tools': 'alchemists-toolkit',
    'instrument-handheld': 'musical-instrument-handheld', 'religious-symbol-wood': 'religious-symbol-wooden',
    'rope-50-ft': 'rope', 'repair-kit': 'repair-toolkit', 'rations-2-weeks': 'rations',
    'primal-focus': 'primal-symbol', 'alchemists-fire': 'alchemists-fire-lesser',
    'arrows-10': 'arrows', 'bolts-10': 'bolts', 'sling-bullets-10': 'sling-bullets', 'blowgun-darts-10': 'blowgun-darts',
    // arcane-spellcasting-pouch: 리마스터에서 제거(등가 없음) → null(인스턴스 _data 폴백이 표시 보장)
  };
  let _resIdx = null, _resIdxN = -1;
  function _resolveIndex() {
    const arr = PF.all('equipment');
    if (_resIdx && _resIdxN === arr.length) return _resIdx;   // 카테고리 로드되면(길이 변화) 재구축
    _resIdx = { slug: new Map(), en: new Map(), ko: new Map() };
    for (const d of arr) {
      const slug = (d.system && d.system.slug) || d._id;
      if (slug && !_resIdx.slug.has(slug)) _resIdx.slug.set(slug, d);
      const en = (d.name_en || d.name || '').toLowerCase(); if (en && !_resIdx.en.has(en)) _resIdx.en.set(en, d);
      const ko = PF.nameKo(d); if (ko && !_resIdx.ko.has(ko)) _resIdx.ko.set(ko, d);
    }
    _resIdxN = arr.length;
    return _resIdx;
  }
  // key = slug / name_en / name_ko(구 저장) 모두 허용. type 지정 시 그 타입만(무기/방어구/방패 오해소 방지).
  function getEquipLegacy(key, type) {
    if (!key) return null;
    const idx = _resolveIndex();
    const aliased = _EQ_ALIAS[key] || key;
    let doc = idx.slug.get(aliased) || idx.slug.get(key) || idx.en.get(String(key).toLowerCase()) || idx.ko.get(key) || null;
    if (doc && type && doc.type !== type) return null;
    return doc ? toLegacy(doc) : null;
  }

  const API = { init, list, card, legacyList, toLegacy, getEquipLegacy, typeCounts, trait, damageTypeKo, formatPrice, formatBulk, ITEMTYPE_KO, RARITY_KO };
  root.PF2eEquip = API;
  if (isNode && typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
