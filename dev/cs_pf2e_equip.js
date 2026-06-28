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
    if (isNode) { const fs = require('fs'); for (const p of ['data/overlay/_lang.ko.json', 'dev/data/overlay/_lang.ko.json']) { try { _lang = JSON.parse(fs.readFileSync(p, 'utf8')); break; } catch (e) {} } }
    _lang = _lang || { traits: {}, damageType: {}, weaponGroup: {}, armorGroup: {} };
    return _lang;
  }
  // 브라우저용 async 초기화
  async function init() { if (!isNode && !_lang) { try { const r = await fetch('data/overlay/_lang.ko.json'); _lang = await r.json(); } catch (e) { _lang = { traits: {}, damageType: {}, weaponGroup: {}, armorGroup: {} }; } } _loadLang(); }

  const RARITY_KO = { common: '일반', uncommon: '비범', rare: '희귀', unique: '고유' };
  const WCAT_KO = { simple: '단순', martial: '전투', advanced: '고급', unarmed: '비무장' };
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
  // 기존 WEAPON_DB/ARMOR_DB/SHIELD_DB/GEAR_DB와 동일 필드 → _data/_dbData로 그대로 사용.
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
        return Object.assign(base, { category: WCAT_LEGACY[s.category] || s.category || '단순', damage: _weaponDamageStr(s), hands: ((s.traits && s.traits.value) || []).some(t => t.startsWith('two-hand')) ? 2 : 1, range: (s.range && (s.range.increment || s.range.max)) || (typeof s.range === 'number' ? s.range : null), reload: (s.reload && s.reload.value) != null ? Number(s.reload.value) : null, group: (_loadLang().weaponGroup || {})[s.group] || s.group || '', traits: _traitsKo(s) });
      case 'armor':
        return Object.assign(base, { ac_bonus: s.acBonus || 0, dex_cap: s.dexCap != null ? s.dexCap : null, check_penalty: s.checkPenalty || 0, speed_penalty: s.speedPenalty || 0, strength: s.strength || 0, category: ACAT_LEGACY[s.category] || s.category || '', group: (_loadLang().armorGroup || {})[s.group] || s.group || '', traits: _traitsKo(s) });
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

  const API = { init, list, card, legacyList, toLegacy, typeCounts, trait, damageTypeKo, formatPrice, formatBulk, ITEMTYPE_KO, RARITY_KO };
  root.PF2eEquip = API;
  if (isNode && typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
