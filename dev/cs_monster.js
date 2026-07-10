// ═══════════════════════════════════════════════════════════════
//  cs_monster.js — MonsterDB ACCESS 레이어
//  BASE(pf2e 영문, 수치·구조) ⊕ OVERLAY(한글 텍스트) 조인 → 앱이 쓰는 형태로 노출.
//  설계: dev/PATHFORGE_REBASE_DESIGN.md (3-레이어 아키텍처의 ACCESS 층)
//  - 굴림/HP/토큰은 BASE 수치로, 표시는 KO 우선 + EN 병기.
//  - 앱(렌더/굴림)은 pf2e 원형 경로를 몰라도 됨 — 접근자가 어댑터.
// ═══════════════════════════════════════════════════════════════
(function (root) {
  'use strict';

  // ─── 데이터 로드 (브라우저: fetch / Node: fs), 다중팩 누적 ──────────
  const _base = [];                       // 누적 [{id,source,name,system,items}]
  const _byId = Object.create(null);      // id → creature
  const _koById = Object.create(null);    // id → 오버레이 (이름충돌 방지: id 고정)
  let _loaded = false;
  const DEFAULT_PACKS = ['monster-core', 'monster-core-2', 'npc-core',
    'bestiary', 'bestiary-2', 'bestiary-3', 'hazards', 'npc-gallery'];

  // 시스템 통합 용어 사전(PF2e-KR lang 기반): skill/sense/condition/ability/save/trait slug→한글.
  // tools/rebase/build_glossary.mjs 로 생성. 미로드 시 slug 폴백(graceful).
  let _gloss = { skill: {}, sense: {}, condition: {}, ability: {}, save: {}, trait: {}, attackEffect: {} };
  let _traitDesc = {};                     // PascalKey→한글 특성 설명(_trait_desc.ko.json). 칩 클릭 팝오버용.
  const RARITY_KO = { uncommon: '비범', rare: '희귀', unique: '고유', common: '일반' };
  function _g(cat, slug) { const m = _gloss[cat]; const v = m && m[slug]; return v != null ? v : slug; }
  // 특성 설명 조회: slug→PascalCase 키. 미스 시 값접미사를 한 단계씩 떼며 베이스 특성으로 폴백
  //   (reach-10→Reach, two-hand-d8→TwoHand, range-increment-20→RangeIncrement→Range).
  function _pascalTrait(s) { return String(s || '').split('-').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(''); }
  function _traitDescOf(slug) {
    let s = String(slug || '');
    while (s) {
      const d = _traitDesc[_pascalTrait(s)];
      if (d) return d;
      const i = s.lastIndexOf('-');
      if (i < 0) break;
      s = s.slice(0, i);
    }
    return '';
  }
  // 특성 칩 HTML(설명 있으면 클릭 가능 .info + data-trait). cls: 추가 클래스(예 'sm').
  function _traitChip(slug, cls) {
    const ko = _esc(_g('trait', slug));
    const klass = 'mon-trait' + (cls ? ' ' + cls : '');
    if (!_traitDescOf(slug)) return `<span class="${klass}">${ko}</span>`;
    return `<span class="${klass} info" data-trait="${_esc(slug)}" title="눌러서 설명 보기">${ko}</span>`;
  }

  // 크리처 토큰 아이콘: { [source]: { [baseId]: "<file>.webp" } }. tools/build_creature_icons.mjs 로 생성.
  // pf2e-tokens-{monster,npc}-core 모듈 토큰을 256px 벤더링(dev/data/creature-icons/). 미로드 시 아이콘 생략.
  let _iconMap = null, _ICON_BASE = 'data/creature-icons/';
  const _ICON_VER = 3;                             // 아이콘 재빌드 시 ++ (이미지 URL 동일·내용변경 캐시버스트)
  function creatureIcon(c) {                        // 토큰 파일명(상대경로) — 없으면 ''
    if (!c || !_iconMap) return '';
    const bucket = _iconMap[c.source];             // c.id 는 교차팩 충돌 시 'id--source'로 변형 → 원본 id 복원
    const file = bucket && bucket[String(c.id).split('--')[0]];
    return file ? _ICON_BASE + file + '?ic=' + _ICON_VER : '';
  }

  // 임베디드 아이템(타격/능력/주문) FVTT 아이콘: { [item._id]: "systems/pf2e/icons/..." 또는 "icons/..." }.
  // tools/rebase/extract_item_icons.mjs 로 추출 → dev/data/icons/ 아래 벤더링. 미로드 시 타입별 기본 아이콘.
  let _itemImg = null, _ITEM_ICON_BASE = 'data/icons/';
  let _iconLookup = null;                 // 플레이어 시트 icon_map.json(scope→slug/name→path) 재사용(장비/주문 보강)
  const _IIMG_VER = '0.184';
  // FVTT가 "고유 아트 없음"에 쓰는 제네릭(행동비용·기본) img — 깔끔한 타입별 SVG로 대체할 대상
  const _GENERIC_IMG = new Set([
    'systems/pf2e/icons/actions/Passive.webp','systems/pf2e/icons/actions/OneAction.webp',
    'systems/pf2e/icons/actions/TwoActions.webp','systems/pf2e/icons/actions/ThreeActions.webp',
    'systems/pf2e/icons/actions/Reaction.webp','systems/pf2e/icons/actions/FreeAction.webp',
    'systems/pf2e/icons/default-icons/action.svg','systems/pf2e/icons/default-icons/melee.svg',
    'systems/pf2e/icons/default-icons/spellcastingEntry.svg','systems/pf2e/icons/default-icons/lore.svg',
    'icons/svg/mystery-man.svg','systems/pf2e/icons/default-icons/npc.svg'
  ]);
  const _TYPE_DEFAULT = {
    melee: 'systems/pf2e/icons/default-icons/melee.svg',
    action: 'systems/pf2e/icons/default-icons/action.svg',
    spell: 'systems/pf2e/icons/default-icons/spell.svg'
  };
  // FVTT가 고유 아트를 안 주는 자연무기/능력에 의미 기반 테마 아이콘 부여(이름 키워드 매칭, 순서=우선순위)
  const _NAT_ICONS = [
    ['claw','icons/skills/melee/strike-blade-claw-red.webp'],['talon','icons/skills/melee/strike-blade-claw-red.webp'],
    ['jaw','icons/creatures/abilities/fangs-teeth-bite.webp'],['maw','icons/creatures/abilities/mouth-teeth-rows-red.webp'],
    ['fang','icons/creatures/abilities/fang-tooth-blood-red.webp'],['tooth','icons/creatures/abilities/fang-tooth-blood-red.webp'],
    ['teeth','icons/creatures/abilities/fang-tooth-blood-red.webp'],['bite','icons/creatures/abilities/fangs-teeth-bite.webp'],
    ['tail','icons/creatures/abilities/tail-swipe-green.webp'],['sting','icons/creatures/abilities/stinger-poison-green.webp'],
    ['wing','icons/creatures/abilities/wing-batlike-purple-blue.webp'],['beak','icons/creatures/abilities/mouth-teeth-sharp.webp'],
    ['horn','icons/creatures/abilities/bull-head-horns-glowing.webp'],['gore','icons/creatures/abilities/bull-head-horns-glowing.webp'],
    ['tusk','icons/creatures/abilities/bull-head-horns-glowing.webp'],['antler','icons/creatures/abilities/bull-head-horns-glowing.webp'],
    ['pincer','icons/creatures/claws/pincer-crab-brown.webp'],['mandible','icons/creatures/invertebrates/spider-mandibles-brown.webp'],
    ['tongue','icons/creatures/abilities/mouth-teeth-tongue-purple.webp'],
    ['tentacle','icons/creatures/tentacles/tentacles-eyes-poisoned-green.webp'],['tendril','icons/creatures/tentacles/tentacles-eyes-poisoned-green.webp'],
    ['trunk','icons/creatures/tentacles/tentacles-eyes-poisoned-green.webp'],['pseudopod','icons/creatures/tentacles/tentacles-eyes-poisoned-green.webp'],
    ['hoof','icons/creatures/abilities/paw-print-tan.webp'],['paw','icons/creatures/abilities/paw-print-tan.webp'],
    ['trample','icons/creatures/abilities/paw-print-tan.webp'],['foot','icons/creatures/abilities/paw-print-tan.webp'],
    ['leg','icons/creatures/abilities/paw-print-tan.webp'],
    ['fist','icons/skills/melee/unarmed-punch-fist-yellow-red.webp'],['punch','icons/skills/melee/unarmed-punch-fist-yellow-red.webp'],
    ['hand','icons/skills/melee/unarmed-punch-fist-yellow-red.webp'],['slam','icons/skills/melee/unarmed-punch-fist-yellow-red.webp'],
    // 무기류(자연무기 매칭 후순위) — 능력 이름에도 재사용
    ['scimitar','icons/skills/melee/strike-blade-blood-red.webp'],['sword','icons/skills/melee/strike-blade-blood-red.webp'],
    ['blade','icons/skills/melee/strike-blade-blood-red.webp'],['dagger','icons/skills/melee/strike-blade-blood-red.webp'],
    ['rapier','icons/skills/melee/strike-blade-blood-red.webp'],['glaive','icons/skills/melee/strike-blade-blood-red.webp'],
    ['axe','icons/skills/melee/strike-axe-red.webp'],['pick','icons/skills/melee/strike-axe-red.webp'],
    ['spear','icons/skills/melee/spear-tips-three-green.webp'],['lance','icons/skills/melee/spear-tips-three-green.webp'],
    ['pike','icons/skills/melee/spear-tips-three-green.webp'],['trident','icons/skills/melee/spear-tips-three-green.webp'],
    ['halberd','icons/skills/melee/spear-tips-three-green.webp'],['javelin','icons/skills/melee/spear-tips-three-green.webp'],
    ['hammer','icons/skills/melee/hand-grip-hammer-spiked-blue.webp'],['maul','icons/skills/melee/hand-grip-hammer-spiked-blue.webp'],
    ['mace','icons/weapons/maces/mace-flanged-steel-grey.webp'],['morningstar','icons/weapons/maces/mace-flanged-steel-grey.webp'],
    ['club','icons/skills/melee/strike-club-red.webp'],['cudgel','icons/skills/melee/strike-club-red.webp'],
    ['staff','icons/skills/melee/strike-club-red.webp'],['flail','icons/weapons/maces/mace-flanged-steel-grey.webp'],
    ['whip','icons/skills/melee/strike-chain-whip-blue.webp'],['chain','icons/skills/melee/strike-chain-whip-blue.webp'],
    ['lash','icons/skills/melee/strike-chain-whip-blue.webp'],
    ['rock','icons/weapons/thrown/throwing-rock.webp'],['stone','icons/weapons/thrown/throwing-rock.webp'],
    ['boulder','icons/weapons/thrown/throwing-rock.webp'],
    ['vine','icons/magic/nature/vines-thorned-entwined-glow-green.webp'],['branch','icons/magic/nature/vines-thorned-entwined-glow-green.webp'],
    ['root','icons/magic/nature/vines-thorned-entwined-glow-green.webp'],['thorn','icons/magic/nature/vines-thorned-entwined-glow-green.webp'],
    ['strike','icons/skills/melee/strike-blade-blood-red.webp']
  ];
  const _ABIL_ICONS = [
    ['breath','icons/creatures/abilities/dragon-breath-purple.webp'],
    ['frightful','icons/creatures/abilities/lion-roar-yellow.webp'],['fear','icons/creatures/abilities/lion-roar-yellow.webp'],
    ['terror','icons/creatures/abilities/lion-roar-yellow.webp'],['roar','icons/creatures/abilities/lion-roar-yellow.webp'],
    ['howl','icons/creatures/abilities/lion-roar-yellow.webp'],
    ['swallow','icons/creatures/abilities/mouth-teeth-rows-red.webp'],['engulf','icons/creatures/abilities/mouth-teeth-rows-red.webp'],
    ['grab','icons/skills/melee/unarmed-punch-fist-yellow-red.webp'],['constrict','icons/creatures/tentacles/tentacles-eyes-poisoned-green.webp'],
    ['regenerat','icons/magic/nature/root-vine-caduceus-healing.webp'],['fast healing','icons/magic/nature/root-vine-caduceus-healing.webp'],
    ['healing','icons/magic/nature/root-vine-caduceus-healing.webp'],
    ['gaze','icons/magic/perception/eye-tendrils-web-purple.webp'],['sight','icons/magic/perception/eye-tendrils-web-purple.webp'],
    ['vision','icons/magic/perception/eye-tendrils-web-purple.webp'],['darkvision','icons/magic/perception/eye-tendrils-web-purple.webp'],
    ['aura','icons/magic/control/silhouette-aura-energy.webp'],['emanation','icons/magic/control/silhouette-aura-energy.webp'],
    ['telepathy','icons/magic/control/silhouette-aura-energy.webp'],['mental','icons/magic/control/silhouette-aura-energy.webp'],
    ['psychic','icons/magic/control/silhouette-aura-energy.webp'],
    ['poison','icons/magic/death/skull-poison-green.webp'],['venom','icons/magic/death/skull-poison-green.webp'],
    ['lifesense','icons/magic/perception/eye-tendrils-web-purple.webp'],['scent','icons/magic/perception/eye-tendrils-web-purple.webp'],
    ['tremorsense','icons/magic/perception/eye-tendrils-web-purple.webp'],['sense','icons/magic/perception/eye-tendrils-web-purple.webp'],
    ['spell','systems/pf2e/icons/default-icons/spell.svg']
  ];
  function _kwIcon(map, name) { for (const [kw, p] of map) if (name.indexOf(kw) >= 0) return p; return null; }
  // 능력 테마 아이콘: 능력 키워드 → 자연무기/무기 키워드(능력 이름에 신체부위·무기 자주 등장)
  function _abilThemeIcon(nameEn) { return _kwIcon(_ABIL_ICONS, nameEn) || _kwIcon(_NAT_ICONS, nameEn); }
  function _imLook(scope, slug, nameEn) { const m = _iconLookup && _iconLookup[scope]; if (!m) return null; return m[slug] || m[nameEn] || null; }

  // 아이템 아이콘 URL: ① FVTT 고유 아트 ② 타입별 보강(장비/주문맵·자연무기/능력 키워드) ③ 타입 기본
  function itemIcon(obj, type) {
    const o = (obj && typeof obj === 'object') ? obj : { id: obj };
    const img = o.id && _itemImg && _itemImg[o.id];
    if (img && !_GENERIC_IMG.has(img)) return _ITEM_ICON_BASE + img + '?v=' + _IIMG_VER;  // 고유 아트
    const nameEn = ((o.name && o.name.en) || '').toLowerCase();
    const slug = o.slug || '';
    let use = null;
    if (type === 'spell') use = _imLook('spell', slug, nameEn);
    else if (type === 'melee') use = _imLook('equipment', slug, nameEn) || _kwIcon(_NAT_ICONS, nameEn);
    else if (type === 'action') use = _abilThemeIcon(nameEn);
    return _ITEM_ICON_BASE + (use || _TYPE_DEFAULT[type] || _TYPE_DEFAULT.action) + '?v=' + _IIMG_VER;
  }

  async function load(opts) {
    opts = opts || {};
    const dir = opts.dir || 'data/creatures/';
    const packs = opts.packs || DEFAULT_PACKS;
    const useFetch = typeof window !== 'undefined' && typeof fetch === 'function';
    for (const p of packs) {
      let base, ko;
      try {
        if (useFetch) {
          base = await fetch(`${dir}${p}.base.json`).then(r => r.ok ? r.json() : null);
          if (!base) { console.warn(`[MonsterDB] BASE 없음 스킵: ${p}`); continue; }
          ko = await fetch(`${dir}${p}.ko.json`).then(r => r.ok ? r.json() : null).catch(() => null) || {};
        } else {
          const fs = require('fs');
          base = JSON.parse(fs.readFileSync(`${dir}${p}.base.json`, 'utf8'));
          try { ko = JSON.parse(fs.readFileSync(`${dir}${p}.ko.json`, 'utf8')); } catch (e) { ko = {}; }
        }
        _ingest(base, ko);
      } catch (e) { console.warn(`[MonsterDB] 팩 로드 실패 스킵: ${p} — ${e && e.message}`); }
    }
    // 시스템 용어 사전 1회 로드(실패해도 slug 폴백)
    try {
      let gl = null;
      if (useFetch) gl = await fetch(`${dir}_glossary.ko.json`).then(r => r.ok ? r.json() : null).catch(() => null);
      else { try { gl = JSON.parse(require('fs').readFileSync(`${dir}_glossary.ko.json`, 'utf8')); } catch (e) {} }
      if (gl) for (const k in _gloss) if (gl[k]) _gloss[k] = gl[k];
    } catch (e) { console.warn('[MonsterDB] 글로서리 로드 실패:', e && e.message); }
    // 특성 설명 사전 1회 로드(실패해도 칩은 비클릭으로 graceful)
    try {
      let td = null;
      if (useFetch) td = await fetch(`${dir}_trait_desc.ko.json?v=${_IIMG_VER}`).then(r => r.ok ? r.json() : null).catch(() => null);
      else { try { td = JSON.parse(require('fs').readFileSync(`${dir}_trait_desc.ko.json`, 'utf8')); } catch (e) {} }
      if (td) _traitDesc = td;
    } catch (e) { console.warn('[MonsterDB] 특성 설명 로드 실패:', e && e.message); }
    // 크리처 토큰 아이콘 맵 1회 로드(실패해도 아이콘만 생략)
    try {
      const base = dir.replace(/creatures\/?$/, '');          // 'data/creatures/' → 'data/'
      _ICON_BASE = base + 'creature-icons/';
      if (useFetch) _iconMap = await fetch(`${base}creature_icon_map.json`).then(r => r.ok ? r.json() : null).catch(() => null);
      else { try { _iconMap = JSON.parse(require('fs').readFileSync(`${base}creature_icon_map.json`, 'utf8')); } catch (e) {} }
    } catch (e) { console.warn('[MonsterDB] 아이콘 맵 로드 실패:', e && e.message); }
    // 임베디드 아이템 FVTT 아이콘 사이드카(_id→img) 1회 로드(실패해도 타입별 기본 폴백)
    try {
      const base = dir.replace(/creatures\/?$/, '');
      _ITEM_ICON_BASE = base + 'icons/';
      if (useFetch) _itemImg = await fetch(`${dir}_item_icons.json?v=${_IIMG_VER}`).then(r => r.ok ? r.json() : null).catch(() => null);
      else { try { _itemImg = JSON.parse(require('fs').readFileSync(`${dir}_item_icons.json`, 'utf8')); } catch (e) {} }
      // 장비/주문 보강용 icon_map(플레이어 시트 공용)
      const ibase = dir.replace(/creatures\/?$/, '');
      if (useFetch) _iconLookup = await fetch(`${ibase}icon_map.json?v=${_IIMG_VER}`).then(r => r.ok ? r.json() : null).catch(() => null);
      else { try { _iconLookup = JSON.parse(require('fs').readFileSync(`${ibase}icon_map.json`, 'utf8')); } catch (e) {} }
    } catch (e) { console.warn('[MonsterDB] 아이템 아이콘 로드 실패:', e && e.message); }
    return _loaded;
  }
  function ingest(baseArr, koObj) { _ingest(baseArr, koObj); return _loaded; } // 직접 주입(테스트/번들)
  function _ingest(baseArr, koObj) {
    for (const c of (baseArr || [])) {
      let id = c.id;
      if (_byId[id]) id = `${id}--${(c.source || 'x').replace(/^pathfinder-/, '')}`; // 교차팩 충돌
      c.id = id;
      _byId[id] = c; _base.push(c);
      _koById[id] = (koObj && koObj[c.name]) || null;   // 이름→오버레이를 id에 고정
    }
    _loaded = true;
  }

  // ─── 헬퍼 ──────────────────────────────────────────────────────
  const _koOf = c => _koById[c.id] || null;                        // 생물 오버레이 (id 기준)
  const _koItem = (ent, slug) => (ent && ent.items && ent.items[slug]) || null;
  const _txt = (ko, en) => (ko && ko.trim()) ? ko : (en || '');   // KO 우선
  const SIZE_KO = { tiny: '초소형', sm: '소형', med: '중형', lg: '대형', huge: '거대형', grg: '초대형' };
  const SAVE_KO = { fortitude: '인내', reflex: '반사', will: '의지' };
  const ABIL_KO = { str: '근력', dex: '민첩', con: '건강', int: '지능', wis: '지혜', cha: '매력' };

  // ─── 조회 ──────────────────────────────────────────────────────
  function getCreature(id) { return _byId[id] || null; }
  function all() { return _base || []; }
  function search(q) {
    q = (q || '').toLowerCase();
    return (_base || []).filter(c => {
      const ent = _koOf(c);
      return c.name.toLowerCase().includes(q) || (ent && ent.name && ent.name.includes(q)) || c.id.includes(q);
    });
  }

  // ─── 머리(헤더) 접근자 ─────────────────────────────────────────
  function name(c) { const e = _koOf(c); return { ko: (e && e.name) || c.name, en: c.name }; }
  function level(c) { return c.system?.details?.level?.value ?? 0; }
  function traits(c) {
    const t = c.system?.traits || {};
    return { rarity: t.rarity || 'common', size: t.size?.value || 'med',
             sizeKo: SIZE_KO[t.size?.value] || '', value: t.value || [] };
  }
  function abilities(c) {
    const a = c.system?.abilities || {};
    return ['str', 'dex', 'con', 'int', 'wis', 'cha'].map(k => ({
      key: k, ko: ABIL_KO[k], mod: a[k]?.mod ?? 0
    }));
  }
  function ac(c) { return c.system?.attributes?.ac?.value ?? 10; }
  function hp(c) {
    const h = c.system?.attributes?.hp || {};
    const e = _koOf(c);
    return { value: h.value ?? h.max ?? 0, max: h.max ?? 0, details: _txt(e?.hpdetails, h.details) };
  }
  function perception(c) {
    const p = c.system?.perception || {}; const e = _koOf(c);
    return { mod: p.mod ?? 0, senses: (p.senses || []).map(s => s.type), details: _txt(e?.perception, p.details) };
  }
  function saves(c) {
    const s = c.system?.saves || {};
    return ['fortitude', 'reflex', 'will'].map(k => ({ key: k, ko: SAVE_KO[k], mod: s[k]?.value ?? 0 }));
  }
  function speeds(c) {
    const sp = c.system?.attributes?.speed || {};
    const out = [{ type: 'land', value: sp.value ?? 0 }];
    for (const o of (sp.otherSpeeds || [])) out.push({ type: o.type, value: o.value });
    return out;
  }
  function skills(c) {
    const sk = c.system?.skills || {};
    return Object.entries(sk).map(([k, v]) => ({ key: k, mod: v.base ?? 0 }));
  }

  // ─── 임베디드(타격/능력/주문) 접근자 ──────────────────────────
  function _items(c, type) { return (c.items || []).filter(i => i.type === type); }

  // 타격(melee=근/원 공용) → 굴림 카드용
  function strikes(c) {
    const e = _koOf(c);
    return _items(c, 'melee').map(it => {
      const s = it.system || {};
      const damage = Object.values(s.damageRolls || {}).map(d => ({ formula: d.damage, type: d.damageType }));
      const ko = _koItem(e, it.slug);
      return {
        id: it._id, slug: it.slug,
        name: { ko: (ko && ko.name) || it.name, en: it.name },
        bonus: s.bonus?.value ?? 0,
        damage,                                   // [{formula:'1d6', type:'piercing'}]
        range: s.range?.increment || null,        // 원거리만
        reload: s.reload?.value || null,
        traits: s.traits?.value || [],
        effects: s.attackEffects?.value || []     // 라이더(조건/행동 slug)
      };
    });
  }

  // 능력(action) → 카드용
  function abilitiesList(c) {
    const e = _koOf(c);
    return _items(c, 'action').map(it => {
      const s = it.system || {}; const ko = _koItem(e, it.slug);
      return {
        id: it._id, slug: it.slug,
        name: { ko: (ko && ko.name) || it.name, en: it.name },
        actionType: s.actionType?.value || 'passive',  // passive/reaction/free/action
        actions: s.actions?.value ?? null,             // 1/2/3
        traits: s.traits?.value || [],
        desc: { ko: _txt(ko && ko.description, s.description?.value), en: s.description?.value || '' }
      };
    });
  }

  // 시전(spellcastingEntry + 소속 spell) → 블록 묶음
  function spellcasting(c) {
    const e = _koOf(c);
    const entries = _items(c, 'spellcastingEntry').map(en => {
      const s = en.system || {}; const ko = _koItem(e, en.slug);
      return {
        id: en._id, slug: en.slug,
        name: { ko: (ko && ko.name) || en.name, en: en.name },
        tradition: s.tradition?.value || '',
        prepType: s.prepared?.value || '',
        dc: s.spelldc?.dc ?? null,
        attack: s.spelldc?.value ?? null,
        spells: []
      };
    });
    const byEntry = Object.create(null);
    for (const e2 of entries) byEntry[e2.id] = e2;
    for (const it of _items(c, 'spell')) {
      const s = it.system || {}; const loc = s.location?.value;
      const target = byEntry[loc] || entries[0];
      if (!target) continue;
      const ko = _koItem(e, it.slug);
      target.spells.push({
        id: it._id, slug: it.slug,
        name: { ko: (ko && ko.name) || it.name, en: it.name },
        rank: s.level?.value ?? 0
      });
    }
    return entries;
  }

  // 전체 머지 뷰 (디버그/직렬화용)
  function view(id) {
    const c = getCreature(id); if (!c) return null;
    return {
      id: c.id, name: name(c), level: level(c), traits: traits(c),
      abilities: abilities(c), ac: ac(c), hp: hp(c), perception: perception(c),
      saves: saves(c), speeds: speeds(c), skills: skills(c),
      strikes: strikes(c), abilitiesList: abilitiesList(c), spellcasting: spellcasting(c)
    };
  }

  // ─── @참조(Foundry inline) → 한글 렌더 ─────────────────────────
  const DMG_KO = { piercing:'관통', slashing:'참격', bludgeoning:'타격', fire:'화염', cold:'냉기', acid:'산성', electricity:'전기', sonic:'음파', mental:'정신', poison:'독', void:'공허', spirit:'영혼', vitality:'활력', force:'역장', bleed:'출혈', untyped:'', precision:'정밀' };
  const SAVE_KO2 = { fortitude:'인내', reflex:'반사', will:'의지' };
  function _esc(s){ return String(s==null?'':s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  function resolveFoundryRefs(html){
    if(!html) return '';
    let s = String(html);
    // FVTT 전용 '효과 부여'·저널 링크·@Embed 문단 제거(패스포지에 해당 기능 없음 → 죽은 텍스트)
    s = s.replace(/(<hr\s*\/?>\s*)?<p>(?:\s*@UUID\[Compendium\.pf2e\.(?:[a-z-]*-effects\.Item|journals\.JournalEntry)[^\]]*\](?:\{[^}]*\})?\s*[,;·]?)+\s*<\/p>\s*/g, '');
    s = s.replace(/(<hr\s*\/?>\s*)?<p>\s*@Embed\[[^\]]+\](?:\{[^}]*\})?\s*<\/p>\s*/g, '');
    // 인라인 굴림 매크로 [[/gmr 1d4 #hours]]{라벨} → 라벨, 없으면 주사위식([type]→한글 피해유형)
    s = s.replace(/\[\[((?:[^\[\]]|\[[^\]]*\])*)\]\](?:\{([^}]*)\})?/g, (m,body,label)=>{
      if(label) return `<span class="ref-roll">${_esc(label)}</span>`;
      let dice = body.replace(/^\s*\/[a-z]+\s*/i,'').replace(/#[^\s\]]*/g,'').replace(/\{([^}]*)\}/g,'$1');
      dice = dice.replace(/\[([a-z, -]+)\]/g, (mm,tys)=>' '+tys.split(',').map(t=>DMG_KO[t.trim()]!==undefined?DMG_KO[t.trim()]:t.trim()).filter(Boolean).join(' '));
      dice = dice.replace(/\s+/g,' ').trim();
      return `<span class="ref-roll">${_esc(dice||body)}</span>`;
    });
    s = s.replace(/@Damage\[((?:[^\[\]]|\[[^\]]*\])*)\](\{[^}]*\})?/g, (m,body)=>{
      const parts=body.split(/,(?![^\[]*\])/).map(p=>{ const mm=p.match(/\(?\s*([0-9dD()+\-* ]+?)\s*\)?\s*\[([^\]]+)\]/);
        if(!mm) return p.replace(/[\[\]]/g,' ').trim();
        const types=mm[2].split(',').map(t=>t.trim()); const persistent=types.includes('persistent');
        const dts=types.filter(t=>t!=='persistent').map(t=>DMG_KO[t]!==undefined?DMG_KO[t]:t).filter(Boolean);
        return `${mm[1].trim()} ${persistent?'지속 ':''}${dts.join(' ')}`.replace(/\s+/g,' ').trim(); });
      return `<span class="ref-dmg">${parts.join(' + ')}</span>`; });
    s = s.replace(/@Check\[([^\]]+)\](\{[^}]*\})?/g, (m,body)=>{ const type=Object.keys(SAVE_KO2).find(k=>new RegExp('\\b'+k+'\\b').test(body))||''; const dc=(body.match(/dc:(\d+)/)||[])[1]; const basic=/basic/.test(body)?'기본 ':''; return `<span class="ref-check">${dc?`DC ${dc} `:''}${basic}${SAVE_KO2[type]||type}</span>`; });
    s = s.replace(/@UUID\[([^\]]+)\](?:\{([^}]*)\})?/g, (m,uuid,label)=>{
      if(!label) return '';
      if(/conditionitems/.test(uuid)){ const c=_gloss.condition[label.toLowerCase().replace(/\s+/g,'-')]; if(c) label=c; }  // 상태이상 @UUID 라벨 한글화
      return `<span class="ref-link">${_esc(label)}</span>`;
    });
    s = s.replace(/@Template\[([^\]]+)\](\{[^}]*\})?/g, (m,body)=>{ const d=(body.match(/distance:(\d+)/)||[])[1]; const SH={emanation:'발산',burst:'폭발',cone:'원뿔',line:'직선'}; const ty=(body.match(/type:(\w+)/)||[])[1]; return `<span class="ref-area">${d||''}피트 ${SH[ty]||ty||''}</span>`; });
    s = s.replace(/@Localize\[[^\]]+\]/g,'');
    s = s.replace(/@[A-Za-z]+\[[^\]]*\](?:\{([^}]*)\})?/g, (m,l)=> l||'');
    return s;
  }
  // 행동비용 글리프 (Pathfinder2eActions 폰트: 1/2/3=행동, F=자유, R=반응)
  function _glyph(a){ const x=String(a==null?'':a); return ({reaction:'R',free:'F','1':'1','2':'2','3':'3'})[x]||''; }
  function _actGlyph(ab){
    const ch=_glyph(ab.actions!=null?ab.actions:ab.actionType);
    return ch?`<span class="action-glyph">${ch}</span>`:'';
  }
  // 면역/저항/약점 enum 한글화 (피해형 → 상태이상 → 특성 → slug)
  function _resName(slug){
    if(DMG_KO[slug]!==undefined && DMG_KO[slug]) return DMG_KO[slug];
    if(_gloss.condition[slug]) return _gloss.condition[slug];
    return _g('trait',slug);
  }

  // ─── 스탯블록 HTML 렌더 (FVTT 양피지 카드 스타일) ───────────────
  function renderStatBlock(id){
    const c = getCreature(id); if(!c) return '<div class="mon-empty">생물을 찾을 수 없습니다.</div>';
    const v = view(id), sys = c.system||{}, e=_koOf(c);
    const imm=(sys.attributes?.immunities||[]).map(x=>_resName(x.type));
    const res=(sys.attributes?.resistances||[]).map(x=>`${_resName(x.type)}${x.value!=null?' '+x.value:''}`);
    const wk=(sys.attributes?.weaknesses||[]).map(x=>`${_resName(x.type)}${x.value!=null?' '+x.value:''}`);
    const SPK={land:'',fly:'비행 ',swim:'수영 ',climb:'등반 ',burrow:'굴파기 '};
    const sign=n=>`${n>=0?'+':''}${n}`;
    const _ico = creatureIcon(c);

    let h='<div class="mon">';
    // ── 헤더 (FVTT 붉은 배너) ──
    h+=`<div class="mon-head">`;
    h+= _ico?`<img class="mon-portrait" src="${_ico}" alt="" loading="lazy">`:`<div class="mon-portrait mon-portrait-ph">🐉</div>`;
    h+=`<div class="mon-titles"><div class="mon-name">${_esc(v.name.ko)}</div><div class="mon-en">${_esc(v.name.en)}</div></div>`;
    h+=`<div class="mon-lv"><span>생물</span><b>${v.level}</b></div>`;
    h+=`</div>`;

    h+=`<div class="mon-body">`;
    // ── 특성 칩 ──
    const traitChips=[];
    if(v.traits.rarity!=='common') traitChips.push(`<span class="mon-trait rar-${v.traits.rarity}">${_esc(RARITY_KO[v.traits.rarity]||v.traits.rarity)}</span>`);
    if(v.traits.sizeKo) traitChips.push(`<span class="mon-trait">${_esc(v.traits.sizeKo)}</span>`);
    v.traits.value.forEach(t=>traitChips.push(_traitChip(t)));
    if(traitChips.length) h+=`<div class="mon-traits">${traitChips.join('')}</div>`;

    // ── 방어 타일 (AC/HP/내성/지각) ──
    h+=`<div class="mon-def">`;
    h+=`<div class="mon-stat mon-ac"><div class="mon-stat-lbl">AC</div><div class="mon-stat-val">${v.ac}</div></div>`;
    h+=`<div class="mon-stat mon-hp"><div class="mon-stat-lbl">HP</div><div class="mon-stat-val">${v.hp.value}</div></div>`;
    v.saves.forEach(s=>{ h+=`<div class="mon-stat roll" data-roll="save" data-key="${s.key}" data-mod="${s.mod}" data-label="${s.ko} 내성"><div class="mon-stat-lbl">${s.ko}</div><div class="mon-stat-val">${sign(s.mod)}</div></div>`; });
    h+=`<div class="mon-stat roll" data-roll="perception" data-mod="${v.perception.mod}" data-label="지각"><div class="mon-stat-lbl">지각</div><div class="mon-stat-val">${sign(v.perception.mod)}</div></div>`;
    h+=`</div>`;

    // ── 능력치 타일 ──
    h+=`<div class="mon-abils">${v.abilities.map(a=>`<div class="mon-abil"><div class="mon-abil-k">${a.ko}</div><div class="mon-abil-v">${sign(a.mod)}</div></div>`).join('')}</div>`;

    // ── 부가 정보 라인 (이동/감각/언어/면역·저항·약점) ──
    const senses=v.perception.senses.map(s=>_g('sense',s));
    h+=`<div class="mon-lines">`;
    h+=`<div class="mon-line"><b>이동</b> ${v.speeds.map(s=>`${SPK[s.type]!==undefined?SPK[s.type]:s.type+' '}${s.value}피트`).join(', ')}</div>`;
    const senseTxt=[senses.map(_esc).join(', '), v.perception.details?_esc(v.perception.details):''].filter(Boolean).join('; ');
    if(senseTxt) h+=`<div class="mon-line"><b>감각</b> ${senseTxt}</div>`;
    if(e&&e.languages) h+=`<div class="mon-line"><b>언어</b> ${_esc(e.languages)}</div>`;
    const dw=[];
    if(imm.length) dw.push(`<b>면역</b> ${imm.map(_esc).join(', ')}`);
    if(res.length) dw.push(`<b>저항</b> ${res.map(_esc).join(', ')}`);
    if(wk.length) dw.push(`<b>약점</b> ${wk.map(_esc).join(', ')}`);
    if(dw.length) h+=`<div class="mon-line">${dw.join('; ')}</div>`;
    if(v.hp.details) h+=`<div class="mon-line"><b>HP 비고</b> ${_esc(v.hp.details)}</div>`;
    h+=`</div>`;

    // ── 기술 칩 (클릭 굴림) ──
    if(v.skills.length) h+=`<div class="mon-skills">${v.skills.map(s=>{const ko=_g('skill',s.key);return `<span class="mon-skill roll" data-roll="skill" data-key="${s.key}" data-mod="${s.mod}" data-label="${_esc(ko)}">${_esc(ko)} <b>${sign(s.mod)}</b></span>`;}).join('')}</div>`;

    // 라이더 효과 한글화 준비
    const _abMap={}; (v.abilitiesList||[]).forEach(a=>{ if(a.slug) _abMap[a.slug]=a.name.ko; });
    const _effKo=s=> _abMap[s] || _gloss.attackEffect[s] || _gloss.condition[s] || _g('trait',s);

    // ── 공격(타격) 카드 ──
    if(v.strikes.length){
      h+=`<div class="mon-sec"><div class="mon-sec-hd">공격</div>`;
      for(const st of v.strikes){
        const dmg=st.damage.map(d=>`${d.formula} ${DMG_KO[d.type]!==undefined&&DMG_KO[d.type]?DMG_KO[d.type]:d.type}`).join(' + ');
        const eff=(st.effects||[]).map(s=>_esc(_effKo(s)));
        const lbl=_esc(st.name.ko);
        h+=`<div class="mon-strike">`;
        h+=`<div class="mon-strike-hd"><img class="mon-ico" src="${itemIcon(st,'melee')}" alt="" loading="lazy"><span class="mon-strike-type">${st.range?'원거리':'근접'}</span><span class="mon-strike-name roll" data-roll="attack" data-mod="${st.bonus}" data-label="${lbl}">${lbl}</span><span class="mon-strike-atk roll" data-roll="attack" data-mod="${st.bonus}" data-label="${lbl}">${sign(st.bonus)}</span></div>`;
        h+=`<div class="mon-strike-bd"><span class="mon-strike-dmg roll" data-roll="damage" data-formula="${_esc(st.damage.map(d=>d.formula).join('+'))}" data-label="${lbl}">${dmg||'—'}</span>`;
        if(st.range) h+=`<span class="mon-strike-rng">사거리 ${st.range}피트${st.reload!=null?` · 재장전 ${st.reload}`:''}</span>`;
        h+=`</div>`;
        if(st.traits.length||eff.length){
          h+=`<div class="mon-strike-tr">${st.traits.map(t=>_traitChip(t,'sm')).join('')}${eff.length?`<span class="mon-plus">＋ ${eff.join(', ')}</span>`:''}</div>`;
        }
        h+=`</div>`;
      }
      h+=`</div>`;
    }

    // ── 시전(주문) 섹션 ──
    for(const sc of v.spellcasting){
      h+=`<div class="mon-sec"><div class="mon-sec-hd">${_esc(sc.name.ko)}${sc.dc!=null?`<span class="mon-sc-dc">DC ${sc.dc}</span>`:''}${sc.attack!=null?`<span class="mon-sc-dc">명중 ${sign(sc.attack)}</span>`:''}</div>`;
      const byRank={};
      sc.spells.forEach(sp=>{ (byRank[sp.rank]=byRank[sp.rank]||[]).push(sp); });
      Object.keys(byRank).map(Number).sort((a,b)=>b-a).forEach(r=>{
        h+=`<div class="mon-spell-row"><span class="mon-spell-rank">${r===0?'캔트립':r+'레벨'}</span><span class="mon-spell-list">${byRank[r].map(sp=>`<span class="mon-spell"><img class="mon-ico mon-ico-sm" src="${itemIcon(sp,'spell')}" alt="" loading="lazy">${_esc(sp.name.ko)}</span>`).join('')}</span></div>`;
      });
      h+=`</div>`;
    }

    // ── 능력(행동) 카드 (설명 있으면 펼침 아코디언) ──
    if(v.abilitiesList.length){
      h+=`<div class="mon-sec"><div class="mon-sec-hd">능력</div>`;
      for(const ab of v.abilitiesList){
        // 아이콘: 테마 매칭되면 이미지, 아니면 깔끔한 행동비용 글리프 배지(밋밋한 기본 대신)
        const themed=_abilThemeIcon((ab.name.en||'').toLowerCase());
        const ch=_glyph(ab.actions!=null?ab.actions:ab.actionType);
        const ico = themed
          ? `<img class="mon-ico" src="${_ITEM_ICON_BASE+themed}?v=${_IIMG_VER}" alt="" loading="lazy">`
          : (ch ? `<span class="mon-ico mon-ico-glyph action-glyph">${ch}</span>`
                : `<img class="mon-ico" src="${itemIcon(ab,'action')}" alt="" loading="lazy">`);
        const g = themed ? _actGlyph(ab) : '';   // 테마 이미지일 때만 행동경제 글리프 별도 표기(배지면 중복 생략)
        const trs=(ab.traits||[]).map(t=>_traitChip(t,'sm')).join('');
        const desc=ab.desc.ko?resolveFoundryRefs(ab.desc.ko):'';
        if(desc){
          h+=`<details class="mon-ab"><summary class="mon-ab-hd">${ico}${g}<span class="mon-ab-name">${_esc(ab.name.ko)}</span>${trs}<span class="mon-ab-caret">▾</span></summary><div class="mon-ab-bd">${desc}</div></details>`;
        } else {
          h+=`<div class="mon-ab no-desc"><div class="mon-ab-hd">${ico}${g}<span class="mon-ab-name">${_esc(ab.name.ko)}</span>${trs}</div></div>`;
        }
      }
      h+=`</div>`;
    }

    return h+'</div></div>';
  }

  // ─── 굴림 배선: 스탯블록 .roll 클릭 → DiceRoller (이벤트 위임 → 재렌더 안전) ──
  function bindRolls(rootEl, opts) {
    if (!rootEl || rootEl._mdbBound) return;          // 같은 컨테이너 중복 바인드 방지
    rootEl._mdbBound = true; opts = opts || {};
    // DiceRoller는 cs_dice.js의 top-level const → window엔 안 붙음(전역 렉시컬). 클릭 시점에 지연 해소.
    function _roller() {
      return opts.roller
        || (typeof DiceRoller !== 'undefined' ? DiceRoller : null)
        || (root && root.DiceRoller) || null;
    }
    rootEl.addEventListener('click', function (ev) {
      // 특성 칩 클릭 → 설명 팝오버 (굴림보다 먼저; <summary> 내부면 아코디언 토글 차단)
      const tr = ev.target.closest && ev.target.closest('.mon-trait.info');
      if (tr && rootEl.contains(tr)) {
        ev.preventDefault(); ev.stopPropagation();
        _showTraitPopover(tr);
        return;
      }
      const el = ev.target.closest && ev.target.closest('.roll');
      if (!el || !rootEl.contains(el)) return;
      const DR = _roller(); if (!DR) return;
      const kind = el.getAttribute('data-roll');
      const label = el.getAttribute('data-label') || '';
      if (kind === 'damage') {
        const f = el.getAttribute('data-formula') || '';
        if (DR.rollFormula) DR.rollFormula(f, label + ' 피해');
        else if (DR.rollDamage) DR.rollDamage(f, label + ' 피해');
      } else {
        const mod = parseInt(el.getAttribute('data-mod') || '0', 10) || 0;
        if (DR.rollCheck) DR.rollCheck(mod, label);          // d20 + 보정
      }
    });
  }

  // ─── 특성 설명 팝오버 (호스트 독립, body 부착 싱글톤) ──────────────
  let _traitPop = null, _traitPopFor = null, _traitPopOff = null;
  function _closeTraitPop() {
    if (_traitPopOff) { _traitPopOff(); _traitPopOff = null; }
    if (_traitPop) { _traitPop.remove(); _traitPop = null; _traitPopFor = null; }
  }
  function _showTraitPopover(chipEl) {
    if (typeof document === 'undefined') return;
    if (_traitPop && _traitPopFor === chipEl) { _closeTraitPop(); return; } // 같은 칩 재클릭 = 닫기(토글)
    _closeTraitPop();
    const slug = chipEl.getAttribute('data-trait');
    const ko = _g('trait', slug);
    const desc = resolveFoundryRefs(_traitDescOf(slug) || '');
    const pop = document.createElement('div');
    pop.className = 'mon-trait-pop';
    pop.innerHTML = `<div class="mon-trait-pop-hd">${_esc(ko)}</div><div class="mon-trait-pop-bd">${desc || '설명이 없습니다.'}</div>`;
    document.body.appendChild(pop);
    _traitPop = pop; _traitPopFor = chipEl;
    // 위치: 칩 아래(공간 부족 시 위), 가로는 뷰포트 내 클램프
    const r = chipEl.getBoundingClientRect();
    const sx = window.scrollX || window.pageXOffset || 0;
    const sy = window.scrollY || window.pageYOffset || 0;
    const pw = pop.offsetWidth, ph = pop.offsetHeight, vw = window.innerWidth;
    let left = r.left + sx;
    if (left + pw > sx + vw - 8) left = sx + vw - pw - 8;
    if (left < sx + 8) left = sx + 8;
    let top = r.bottom + sy + 6;
    if (r.bottom + ph + 6 > window.innerHeight && r.top - ph - 6 > 0) top = r.top + sy - ph - 6; // 위로 뒤집기
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
    // 바깥 클릭/ESC/스크롤 시 닫기 (캡처 단계). _traitPopOff로 일괄 해제 → 누수 없음.
    const onDoc = (e) => { if (_traitPop && !_traitPop.contains(e.target) && e.target !== chipEl) _closeTraitPop(); };
    const onKey = (e) => { if (e.key === 'Escape') _closeTraitPop(); };
    _traitPopOff = () => {
      document.removeEventListener('mousedown', onDoc, true);
      document.removeEventListener('touchstart', onDoc, true);
      document.removeEventListener('keydown', onKey, true);
      window.removeEventListener('scroll', _closeTraitPop, true);
    };
    setTimeout(() => {
      if (!_traitPop) return;                       // 그 사이 닫혔으면 등록 생략
      document.addEventListener('mousedown', onDoc, true);
      document.addEventListener('touchstart', onDoc, true);
      document.addEventListener('keydown', onKey, true);
      window.addEventListener('scroll', _closeTraitPop, true);
    }, 0);
  }

  // ─── 스탯블록 스타일 (호스트 독립 — FVTT 양피지 카드, 어느 페이지에 박아도 동일) ──────
  const STYLES = `
@font-face{font-family:"Pathfinder2eActions";src:url("fonts/pathfinder-2e-actions.woff2") format("woff2");font-display:swap;}
@font-face{font-family:"EczarMon";font-weight:700;font-display:swap;src:url("fonts/eczar-v16-latin-ext_latin-700.woff2") format("woff2");}
.mon{
  --m-bg:#ece1c7;--m-bg2:#e4d6b5;--m-bg3:#d9c8a2;--m-bg4:#ccb78c;
  --m-text:#2b2117;--m-text2:#574021;--m-border:#bfa572;--m-border2:#a3884e;
  --m-accent:#6e1414;--m-accent2:#8f2b2b;--m-gold:#8a6a1f;
  font-family:-apple-system,'Segoe UI',Roboto,'Apple SD Gothic Neo','Noto Sans KR',sans-serif;
  font-size:13px;line-height:1.55;color:var(--m-text);
  background:#ece1c7 url("data/fvtt-assets/sheet/parchment.webp") repeat;
  border:1px solid var(--m-border2);border-radius:10px;overflow:hidden;
  box-shadow:0 2px 12px rgba(60,40,15,.2);
}
.mon-head{display:flex;align-items:center;gap:10px;padding:10px 14px;background:#5e0000 url("data/fvtt-assets/sheet/red_bg.webp") repeat;border-bottom:2px solid var(--m-gold);color:#f3e2c2;}
.mon-portrait{width:52px;height:52px;border-radius:8px;object-fit:cover;flex:0 0 auto;border:2px solid var(--m-gold);background:#2b1a1a;}
.mon-portrait-ph{display:flex;align-items:center;justify-content:center;font-size:26px;}
.mon-titles{min-width:0;flex:1;}
.mon-name{font-size:19px;font-weight:800;color:#f7e8c8;line-height:1.15;}
.mon-en{font-size:11px;color:#d8b48a;font-style:italic;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.mon-lv{display:flex;flex-direction:column;align-items:center;background:rgba(0,0,0,.28);border:1px solid var(--m-gold);border-radius:8px;padding:3px 11px;flex:0 0 auto;}
.mon-lv span{font-size:8px;letter-spacing:.5px;opacity:.85;}
.mon-lv b{font-size:18px;line-height:1;color:#fff;}
.mon-body{padding:12px 14px;}
.mon-traits{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:11px;}
.mon-trait{font-size:10px;font-weight:700;letter-spacing:.3px;color:#f3e2c2;background:var(--m-accent);border:1px solid var(--m-accent2);padding:2px 7px;border-radius:3px;}
.mon-trait.sm{font-size:9px;padding:1px 5px;letter-spacing:0;}
.mon-trait.rar-uncommon{background:#9c5a12;border-color:#b06d1d;}
.mon-trait.rar-rare{background:#1f4d7a;border-color:#2c6396;}
.mon-trait.rar-unique{background:#5b2d7a;border-color:#774099;}
.mon-trait.info{cursor:pointer;border-bottom-style:dotted;border-bottom-width:2px;}
.mon-trait.info:hover{filter:brightness(1.12);}
.mon-trait.info:active{filter:brightness(.92);}
.mon-trait-pop{position:absolute;z-index:99999;max-width:300px;font-family:-apple-system,'Segoe UI',Roboto,'Apple SD Gothic Neo','Noto Sans KR',sans-serif;background:#ece1c7 url("data/fvtt-assets/sheet/parchment.webp") repeat;color:#2b2117;border:1px solid #a3884e;border-radius:8px;box-shadow:0 4px 18px rgba(40,25,8,.38);overflow:hidden;animation:monTraitPop .1s ease-out;}
@keyframes monTraitPop{from{opacity:0;transform:translateY(-3px);}to{opacity:1;transform:none;}}
.mon-trait-pop-hd{font-size:12px;font-weight:800;letter-spacing:.3px;color:#f3e2c2;background:#6e1414;padding:5px 11px;border-bottom:1px solid #8a6a1f;}
.mon-trait-pop-bd{font-size:12px;line-height:1.55;padding:8px 11px;}
.mon-def{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:9px;}
.mon-stat{flex:1 1 56px;min-width:52px;text-align:center;background:var(--m-bg2);border:1px solid var(--m-border);border-radius:7px;padding:5px 4px;}
.mon-stat-lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.3px;color:var(--m-text2);}
.mon-stat-val{font-size:18px;font-weight:800;color:var(--m-accent);line-height:1.2;}
.mon-ac .mon-stat-val,.mon-hp .mon-stat-val{color:var(--m-text);}
.mon-stat.roll{cursor:pointer;transition:border-color .12s,background .12s;}
.mon-stat.roll:hover{border-color:var(--m-accent);background:var(--m-bg3);}
.mon-abils{display:flex;gap:5px;margin-bottom:11px;}
.mon-abil{flex:1;text-align:center;background:var(--m-bg3);border:1px solid var(--m-border);border-radius:7px;padding:4px 2px;}
.mon-abil-k{font-size:10px;font-weight:700;color:var(--m-text2);}
.mon-abil-v{font-size:15px;font-weight:800;color:var(--m-text);}
.mon-lines{margin-bottom:10px;}
.mon-line{margin:3px 0;font-size:12.5px;}
.mon-line b{color:var(--m-accent);font-weight:700;}
.mon-skills{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:6px;}
.mon-skill{font-size:11.5px;background:var(--m-bg2);border:1px solid var(--m-border);border-radius:14px;padding:3px 10px;cursor:pointer;transition:border-color .12s,background .12s;}
.mon-skill b{color:var(--m-accent);}
.mon-skill:hover{border-color:var(--m-accent);background:var(--m-bg3);}
.mon-sec{margin-top:13px;}
.mon-sec-hd{font-size:13px;font-weight:800;color:var(--m-accent);font-family:"EczarMon",serif;letter-spacing:.5px;border-bottom:2px solid var(--m-border);padding-bottom:3px;margin-bottom:7px;display:flex;align-items:center;gap:7px;flex-wrap:wrap;}
.mon-sc-dc{font-size:11px;font-weight:700;color:var(--m-text2);background:var(--m-bg2);border:1px solid var(--m-border);border-radius:4px;padding:1px 6px;font-family:inherit;letter-spacing:0;}
.mon-strike{border:1px solid var(--m-border);border-radius:6px;background:var(--m-bg2);margin-bottom:6px;overflow:hidden;}
.mon-ico{width:26px;height:26px;flex:0 0 auto;border-radius:5px;object-fit:cover;background:#f3e7cd;border:1px solid var(--m-border2);box-shadow:0 0 0 1px rgba(255,255,255,.4) inset,0 1px 2px rgba(60,40,15,.25);}
.mon-ico-sm{width:18px;height:18px;border-radius:4px;vertical-align:middle;margin-right:4px;}
.mon-ico-glyph{display:inline-flex;align-items:center;justify-content:center;background:linear-gradient(180deg,#f3e7cd,#e4d6b5);color:var(--m-accent);font-size:14px;line-height:1;}
.mon-spell{display:inline-flex;align-items:center;background:var(--m-bg2);border:1px solid var(--m-border);border-radius:14px;padding:2px 8px 2px 3px;margin:2px 4px 2px 0;}
.mon-strike-hd{display:flex;align-items:center;gap:8px;padding:5px 10px;background:var(--m-bg4);border-bottom:1px solid var(--m-border);}
.mon-strike-type{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.3px;color:#fff;background:var(--m-accent);border-radius:3px;padding:2px 6px;flex:0 0 auto;}
.mon-strike-name{font-size:13px;font-weight:700;color:var(--m-text);flex:1;cursor:pointer;min-width:0;}
.mon-strike-name:hover{color:var(--m-accent);}
.mon-strike-atk{font-size:15px;font-weight:800;color:var(--m-accent);cursor:pointer;background:var(--m-bg);border:1px solid var(--m-border);border-radius:5px;padding:1px 9px;flex:0 0 auto;transition:.12s;}
.mon-strike-atk:hover{background:var(--m-accent);color:#fff;border-color:var(--m-accent);}
.mon-strike-bd{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:6px 10px;}
.mon-strike-dmg{font-size:13px;font-weight:700;color:var(--m-text);cursor:pointer;}
.mon-strike-dmg:hover{color:var(--m-accent);}
.mon-strike-rng{font-size:11px;color:var(--m-text2);}
.mon-strike-tr{display:flex;flex-wrap:wrap;gap:3px;align-items:center;padding:0 10px 7px;}
.mon-plus{font-size:11px;color:var(--m-accent2);font-weight:600;}
.mon-spell-row{display:flex;gap:8px;margin:4px 0;font-size:12.5px;}
.mon-spell-rank{flex:0 0 52px;font-weight:700;color:var(--m-accent);}
.mon-spell-list{flex:1;min-width:0;}
.mon-ab{border:1px solid var(--m-border);border-radius:6px;background:var(--m-bg2);margin-bottom:6px;overflow:hidden;}
.mon-ab-hd{display:flex;align-items:center;gap:6px;padding:6px 10px;cursor:pointer;list-style:none;}
.mon-ab-hd::-webkit-details-marker{display:none;}
.mon-ab.no-desc .mon-ab-hd{cursor:default;}
.mon-ab-name{font-weight:700;color:var(--m-accent);}
.mon-ab-caret{margin-left:auto;color:var(--m-text2);font-size:10px;transition:transform .15s;}
details.mon-ab[open] .mon-ab-caret{transform:rotate(180deg);}
details.mon-ab[open] .mon-ab-hd{background:var(--m-bg4);border-bottom:1px solid var(--m-border);}
.mon-ab-bd{padding:7px 10px;font-size:12.5px;}
.action-glyph{font-family:"Pathfinder2eActions",sans-serif;font-weight:normal;font-style:normal;color:var(--m-accent);font-size:15px;flex:0 0 auto;}
.mon .roll{position:relative;}
.mon .ref-dmg{color:var(--m-accent);font-weight:600;}
.mon .ref-check{color:#1f4d7a;font-weight:600;}
.mon .ref-area{color:#5b2d7a;font-weight:600;}
.mon .ref-link{color:var(--m-gold);font-weight:600;}
.mon .ref-roll{color:var(--m-accent);font-weight:600;}
.mon-empty{padding:30px;text-align:center;color:#574021;font-family:-apple-system,sans-serif;}`;
  function injectStyles(doc) {
    doc = doc || (typeof document !== 'undefined' ? document : null);
    if (!doc || doc.getElementById('monsterdb-styles')) return;
    const s = doc.createElement('style'); s.id = 'monsterdb-styles'; s.textContent = STYLES;
    (doc.head || doc.documentElement).appendChild(s);
  }

  const API = { load, ingest, getCreature, all, search, view,
    name, level, traits, abilities, ac, hp, perception, saves, speeds, skills,
    strikes, abilitiesList, spellcasting, resolveFoundryRefs, renderStatBlock,
    bindRolls, injectStyles, STYLES, creatureIcon, itemIcon };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.MonsterDB = API;
})(typeof window !== 'undefined' ? window : globalThis);
