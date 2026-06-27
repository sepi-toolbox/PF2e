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
  const RARITY_KO = { uncommon: '비범', rare: '희귀', unique: '고유', common: '일반' };
  function _g(cat, slug) { const m = _gloss[cat]; const v = m && m[slug]; return v != null ? v : slug; }

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
  const SIZE_KO = { tiny: '초소형', sm: '소형', med: '중형', lg: '대형', huge: '거대', grg: '초대형' };
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
        slug: it.slug,
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
        slug: it.slug,
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
        slug: it.slug,
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
  const DMG_KO = { piercing:'관통', slashing:'참격', bludgeoning:'타격', fire:'화염', cold:'냉기', acid:'산성', electricity:'전기', sonic:'음향', mental:'정신', poison:'독', void:'공허', spirit:'정신력', vitality:'생명력', force:'역장', bleed:'출혈', untyped:'', precision:'정밀' };
  const SAVE_KO2 = { fortitude:'인내', reflex:'반사', will:'의지' };
  function _esc(s){ return String(s==null?'':s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  function resolveFoundryRefs(html){
    if(!html) return '';
    let s = String(html);
    // 인라인 굴림 매크로 [[/gmr 1d4 #hours]]{라벨} → 라벨, 없으면 주사위식만
    s = s.replace(/\[\[([^\]]*)\]\](?:\{([^}]*)\})?/g, (m,body,label)=>{
      if(label) return `<span class="ref-roll">${_esc(label)}</span>`;
      const dice = body.replace(/^\s*\/[a-z]+\s*/i,'').replace(/#.*$/,'').trim();
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
  function _glyph(a){ const x=String(a); return ({reaction:'⟲',free:'◇','1':'◆','2':'◆◆','3':'◆◆◆'})[x]||''; }

  // ─── 스탯블록 HTML 렌더 ────────────────────────────────────────
  function renderStatBlock(id){
    const c = getCreature(id); if(!c) return '<div class="sb-empty">생물을 찾을 수 없습니다.</div>';
    const v = view(id), sys = c.system||{}, e=_koOf(c);
    const fmt=arr=>arr.map(x=>x.value!=null?`${x.type} ${x.value}`:x.type);
    const imm=(sys.attributes?.immunities||[]).map(x=>x.type);
    const res=fmt(sys.attributes?.resistances||[]);
    const wk=fmt(sys.attributes?.weaknesses||[]);
    const SPK={land:'',fly:'비행 ',swim:'수영 ',climb:'등반 ',burrow:'굴파기 '};
    const sign=n=>`${n>=0?'+':''}${n}`;
    let h='<div class="sb">';
    h+=`<div class="sb-hd"><span class="sb-name">${_esc(v.name.ko)}</span> <span class="sb-en">${_esc(v.name.en)}</span><span class="sb-lv">생물 ${v.level}</span></div>`;
    h+=`<div class="sb-traits">${[v.traits.rarity!=='common'?(RARITY_KO[v.traits.rarity]||v.traits.rarity):'',v.traits.sizeKo,...v.traits.value.map(t=>_g('trait',t))].filter(Boolean).map(t=>`<span class="trait">${_esc(t)}</span>`).join('')}</div><hr/>`;
    h+=`<div class="sb-row"><b>지각</b> <span class="roll" data-roll="perception" data-mod="${v.perception.mod}" data-label="지각">${sign(v.perception.mod)}</span>${v.perception.senses.length?'; '+v.perception.senses.map(s=>_esc(_g('sense',s))).join(', '):''}</div>`;
    if(e&&e.languages) h+=`<div class="sb-row"><b>언어</b> ${_esc(e.languages)}</div>`;
    if(v.skills.length) h+=`<div class="sb-row"><b>기술</b> ${v.skills.map(s=>{const ko=_g('skill',s.key);return `<span class="roll" data-roll="skill" data-key="${s.key}" data-mod="${s.mod}" data-label="${_esc(ko)}">${_esc(ko)} ${sign(s.mod)}</span>`;}).join(', ')}</div>`;
    h+=`<div class="sb-row sb-abil">${v.abilities.map(a=>`<b>${a.ko}</b> ${sign(a.mod)}`).join('&nbsp;&nbsp;')}</div><hr/>`;
    h+=`<div class="sb-row"><b>AC</b> ${v.ac}; ${v.saves.map(s=>`<b>${s.ko}</b> <span class="roll" data-roll="save" data-key="${s.key}" data-mod="${s.mod}" data-label="${s.ko} 내성">${sign(s.mod)}</span>`).join(', ')}</div>`;
    h+=`<div class="sb-row"><b>HP</b> ${v.hp.value}${v.hp.details?', '+_esc(v.hp.details):''}${imm.length?'; <b>면역</b> '+imm.map(_esc).join(', '):''}${res.length?'; <b>저항</b> '+res.map(_esc).join(', '):''}${wk.length?'; <b>약점</b> '+wk.map(_esc).join(', '):''}</div><hr/>`;
    h+=`<div class="sb-row"><b>이동속도</b> ${v.speeds.map(s=>`${SPK[s.type]!==undefined?SPK[s.type]:s.type+' '}${s.value}피트`).join(', ')}</div>`;
    const _abMap={}; (v.abilitiesList||[]).forEach(a=>{ if(a.slug) _abMap[a.slug]=a.name.ko; });
    const _effKo=s=> _abMap[s] || _gloss.attackEffect[s] || _gloss.condition[s] || _g('trait',s);  // 라이더 효과: 크리처 고유→표준→상태→특성→slug
    for(const st of v.strikes){
      const dmg=st.damage.map(d=>`${d.formula} ${DMG_KO[d.type]!==undefined?DMG_KO[d.type]:d.type}`).join(' + ');
      const eff=(st.effects||[]).map(s=>_esc(_effKo(s)));
      h+=`<div class="sb-row"><b>${st.range?'원거리':'근접'}</b> <span class="roll" data-roll="attack" data-mod="${st.bonus}" data-label="${_esc(st.name.ko)}">${_esc(st.name.ko)} ${sign(st.bonus)}</span>${st.range?` (사거리 ${st.range}피트)`:''}${st.traits.length?` <span class="sb-tr">${st.traits.map(t=>_esc(_g('trait',t))).join(', ')}</span>`:''}, <b>피해</b> <span class="roll" data-roll="damage" data-formula="${_esc(st.damage.map(d=>d.formula).join('+'))}" data-label="${_esc(st.name.ko)}">${dmg||'—'}</span>${eff.length?` <span class="sb-plus">＋ ${eff.join(', ')}</span>`:''}</div>`;
    }
    for(const sc of v.spellcasting){
      h+=`<div class="sb-row"><b>${_esc(sc.name.ko)}</b>${sc.dc!=null?` DC ${sc.dc}`:''}${sc.attack!=null?`, 명중 ${sign(sc.attack)}`:''}${sc.spells.length?'; '+sc.spells.map(sp=>_esc(sp.name.ko)).join(', '):''}</div>`;
    }
    for(const ab of v.abilitiesList){
      h+=`<div class="sb-ab"><b>${_esc(ab.name.ko)}</b> ${_glyph(ab.actions||ab.actionType)}${ab.desc.ko?' '+resolveFoundryRefs(ab.desc.ko):''}</div>`;
    }
    return h+'</div>';
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

  // ─── 스탯블록 스타일 (호스트 독립 — 어느 페이지에 박아도 동일) ──────
  const STYLES = `
.sb{font-family:-apple-system,'Segoe UI',Roboto,sans-serif;font-size:13px;line-height:1.55;color:#e8e3d8;background:#1b1814;border:1px solid #4a3f2e;border-radius:10px;padding:14px 16px;}
.sb hr{border:0;border-top:1px solid #4a3f2e;margin:7px 0;}
.sb-hd{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;}
.sb-name{font-size:19px;font-weight:800;color:#e0b35c;}
.sb-en{font-size:12px;color:#9a8f7a;font-style:italic;}
.sb-lv{margin-left:auto;font-size:12px;font-weight:700;color:#c9b896;background:#2c2519;padding:2px 9px;border-radius:10px;}
.sb-traits{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;}
.sb-traits .trait{font-size:10px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:#e8dcc0;background:#5a1f1f;border:1px solid #7a3030;padding:2px 7px;border-radius:3px;}
.sb-row{margin:3px 0;}
.sb-row b{color:#d4c4a0;}
.sb-abil b{color:#c9b896;}
.sb-tr{font-size:11px;color:#9a8f7a;}
.sb-plus{color:#c98a6a;font-weight:600;}
.sb-ab{margin:5px 0;padding-top:5px;border-top:1px dashed #3a3226;}
.sb-ab b{color:#e0b35c;}
.sb .roll{cursor:pointer;border-bottom:1px dotted #e0b35c;color:#f0e6d2;transition:color .15s,background .15s;padding:0 1px;border-radius:3px;}
.sb .roll:hover{color:#fff;background:#3a2f1a;}
.sb .ref-dmg{color:#e07b5c;font-weight:600;}
.sb .ref-check{color:#7cb3e0;font-weight:600;}
.sb .ref-area{color:#9b8fd0;font-weight:600;}
.sb .ref-link{color:#c9b896;}
.sb-empty{padding:30px;text-align:center;color:#9a8f7a;}`;
  function injectStyles(doc) {
    doc = doc || (typeof document !== 'undefined' ? document : null);
    if (!doc || doc.getElementById('monsterdb-styles')) return;
    const s = doc.createElement('style'); s.id = 'monsterdb-styles'; s.textContent = STYLES;
    (doc.head || doc.documentElement).appendChild(s);
  }

  const API = { load, ingest, getCreature, all, search, view,
    name, level, traits, abilities, ac, hp, perception, saves, speeds, skills,
    strikes, abilitiesList, spellcasting, resolveFoundryRefs, renderStatBlock,
    bindRolls, injectStyles, STYLES };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.MonsterDB = API;
})(typeof window !== 'undefined' ? window : globalThis);
