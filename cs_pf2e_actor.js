/* cs_pf2e_actor.js — 시트 state → FVTT 액터 빌드 어댑터 (P4-b)
 * 현재 빌더 state(선택 클래스/혈통/배경/재주 + 능력치/레벨)를 FVTT BASE 아이템 doc 묶음으로 변환 →
 * REEngine.build()로 RE 액터 산출 → PF2eStats로 파생 스탯 계산.
 * 의존: cs_pf2e.js(PF2eData) · cs_re_engine.js(REEngine) · cs_pf2e_stats.js(PF2eStats) · CLASS_PROF_TABLE.
 *
 * **비침입 원칙**: 이 어댑터는 기존 cs_calc.js 계산 경로를 대체하지 않는다(병존/진단).
 *   recalcAll은 그대로 두고, 본 모듈은 BASE+RE 파이프라인의 평행 검증/점진 이행 진입점으로만 노출.
 *   DOM 비의존 — 모든 외부값은 opts로 주입(헤드리스 검증 가능).
 * 설계: dev/FVTT_NATIVE_REBASE.md §5 P4.
 */
(function (root) {
  'use strict';
  const isNode = typeof window === 'undefined';
  const PF = root.PF2eData || (isNode ? safeReq('/tmp/PF2e-publish/dev/cs_pf2e.js') : null);
  const REE = root.REEngine || (isNode ? safeReq('/tmp/PF2e-publish/dev/cs_re_engine.js') : null);
  const S = root.PF2eStats || (isNode ? safeReq('/tmp/PF2e-publish/dev/cs_pf2e_stats.js') : null);
  function safeReq(p) { try { return require(p); } catch (e) { return null; } }

  // 레거시 feat id/name → FVTT BASE 재주 doc 해소.
  // 1순위 slug/_id, 2순위 영문명. 미해소는 _miss에 기록.
  function _resolveFeatDoc(key, miss) {
    if (!key || !PF) return null;
    let doc = PF.get('feats', key);
    if (!doc && typeof key === 'string') {
      // "한글 (English)" → English 추출 폴백
      const m = key.match(/\(([^)]+)\)\s*$/);
      if (m) doc = PF.get('feats', m[1].trim());
    }
    if (!doc && miss) miss.push(key);
    return doc;
  }

  // state.feats 전체를 doc 묶음으로. (id 우선, 없으면 name)
  function _collectFeatItems(state, miss) {
    const items = [];
    const feats = (state && state.feats) || {};
    for (const cat of Object.keys(feats)) {
      const arr = feats[cat]; if (!Array.isArray(arr)) continue;
      for (const f of arr) {
        if (!f) continue;
        const doc = _resolveFeatDoc(f.id || f.name, miss);
        if (doc) items.push({ doc, choices: f.choice ? { _legacy: f.choice } : {} });
      }
    }
    return items;
  }

  // 혈통/배경/혈통doc도 RE 보유 가능 → 묶음에 합류.
  function _collectCoreItems(state, miss) {
    const items = [];
    if (!PF) return items;
    const her = state && state.selectedHeritage;
    if (her && (her.id || her.name)) { const d = PF.get('heritages', her.id || her.name_en || her.name); if (d) items.push({ doc: d, choices: {} }); }
    const bg = state && state.selectedBackground;
    if (bg && (bg.id || bg.name)) { const d = PF.get('backgrounds', bg.id || bg.name_en || bg.name); if (d) items.push({ doc: d, choices: {} }); }
    const anc = state && state.selectedAncestry;
    if (anc && (anc.id || anc.name)) { const d = PF.get('ancestries', anc.id || anc.name_en || anc.name); if (d) items.push({ doc: d, choices: {} }); }
    return items;
  }

  /* state → RE 액터.
   * opts = { level, abilityMods:{str..cha}, classSlug, ancestrySlug, traits[] }
   * 반환: { actor, miss[] } — actor=REEngine.build 결과, miss=BASE 미해소 재주 키.
   */
  function buildActor(state, opts) {
    opts = opts || {};
    const miss = [];
    const items = _collectFeatItems(state, miss).concat(_collectCoreItems(state, miss));
    const input = {
      level: opts.level || (state && state.level) || 1,
      abilities: opts.abilityMods || { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
      ancestry: opts.ancestrySlug || (state && state.selectedAncestry && (state.selectedAncestry.id)) || null,
      class: opts.classSlug || (state && state.selectedClass && (state.selectedClass.id)) || null,
      traits: opts.traits || [],
      items,
    };
    const actor = REE && REE.build ? REE.build(input) : null;
    return { actor, miss, input };
  }

  // CLASS_PROF_TABLE 키 매핑(스탯 → 진행표 키)
  const STAT_KEY = { fortitude: 'fort', reflex: 'ref', will: 'will', perception: 'perc', classDC: 'classdc' };

  /* 파생 스탯 계산(BASE+RE 파이프라인).
   * opts(buildActor와 동일) + { classSlug, level, abilityMods, profTable?, armorSlot?, skillContribs? }
   *   - armorSlot: 'armor-unarmored'|'armor-light'|... (AC 숙련 키). 기본 unarmored.
   *   - keyAttr: 클래스 핵심능력(클래스DC/주문). 미지정 시 'str'.
   *   - skillContribs: { acrobatics: 2, ... } 기술 기여(미지정 기술은 미숙련 0).
   * 반환: { ac, fortitude, reflex, will, perception, classDC, skills{} } (각 PF2eStats 결과)
   */
  function deriveStats(state, opts) {
    opts = opts || {};
    const { actor } = buildActor(state, opts);
    const level = opts.level || (state && state.level) || 1;
    const ab = opts.abilityMods || {};
    const cls = opts.classSlug || (state && state.selectedClass && state.selectedClass.id) || null;
    const table = opts.profTable || root.CLASS_PROF_TABLE;
    const keyAttr = opts.keyAttr || 'str';
    const cc = (k) => S.classContrib(cls, k, level, table);
    const out = {};
    out.ac = S.computeAC({ level, abilityMod: ab.dex || 0, contrib: cc(opts.armorSlot || 'armor-unarmored'), reActor: actor });
    out.fortitude = S.computeSave('fortitude', { level, abilityMod: ab.con || 0, contrib: cc('fort'), reActor: actor });
    out.reflex = S.computeSave('reflex', { level, abilityMod: ab.dex || 0, contrib: cc('ref'), reActor: actor });
    out.will = S.computeSave('will', { level, abilityMod: ab.wis || 0, contrib: cc('will'), reActor: actor });
    out.perception = S.computePerception({ level, abilityMod: ab.wis || 0, contrib: cc('perc'), reActor: actor });
    out.classDC = S.computeClassDC({ level, abilityMod: ab[keyAttr] || 0, contrib: cc('classdc'), reActor: actor });
    out.skills = {};
    const sc = opts.skillContribs || {};
    for (const slug of Object.keys(sc)) {
      // 기술 능력치 매핑은 호출측 책임(여기선 dex 기본 대신 명시). opts.skillAbility[slug] 우선.
      const abil = (opts.skillAbility && opts.skillAbility[slug]) || 'dex';
      out.skills[slug] = S.computeSkill(slug, { level, abilityMod: ab[abil] || 0, contrib: sc[slug], reActor: actor });
    }
    out._actor = actor;
    return out;
  }

  /* ── 패리티 하니스 (P4-full 1단계: 신 BASE+RE vs 레거시 대조, 표시값 미변경) ──
   * 완전 모델링된 5종(내성3·지각·클래스DC)만. AC/기술/주문은 방어구·전통 통합 후 확대.
   * parityCompare(legacy, opts): 순수 비교(헤드리스 검증 가능).
   *   legacy = {fortitude,reflex,will,perception,classDC} 숫자(없으면 null=스킵)
   *   opts = {state, level, abilityMods, contribs:{fort,ref,will,perc,classdc}, keyAttr}
   */
  function parityCompare(legacy, opts) {
    opts = opts || {}; legacy = legacy || {};
    const { actor, miss } = buildActor(opts.state || {}, opts);
    const ab = opts.abilityMods || {}; const lv = opts.level || 1; const c = opts.contribs || {};
    const computed = {
      fortitude: S.computeSave('fortitude', { level: lv, abilityMod: ab.con || 0, contrib: c.fort || 0, reActor: actor }).total,
      reflex: S.computeSave('reflex', { level: lv, abilityMod: ab.dex || 0, contrib: c.ref || 0, reActor: actor }).total,
      will: S.computeSave('will', { level: lv, abilityMod: ab.wis || 0, contrib: c.will || 0, reActor: actor }).total,
      perception: S.computePerception({ level: lv, abilityMod: ab.wis || 0, contrib: c.perc || 0, reActor: actor }).total,
      classDC: S.computeClassDC({ level: lv, abilityMod: ab[opts.keyAttr || 'str'] || 0, contrib: c.classdc || 0, reActor: actor }).total,
    };
    const rows = []; let allMatch = true;
    for (const k of Object.keys(computed)) {
      const L = legacy[k] == null ? null : legacy[k], C = computed[k];
      const match = L == null ? null : L === C; if (match === false) allMatch = false;
      rows.push({ stat: k, legacy: L == null ? '—' : L, computed: C, diff: L == null ? '' : C - L, match: match == null ? '(skip)' : (match ? '✓' : '✗') });
    }
    return { rows, allMatch, missCount: miss.length, miss };
  }

  // 라이브 DOM에서 레거시 값/숙련기여 읽어 대조(브라우저 콘솔용). 표시값은 건드리지 않음.
  function parityReportLive() {
    if (isNode) return null;
    if (typeof getMod !== 'function' || typeof getLevel !== 'function') { (root.console || console).warn('[PF2e parity] 레거시 calc 함수 미로드'); return null; }
    const g = id => document.getElementById(id);
    const num = el => { if (!el) return null; const t = (el.textContent || '').replace(/[+\s]/g, ''); const n = parseInt(t); return Number.isNaN(n) ? null : n; };
    const pv = id => parseInt((g(id) || {}).value || 0) || 0;
    const level = getLevel();
    const ab = {}; ['str', 'dex', 'con', 'int', 'wis', 'cha'].forEach(a => ab[a] = getMod(a));
    const contribs = { fort: pv('prof-fort'), ref: pv('prof-ref'), will: pv('prof-will'), perc: pv('prof-perc'), classdc: pv('prof-classdc') };
    const keyAttr = (typeof getClassKeyAttr === 'function' ? getClassKeyAttr() : 'str') || 'str';
    const legacy = { fortitude: num(g('val-fort')), reflex: num(g('val-ref')), will: num(g('val-will')), perception: num(g('val-perc')), classDC: num(g('val-classdc')) };
    const st = (typeof state !== 'undefined') ? state : {};
    const r = parityCompare(legacy, { state: st, level, abilityMods: ab, contribs, keyAttr });
    try { console.table(r.rows); } catch (e) { console.log(JSON.stringify(r.rows, null, 1)); }
    console.log(`[PF2e parity] ${r.allMatch ? '✅ 전부 일치' : '⚠ 불일치 있음'} | 미해소 재주 ${r.missCount}` + (r.miss.length ? ' → ' + r.miss.slice(0, 10).join(', ') : ''));
    return r;
  }

  const API = { buildActor, deriveStats, parityCompare, parityReportLive, _resolveFeatDoc, STAT_KEY };
  root.PF2eActor = API;
  if (isNode && typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
